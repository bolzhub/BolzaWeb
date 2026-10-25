import { NextResponse } from "next/server";
import { ChantError } from "./storage";

export function unauthorized() {
  return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
}

export function errorResponse(err: unknown) {
  if (err instanceof ChantError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  console.error("[chant]", err);
  return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
}