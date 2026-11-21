import type { Lang } from "@/lib/i18n/lang";

// Mélange de Fisher-Yates : l'ordre de tirage des red flags pour une partie
export function shuffle<T>(list: readonly T[]): T[] {
    const out = [...list];
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
}

// Verdict du résumé selon le nombre de red flags acceptés (avant celui de trop)
type Verdict = { title: string; text: string };

const VERDICTS: Record<Lang, Record<"exhausted" | "zero" | "le3" | "le7" | "le15" | "le30" | "more", Verdict>> = {
    fr: {
        exhausted: {
            title: "Amour inconditionnel",
            text: "Tu as tout accepté. Absolument tout. Il n’y a plus aucun red flag à te proposer. Mariez-vous.",
        },
        zero: { title: "Tolérance zéro", text: "Un seul red flag et c’est terminé. Tes standards sont en béton armé." },
        le3: { title: "Exigeant·e", text: "Tu laisses une petite chance, mais pas deux de trop." },
        le7: { title: "Ouvert·e d’esprit", text: "Tu sais passer sur quelques défauts. Jusqu’à un certain point." },
        le15: {
            title: "Très, très patient·e",
            text: "À ce stade, ce n’est plus de la tolérance, c’est de l’abnégation.",
        },
        le30: { title: "Aveugle", text: "Les red flags ? Tu les prends pour des fanions de fête." },
        more: { title: "Cas désespéré", text: "Tu collectionnes les red flags comme d’autres les timbres." },
    },
    en: {
        exhausted: {
            title: "Unconditional love",
            text: "You accepted everything. Absolutely everything. There are no red flags left to show you. Get married.",
        },
        zero: {
            title: "Zero tolerance",
            text: "One red flag and it’s over. Your standards are made of reinforced concrete.",
        },
        le3: { title: "Demanding", text: "You give a small chance, but not two too many." },
        le7: { title: "Open-minded", text: "You can overlook a few flaws. Up to a point." },
        le15: { title: "Very, very patient", text: "At this point, it’s not tolerance anymore, it’s self-sacrifice." },
        le30: { title: "Blind", text: "Red flags? You think they’re party bunting." },
        more: { title: "Hopeless case", text: "You collect red flags the way other people collect stamps." },
    },
};

export function verdict(accepted: number, exhausted: boolean, lang: Lang): Verdict {
    const v = VERDICTS[lang];
    if (exhausted) return v.exhausted;
    if (accepted === 0) return v.zero;
    if (accepted <= 3) return v.le3;
    if (accepted <= 7) return v.le7;
    if (accepted <= 15) return v.le15;
    if (accepted <= 30) return v.le30;
    return v.more;
}
