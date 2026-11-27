"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n/LanguageContext";
import type { Version } from "@/lib/BolzaBoxes/VersionContext";
import {
    MESH_VIEW,
    OBJECT_TYPES,
    getDownloadPath,
    isDrawer,
    objectLabel,
    type Faction,
    type Glass,
    type ObjectType,
} from "@/lib/BolzaBoxes/types";

type Mesh = { object: ObjectType; glass: Glass };
type Choice = ObjectType | "both";

const GLASS_LABEL = { glass: { en: "Window", fr: "Avec vitre" }, "no-glass": { en: "No Window", fr: "Sans vitre" } };

function DownloadIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 3v12M7 10l5 5 5-5M4 19h16" />
        </svg>
    );
}

// Icône de téléchargement + fenêtre qui ne propose que les meshs réels (pas les placeholders) :
// la liste vient de /api/bolzaboxes/meshes, qui lit l'en-tête de chaque fichier sur le disque.
export default function MeshDownload({ faction, version }: { faction: Faction; version: Version }) {
    const lang = useLang();
    const fr = lang === "fr";
    const [open, setOpen] = useState(false);
    const [available, setAvailable] = useState<Mesh[] | null>(null);
    const [choice, setChoice] = useState<Choice | null>(null);
    const [glass, setGlass] = useState<Glass | null>(null);

    useEffect(() => {
        if (!open) return;
        let cancelled = false;
        fetch(`/api/bolzaboxes/meshes?faction=${faction.slug}&version=${version}`)
            .then((r) => (r.ok ? r.json() : { available: [] }))
            .then((d: { available: Mesh[] }) => {
                if (!cancelled) setAvailable(d.available);
            })
            .catch(() => !cancelled && setAvailable([]));
        return () => {
            cancelled = true;
        };
    }, [open, faction.slug, version]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    // choix proposés : chaque objet téléchargeable de la boîte, plus « les deux » (ou « tout ») s'il y a tiroir et conteneur
    const objects = faction.objects.filter((o) => o !== "box");

    // un tiroir n'a pas de variante avec / sans vitre : il compte pour les deux
    const has = (object: ObjectType, g: Glass) =>
        !!available?.some((m) => m.object === object && (isDrawer(object) || m.glass === g));
    const needsGlass = (c: Choice) => objectsFor(c).some((o) => !isDrawer(o));
    const objectsFor = (c: Choice): ObjectType[] =>
        c === "both" ? objects.filter((o) => isDrawer(o) || o === "container") : [c];
    const choiceAvailable = (c: Choice, g: Glass) => objectsFor(c).every((o) => has(o, g));

    const choices: Choice[] =
        objects.includes("drawer") && objects.includes("container") ? [...objects, "both"] : objects;
    const visibleChoices = choices.filter((c) => choiceAvailable(c, "glass") || choiceAvailable(c, "no-glass"));
    const glasses = (["glass", "no-glass"] as Glass[]).filter((g) =>
        choice && needsGlass(choice) ? choiceAvailable(choice, g) : false,
    );
    const ready = !!choice && (!needsGlass(choice) || !!glass);

    const label = (c: Choice) =>
        c === "both"
            ? objectsFor("both").length > 2
                ? fr
                    ? "Tout"
                    : "All"
                : fr
                  ? "Les deux"
                  : "Both"
            : objectLabel(faction, c, lang);

    const download = () => {
        if (!choice || !ready) return;
        for (const object of objectsFor(choice)) {
            const a = document.createElement("a");
            a.href = getDownloadPath(faction.slug, version, object, MESH_VIEW, glass ?? "glass");
            a.download = "";
            document.body.appendChild(a);
            a.click();
            a.remove();
        }
        setOpen(false);
    };

    const openDialog = () => {
        setAvailable(null);
        setChoice(null);
        setGlass(null);
        setOpen(true);
    };

    const optionClass = (active: boolean) =>
        `rounded-full px-4 py-2 text-sm transition-colors ${active ? "bg-ink text-cream" : "bg-ink/5 text-ink hover:bg-ink/10"}`;

    return (
        <>
            <button
                onClick={openDialog}
                aria-label={fr ? "Télécharger un mesh" : "Download a mesh"}
                title={fr ? "Télécharger un mesh" : "Download a mesh"}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg opacity-70 transition-opacity hover:opacity-100"
            >
                <DownloadIcon />
            </button>

            {open && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
                    onClick={() => setOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-label={fr ? "Télécharger un mesh" : "Download a mesh"}
                >
                    <div
                        className="w-full max-w-sm rounded-2xl bg-cream p-6 text-ink shadow-xl"
                        style={{ fontFamily: "var(--font-playfair)" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="mb-1 text-xl font-bold">{fr ? "Télécharger un mesh" : "Download a mesh"}</h2>
                        <p className="mb-5 text-sm opacity-60">
                            {faction.name[lang]} ·{" "}
                            {version === "french"
                                ? fr
                                    ? "version française"
                                    : "French version"
                                : fr
                                  ? "version internationale"
                                  : "International version"}
                        </p>

                        {available === null && (
                            <p className="text-sm opacity-60">
                                {fr ? "Recherche des fichiers…" : "Looking for files…"}
                            </p>
                        )}

                        {available !== null && visibleChoices.length === 0 && (
                            <p className="text-sm">
                                {fr
                                    ? "Aucun mesh n'est encore disponible pour cette boîte."
                                    : "No mesh is available for this box yet."}
                            </p>
                        )}

                        {visibleChoices.length > 0 && (
                            <>
                                <div className="mb-4 flex flex-wrap gap-2">
                                    {visibleChoices.map((c) => (
                                        <button
                                            key={c}
                                            className={optionClass(choice === c)}
                                            onClick={() => {
                                                setChoice(c);
                                                // garde le choix de vitre s'il existe encore pour cet objet
                                                setGlass((g) => (g && choiceAvailable(c, g) ? g : null));
                                            }}
                                        >
                                            {label(c)}
                                        </button>
                                    ))}
                                </div>

                                {choice && glasses.length > 0 && (
                                    <div className="mb-6 flex flex-wrap gap-2">
                                        {glasses.map((g) => (
                                            <button
                                                key={g}
                                                className={optionClass(glass === g)}
                                                onClick={() => setGlass(g)}
                                            >
                                                {GLASS_LABEL[g][lang]}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        <div className="flex justify-end gap-3">
                            <button
                                className="rounded-full px-4 py-2 text-sm opacity-70 hover:opacity-100"
                                onClick={() => setOpen(false)}
                            >
                                {fr ? "Fermer" : "Close"}
                            </button>
                            {visibleChoices.length > 0 && (
                                <button
                                    disabled={!ready}
                                    onClick={download}
                                    className="flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-bold text-cream disabled:opacity-40"
                                >
                                    <DownloadIcon />
                                    {fr ? "Télécharger" : "Download"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
