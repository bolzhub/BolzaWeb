import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/chant/auth";
import { ChantError, createSong, deleteSong } from "@/lib/chant/storage";
import { errorResponse, unauthorized } from "@/lib/chant/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return unauthorized();
  try {
    const body = await req.json().catch(() => null);
    if (typeof body?.name !== "string") throw new ChantError("Nom manquant.");
    return NextResponse.json({ song: await createSong(body.name) });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthenticated())) return unauthorized();
  try {
    const body = await req.json().catch(() => null);
    if (typeof body?.song !== "string") throw new ChantError("Dossier manquant.");
    await deleteSong(body.song);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}