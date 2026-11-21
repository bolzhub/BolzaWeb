import type { Lang } from "@/lib/i18n/lang";

// Les noms des dossiers sur le disque sont en français (« Artemis - 8 janvier 2026 »).
// En anglais, la date est convertie à l'affichage (« Artemis - January 8, 2026 »),
// ainsi que quelques mots (« et » → « and », « Divers » → « Miscellaneous »).
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

// Mots des noms de dossiers traduits en anglais (mots entiers uniquement)
const WORDS: [RegExp, string][] = [
    [/(?<![\p{L}])et(?![\p{L}])/gu, "and"],
    [/(?<![\p{L}])Divers(?![\p{L}])/gu, "Miscellaneous"],
];

export function localizeAdrName(name: string, lang: Lang): string {
    if (lang === "fr") return name;
    const translated = WORDS.reduce((acc, [re, en]) => acc.replace(re, en), name);
    return translated.replace(DATE, (_, day: string | undefined, month: string, year: string) => {
        const m = MONTHS[month.toLowerCase()];
        return day ? `${m} ${Number(day)}, ${year}` : `${m} ${year}`;
    });
}
