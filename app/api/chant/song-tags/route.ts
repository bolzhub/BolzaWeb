import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/chant/auth";
import { ChantError, setSongTag } from "@/lib/chant/storage";
import { errorResponse, unauthorized } from "@/lib/chant/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return unauthorized();
  try {
    const body = await req.json().catch(() => null);
    if (typeof body?.song !== "string" || typeof body?.tag !== "string") {
      throw new ChantError("Paramètres invalides.");
    }
    const tags = await setSongTag(body.song, body.tag, body.on === true);
    return NextResponse.json({ tags });
  } catch (err) {
    return errorResponse(err);
  }
}