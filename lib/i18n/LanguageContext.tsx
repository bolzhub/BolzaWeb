"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LANG_COOKIE, type Lang } from "./lang";

type LanguageContextValue = {
    lang: Lang;
    setLang: (lang: Lang) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ initialLang, children }: { initialLang: Lang; children: ReactNode }) {
    const [lang, setLangState] = useState<Lang>(initialLang);
    const router = useRouter();

    const setLang = (next: Lang) => {
        if (next === lang) return;
        setLangState(next); // composants client : changement immédiat
        document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
        document.documentElement.lang = next;
        router.refresh(); // composants serveur : nouveau rendu dans la bonne langue
    };

    return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
}

export function useLang(): Lang {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error("useLang must be used within a LanguageProvider");
    return ctx.lang;
}

export function useSetLang() {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error("useSetLang must be used within a LanguageProvider");
    return ctx.setLang;
}
