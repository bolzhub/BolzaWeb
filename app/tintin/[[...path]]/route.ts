import { createReadStream } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";

const SITE_ROOT =
  "/mnt/Bolzananas/Crafts/XXXXXX Site Tintin 01 01 2013/monsitetintinmaven";

const URL_PREFIX = "/tintin";
// Certaines anciennes pages remontent d'un ou deux dossiers de trop : on sert donc
// le site sous /tintin/www/monsitetintinmaven/ pour que ces remontées restent
// dans /tintin/, puis on ignore ces préfixes d'habillage pour retrouver le fichier.
const ENTRY = `${URL_PREFIX}/www/monsitetintinmaven/index.htm`;
const WRAPPERS = new Set(["www", "monsitetintinmaven"]);
const MAX_STRIP = 3;

// 🎛️ Bandeau "Bolzano Crafts / Accueil Tintin" ajouté en haut de chaque ancienne page
const INJECT_NAV = true;

// 🎛️ Jamais servis (chemins relatifs à la racine du site, insensibles à la casse)
const BLOCKED_PREFIXES = [
  "images/telechargement",
  // "Quick et Flupke/videos",
];
// 🎛️ Jamais servis, quel que soit le dossier
const BLOCKED_EXTENSIONS = new Set([".exe", ".torrent", ".rar", ".zip", ".cbz", ".cbr"]);

const TYPES: Record<string, string> = {
  ".htm": "text/html; charset=windows-1252",
  ".html": "text/html; charset=windows-1252",
  ".txt": "text/plain; charset=windows-1252",
  ".css": "text/css",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".avi": "video/x-msvideo",
  ".mkv": "video/x-matroska",
  ".flv": "video/x-flv",
  ".ttf": "font/ttf",
};

const OVERLAY =
  '<div style="position:fixed;top:8px;left:8px;z-index:99999;display:flex;align-items:center;gap:10px;padding:4px 10px;background:rgba(255,255,255,.92);border:1px solid #ccc;border-radius:10px;font:13px/1.2 sans-serif;box-shadow:0 1px 4px rgba(0,0,0,.2)">' +
  '<a href="/" title="Bolzano Crafts" style="display:flex"><img src="/logo/logo-icon.svg" alt="Bolzano Crafts" style="height:26px;width:auto;border:0"></a>' +
  `<a href="${ENTRY}" style="color:#3a352c;text-decoration:none">Accueil Tintin</a>` +
  "</div>";

