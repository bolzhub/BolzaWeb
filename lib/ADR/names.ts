import type { Lang } from "@/lib/i18n/lang";

// Les noms des dossiers sur le disque sont en français (« Artemis - 8 janvier 2026 »).
// En anglais, la date est convertie à l'affichage (« Artemis - January 8, 2026 »).
const MONTHS: Record<string, string> = {
    janvier: "January",
    février: "February",
    fevrier: "February",
    mars: "March",
    avril: "April",
    mai: "May",
    juin: "June",
    juillet: "July",
    août: "August",
    aout: "August",
    septembre: "September",
    octobre: "October",
    novembre: "November",
    décembre: "December",
    decembre: "December",
};

const DATE = new RegExp(`(?:\\b(\\d{1,2})(?:er)?\\s+)?\\b(${Object.keys(MONTHS).join("|")})\\s+(\\d{4})\\b`, "giu");

export function localizeAdrName(name: string, lang: Lang): string {
    if (lang === "fr") return name;
    return name.replace(DATE, (_, day: string | undefined, month: string, year: string) => {
        const m = MONTHS[month.toLowerCase()];
        return day ? `${m} ${Number(day)}, ${year}` : `${m} ${year}`;
    });
}
