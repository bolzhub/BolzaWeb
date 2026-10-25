import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  passwordMatches,
} from "@/lib/chant/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; resetAt: number }>();

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  if (!process.env.CHANT_PASSWORD || !process.env.CHANT_SESSION_SECRET) {
    return NextResponse.json({ error: "Accès non configuré sur le serveur." }, { status: 503 });
  }

  const now = Date.now();
  if (attempts.size > 500) {
    for (const [ip, e] of attempts) if (e.resetAt <= now) attempts.delete(ip);
  }

  const ip = clientIp(req);
  const entry = attempts.get(ip);
  const active = entry && entry.resetAt > now ? entry : null;

  if (active && active.count >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez dans quelques minutes." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!passwordMatches(password)) {
    attempts.set(
      ip,
      active
        ? { count: active.count + 1, resetAt: active.resetAt }
        : { count: 1, resetAt: now + WINDOW_MS }
    );
    await new Promise((r) => setTimeout(r, 500));
    return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
  }

  attempts.delete(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: SESSION_COOKIE,
    value: createSessionToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: req.headers.get("x-forwarded-proto") === "https",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}