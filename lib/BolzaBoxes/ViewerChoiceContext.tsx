"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Glass, ObjectType } from "./types";

// Choix faits dans le visualiseur (vue, objet, vitre), gardés quand on passe d'une faction à l'autre :
// le fournisseur vit dans BoxesFrame, qui reste monté entre les pages de faction.
export type ViewerChoice = { viewModeId: string; objectType: ObjectType | null; glass: Glass };

type Value = ViewerChoice & { update: (patch: Partial<ViewerChoice>) => void };

const DEFAULT: ViewerChoice = { viewModeId: "full", objectType: null, glass: "glass" };
const ViewerChoiceContext = createContext<Value | null>(null);

export function ViewerChoiceProvider({ children }: { children: ReactNode }) {
    const [choice, setChoice] = useState<ViewerChoice>(DEFAULT);
    const update = (patch: Partial<ViewerChoice>) => setChoice((c) => ({ ...c, ...patch }));
    return <ViewerChoiceContext.Provider value={{ ...choice, update }}>{children}</ViewerChoiceContext.Provider>;
}

export function useViewerChoice(): Value {
    const ctx = useContext(ViewerChoiceContext);
    if (!ctx) throw new Error("useViewerChoice doit être utilisé dans ViewerChoiceProvider");
    return ctx;
}
