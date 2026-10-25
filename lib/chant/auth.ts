import crypto from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "chant_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 jours

function signingKey(): string {
  const secret = process.env.CHANT_SESSION_SECRET;
  const password = process.env.CHANT_PASSWORD;
  if (!secret || secret.length < 16 || !password) {
    throw new Error("CHANT_SESSION_SECRET (16+ caractères) et CHANT_PASSWORD doivent être définis.");
  }
  return `${secret}|${password}`;
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", signingKey()).update(payload).digest("base64url");
}

export function createSessionToken(): string {
  const expires = String(Math.floor(Date.now() / 1000) + SESSION_MAX_AGE);
  return `${expires}.${sign(expires)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature) return false;
  try {
    const expected = Buffer.from(sign(expires));
    const given = Buffer.from(signature);
    if (expected.length !== given.length || !crypto.timingSafeEqual(expected, given)) {
      return false;
    }
  } catch {
    return false; // configuration manquante : on refuse l'accès
  }
  return Number(expires) > Date.now() / 1000;
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export function passwordMatches(input: string): boolean {
  const expected = process.env.CHANT_PASSWORD;
  if (!expected) return false;
  const hash = (s: string) => crypto.createHash("sha256").update(s).digest();
  return crypto.timingSafeEqual(hash(input), hash(expected));
}