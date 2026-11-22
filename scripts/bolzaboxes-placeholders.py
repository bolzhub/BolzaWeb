#!/usr/bin/env python3
"""Placeholders des pages Boîtes de BolzaBoxes, un jeu par version (internationale / française).

À lancer sur la Pi :  python3 bolzaboxes-placeholders.py [--dry-run] [--ranger]

Pour chaque boîte et chaque version, crée Boxes/<slug>/<version>/ à partir des placeholders
d'origine (Boxes/<slug>/*.jpg|mp4|glb) :
  - images : bandeau de version ajouté, chemin de remplacement mis à jour en bas ;
  - vidéos : même image fixe, réencodée (3 s) ;
  - meshs  : copie dont l'en-tête glTF indique la version (la signature « BolzaBoxes placeholder »,
             qui permet au site de ne pas proposer ces fichiers en téléchargement, est conservée).
Un fichier déjà présent dans le dossier de version n'est jamais écrasé (vrai fichier déposé, par exemple).
Avec --ranger, les placeholders d'origine sont ensuite rangés dans Boxes/_anciens_placeholders/<slug>/
(à faire une fois le site déployé avec les chemins par version : l'ancien code les utilise encore).

Les listes de boîtes reprennent SIDEBAR_ORDER de lib/BolzaBoxes/factions.ts.
"""

import json
import shutil
import struct
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

BOXES = Path("/mnt/Bolzananas/Projets/Root_BolzaBoxes/Extra/Presentation/Website/Boxes")
ARCHIVE = BOXES / "_anciens_placeholders"

VERSIONS = {
    "international": [
        "cats", "eyries", "alliance", "vagabond", "lizards", "otters", "moles", "corvids", "rats",
        "badgers", "frogs", "bats", "skunks", "setup", "setup2", "landmarks", "cards", "extra",
    ],
    "french": [
        "cats", "eyries", "alliance", "vagabond", "lizards", "otters", "moles", "corvids", "rats",
        "badgers", "setup", "landmarks", "hirelings-setup", "hirelings-unique", "hirelings-factions",
        "cards", "extra",
    ],
}

BANNER = {
    "international": {"text": "INTERNATIONAL VERSION", "bg": (58, 53, 44), "fg": (236, 229, 216)},
    "french": {"text": "VERSION FRANÇAISE", "bg": (31, 78, 156), "fg": (255, 255, 255)},
}

FONT_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
FONT = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
DRY_RUN = "--dry-run" in sys.argv
TIDY = "--ranger" in sys.argv


def stamp(img: Image.Image, version: str, slug: str, filename: str) -> Image.Image:
    """Ajoute le bandeau de version et réécrit le pied de page avec le nouveau chemin."""
    img = img.convert("RGB")
    w, h = img.size
    s = w / 960  # les placeholders d'origine font 960 x 720 (images) ou 640 x 480 (vidéos)
    draw = ImageDraw.Draw(img)
    bg = img.getpixel((int(30 * s), int(h * 0.85)))

    # bandeau de version, entre le titre et le dessin
    b = BANNER[version]
    font = ImageFont.truetype(FONT_BOLD, int(26 * s))
    tw = draw.textlength(b["text"], font=font)
    pad_x, top, bottom = 22 * s, 162 * s, 200 * s
    draw.rounded_rectangle(
        [(w - tw) / 2 - pad_x, top, (w + tw) / 2 + pad_x, bottom], radius=(bottom - top) / 2, fill=b["bg"]
    )
    draw.text((w / 2, (top + bottom) / 2), b["text"], font=font, fill=b["fg"], anchor="mm")

    # pied de page : chemin du fichier à remplacer, désormais dans le dossier de version
    draw.rectangle([16 * s, 622 * s, w - 16 * s, h - 16 * s], fill=bg)
    small = ImageFont.truetype(FONT, int(24 * s))
    draw.text((w / 2, 648 * s), "PLACEHOLDER — à remplacer sur le disque par :", font=small, fill=(40, 40, 40), anchor="mm")
    draw.text(
        (w / 2, 685 * s), f"Bolzananas/…/Boxes/{slug}/{version}/{filename}", font=small, fill=(40, 40, 40), anchor="mm"
    )
    return img


def glb_for_version(data: bytes, version: str) -> bytes:
    """Copie d'un .glb dont le champ « generator » indique la version."""
    magic, ver, _ = struct.unpack_from("<4sII", data, 0)
    assert magic == b"glTF", "pas un fichier glTF binaire"
    json_len, json_type = struct.unpack_from("<II", data, 12)
    doc = json.loads(data[20 : 20 + json_len])
    doc["asset"]["generator"] = f"BolzaBoxes placeholder ({version})"
    new_json = json.dumps(doc, separators=(",", ":")).encode()
    new_json += b" " * (-len(new_json) % 4)  # alignement sur 4 octets exigé par le format
    rest = data[20 + json_len :]
    body = struct.pack("<II", len(new_json), json_type) + new_json + rest
    return struct.pack("<4sII", magic, ver, 12 + len(body)) + body


def video_for_version(src: Path, dst: Path, version: str, slug: str) -> None:
    with tempfile.TemporaryDirectory() as tmp:
        frame = Path(tmp) / "frame.png"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-frames:v", "1", str(frame)], check=True)
        stamped = Path(tmp) / "stamped.png"
        stamp(Image.open(frame), version, slug, dst.name).save(stamped)
        subprocess.run(
            ["ffmpeg", "-v", "error", "-y", "-loop", "1", "-i", str(stamped), "-t", "3", "-r", "24",
             "-c:v", "libx264", "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(dst)],
            check=True,
        )


def main() -> None:
    created = skipped = 0
    for version, slugs in VERSIONS.items():
        for slug in slugs:
            folder = BOXES / slug
            originals = sorted(p for p in folder.iterdir() if p.is_file() and p.suffix in {".jpg", ".mp4", ".glb"})
            if not originals:
                print(f"! {slug} : aucun placeholder d'origine")
                continue
            out_dir = folder / version
            if not DRY_RUN:
                out_dir.mkdir(exist_ok=True)
            for src in originals:
                dst = out_dir / src.name
                if dst.exists():
                    skipped += 1
                    continue
                created += 1
                if DRY_RUN:
                    continue
                if src.suffix == ".jpg":
                    stamp(Image.open(src), version, slug, src.name).save(dst, quality=88)
                elif src.suffix == ".mp4":
                    video_for_version(src, dst, version, slug)
                else:
                    dst.write_bytes(glb_for_version(src.read_bytes(), version))
            print(f"✓ {slug}/{version}")

    # rangement des placeholders d'origine, devenus inutiles
    if TIDY and not DRY_RUN:
        for folder in sorted(p for p in BOXES.iterdir() if p.is_dir() and p != ARCHIVE):
            flat = [p for p in folder.iterdir() if p.is_file() and p.suffix in {".jpg", ".mp4", ".glb"}]
            if flat:
                (ARCHIVE / folder.name).mkdir(parents=True, exist_ok=True)
                for p in flat:
                    shutil.move(str(p), ARCHIVE / folder.name / p.name)

    print(f"{created} fichier(s) créé(s), {skipped} déjà présent(s){' (simulation)' if DRY_RUN else ''}.")


if __name__ == "__main__":
    main()
