import { NextRequest, NextResponse } from "next/server";
import { createReadStream } from "node:fs";
import fs from "node:fs/promises";
import { Readable } from "node:stream";
import { isAuthenticated } from "@/lib/chant/auth";
import { getFileInfo } from "@/lib/chant/fileTypes";
import { filePath } from "@/lib/chant/storage";
import { errorResponse, unauthorized } from "@/lib/chant/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const asciiName = (n: string) => n.replace(/[^\x20-\x7E]/g, "_").replace(/["\\]/g, "_");
const encodeRfc5987 = (n: string) =>
  encodeURIComponent(n).replace(/['()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());

export async function GET(req: NextRequest) {
  if (!(await isAuthenticated())) return unauthorized();

  try {
    const q = req.nextUrl.searchParams;
    const song = q.get("song") ?? "";
    const name = q.get("name") ?? "";
    const download = q.get("download") === "1";

    const full = filePath(song, name);
    const st = await fs.stat(full).catch(() => null);
    if (!st || !st.isFile()) {
      return NextResponse.json({ error: "Fichier introuvable." }, { status: 404 });
    }

    const info = getFileInfo(name);
    const inline = info.inline && !download;
    const size = st.size;

    const headers = new Headers({
      "Content-Type": info.mime,
      "Accept-Ranges": "bytes",
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${asciiName(name)}"; filename*=UTF-8''${encodeRfc5987(name)}`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-cache",
      "Last-Modified": st.mtime.toUTCString(),
    });

    if (size === 0) {
      headers.set("Content-Length", "0");
      return new Response(null, { status: 200, headers });
    }

    let start = 0;
    let end = size - 1;
    let status = 200;

    const range = req.headers.get("range");
    const m = range ? /^bytes=(\d*)-(\d*)$/.exec(range.trim()) : null;
    if (m && (m[1] || m[2])) {
      if (m[1] === "") {
        start = Math.max(size - Number(m[2]), 0);
      } else {
        start = Number(m[1]);
        if (m[2]) end = Math.min(Number(m[2]), size - 1);
      }
      if (start > end || start >= size) {
        return new Response(null, {
          status: 416,
          headers: { "Content-Range": `bytes */${size}` },
        });
      }
      status = 206;
      headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
    }

    headers.set("Content-Length", String(end - start + 1));
    const stream = createReadStream(full, { start, end });
    return new Response(Readable.toWeb(stream) as unknown as ReadableStream, { status, headers });
  } catch (err) {
    return errorResponse(err);
  }
}