function notFound() {
  const html = `<!doctype html><meta charset="utf-8"><title>Page introuvable</title>
<body style="font-family:sans-serif;max-width:32rem;margin:4rem auto;padding:0 1rem">
<h1>Page introuvable</h1>
<p>Cette page n'existe pas dans l'archive d'origine.</p>
<p><a href="${ENTRY}">Accueil de l'archive</a> · <a href="/">Bolzano Crafts</a></p>`;
  return new Response(html, {
    status: 404,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

const realRoot = fs.realpath(SITE_ROOT).catch(() => SITE_ROOT);
const key = (s: string) => s.normalize("NFC").toLowerCase();

type Listing = { names: Set<string>; lower: Map<string, string> };
const cache = new Map<string, Listing | null>();

async function listing(dir: string): Promise<Listing | null> {
  if (cache.has(dir)) return cache.get(dir) ?? null;
  let result: Listing | null = null;
  try {
    const names = await fs.readdir(dir);
    result = { names: new Set(names), lower: new Map(names.map((n) => [key(n), n])) };
  } catch {
    result = null;
  }
  cache.set(dir, result);
  return result;
}

function parseSegments(pathname: string): string[] | null {
  const out: string[] = [];
  for (const raw of pathname.slice(URL_PREFIX.length).split("/")) {
    if (raw === "") continue;
    let s: string;
    try {
      s = decodeURIComponent(raw);
    } catch {
      return null;
    }
    if (s === "." || s === ".." || /[\0/\\]/.test(s)) return null;
    out.push(s);
  }
  return out;
}

async function resolveFile(segments: string[]): Promise<string | null> {
  let cur = SITE_ROOT;
  for (const part of segments) {
    const l = await listing(cur);
    if (!l) return null;
    if (l.names.has(part)) {
      cur = path.join(cur, part);
    } else {
      const alt = l.lower.get(key(part));
      if (!alt) return null;
      cur = path.join(cur, alt);
    }
  }
  return cur;
}

export async function GET(req: Request) {
  const parsed = parseSegments(new URL(req.url).pathname);
  if (!parsed) return notFound();

  // /tintin, /tintin/www, /tintin/www/monsitetintinmaven -> accueil de l'archive
  if (parsed.every((s) => WRAPPERS.has(key(s)))) {
    return new Response(null, { status: 307, headers: { Location: ENTRY } });
  }

  const rootList = await listing(SITE_ROOT);
  if (!rootList) return notFound();
  const atRoot = (s: string) => rootList.names.has(s) || rootList.lower.has(key(s));

  // On ignore les premiers segments qui n'existent pas à la racine du site
  // (www, monsitetintinmaven...), en gardant toujours au moins un segment.
  let skip = 0;
  while (skip < parsed.length - 1 && skip < MAX_STRIP && !atRoot(parsed[skip])) skip++;
  const segments = parsed.slice(skip);

  const resolved = await resolveFile(segments);
  if (!resolved) return notFound();

  const relParts = path.relative(SITE_ROOT, resolved).split(path.sep);
  if (relParts.some((p) => p.startsWith(".") || p.toLowerCase() === "_notes")) return notFound();

  const rel = relParts.join("/").toLowerCase();
  if (BLOCKED_PREFIXES.some((p) => rel === p.toLowerCase() || rel.startsWith(p.toLowerCase() + "/"))) {
    return notFound();
  }
  const ext = path.extname(resolved).toLowerCase();
  if (BLOCKED_EXTENSIONS.has(ext)) return notFound();

  const st = await fs.stat(resolved).catch(() => null);
  if (!st || !st.isFile()) return notFound();

  const real = await fs.realpath(resolved).catch(() => null);
  if (!real || !real.startsWith((await realRoot) + path.sep)) return notFound();

  const known = TYPES[ext];
  const headers = new Headers({
    "Content-Type": known ?? "application/octet-stream",
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=86400",
    "Last-Modified": st.mtime.toUTCString(),
    "X-Content-Type-Options": "nosniff",
  });
  if (!known) headers.set("Content-Disposition", "attachment");

  // Pages HTML : petit fichier, lu en entier (latin1 = octets conservés à l'identique)
  if (ext === ".htm" || ext === ".html") {
    let html = (await fs.readFile(resolved)).toString("latin1");
    if (INJECT_NAV) {
      html = /<body[^>]*>/i.test(html)
        ? html.replace(/<body[^>]*>/i, (m) => m + OVERLAY)
        : html + OVERLAY;
    }
    const body = Buffer.from(html, "latin1");
    headers.set("Content-Length", String(body.length));
    return new Response(body, { status: 200, headers });
  }

  const size = st.size;
  if (size === 0) {
    headers.set("Content-Length", "0");
    return new Response(null, { status: 200, headers });
  }

  let start = 0;
  let end = size - 1;
  let status = 200;
  const m = /^bytes=(\d*)-(\d*)$/.exec((req.headers.get("range") ?? "").trim());
  if (m && (m[1] || m[2])) {
    if (m[1] === "") {
      start = Math.max(size - Number(m[2]), 0);
    } else {
      start = Number(m[1]);
      if (m[2]) end = Math.min(Number(m[2]), size - 1);
    }
    if (start > end || start >= size) {
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
    }
    status = 206;
    headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
  }

  headers.set("Content-Length", String(end - start + 1));
  const stream = createReadStream(resolved, { start, end });
  return new Response(Readable.toWeb(stream) as unknown as ReadableStream, { status, headers });
}