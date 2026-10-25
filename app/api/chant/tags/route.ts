import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/chant/auth";
import { createTag, deleteTag } from "@/lib/chant/storage";
import { errorResponse, unauthorized } from "@/lib/chant/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return unauthorized();
  try {
    const body = await req.json().catch(() => null);
    const tag = await createTag(typeof body?.name === "string" ? body.name : "");
    return NextResponse.json({ tag });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthenticated())) return unauthorized();
  try {
    const body = await req.json().catch(() => null);
    await deleteTag(typeof body?.name === "string" ? body.name : "");
    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}