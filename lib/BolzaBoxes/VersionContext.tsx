"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Version = "international" | "french";

type VersionContextValue = {
    version: Version;
    setVersion: (v: Version) => void;
};

const VersionContext = createContext<VersionContextValue | null>(null);

export function VersionProvider({ children }: { children: ReactNode }) {
    const [version, setVersion] = useState<Version>("international");
    return (
        <VersionContext.Provider value={{ version, setVersion }}>
            {children}
        </VersionContext.Provider>
    );
}

export function useVersion() {
    const ctx = useContext(VersionContext);
    if (!ctx) throw new Error("useVersion must be used within a VersionProvider");
    return ctx;
}