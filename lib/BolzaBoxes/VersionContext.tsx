"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Version = "international" | "french";

const STORAGE_KEY = "bolzaboxes-version";

type VersionContextValue = {
    version: Version;
    setVersion: (v: Version) => void;
};

const VersionContext = createContext<VersionContextValue | null>(null);

function isVersion(v: string | null): v is Version {
    return v === "international" || v === "french";
}

export function VersionProvider({ children }: { children: ReactNode }) {
    const [version, setVersionState] = useState<Version>("international");
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let initial: Version = "international";
        try {
            // 1. Choix propre à cet onglet (survit au rechargement)
            const session = window.sessionStorage.getItem(STORAGE_KEY);
            // 2. Sinon, dernier choix fait dans n'importe quel onglet (nouvel onglet)
            const local = window.localStorage.getItem(STORAGE_KEY);
            if (isVersion(session)) initial = session;
            else if (isVersion(local)) initial = local;
        } catch {
            // Stockage indisponible : valeur par défaut
        }
        setVersionState(initial);
        setReady(true);
    }, []);

    const setVersion = (v: Version) => {
        setVersionState(v);
        try {
            window.sessionStorage.setItem(STORAGE_KEY, v);
            window.localStorage.setItem(STORAGE_KEY, v);
        } catch {
            // Sauvegarde impossible : le choix reste valable pour la session en cours
        }
    };

    return (
        <VersionContext.Provider value={{ version, setVersion }}>
            {ready ? children : <div className="min-h-[100svh] bg-[#ECE5D8]" />}
        </VersionContext.Provider>
    );
}

export function useVersion() {
    const ctx = useContext(VersionContext);
    if (!ctx) throw new Error("useVersion must be used within a VersionProvider");
    return ctx;
}