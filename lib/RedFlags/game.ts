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
export function verdict(accepted: number, exhausted: boolean): { title: string; text: string } {
    if (exhausted)
        return {
            title: "Amour inconditionnel",
            text: "Tu as tout accepté. Absolument tout. Il n'y a plus aucun red flag à te proposer. Mariez-vous.",
        };
    if (accepted === 0)
        return {
            title: "Tolérance zéro",
            text: "Un seul red flag et c'est terminé. Tes standards sont en béton armé.",
        };
    if (accepted <= 3) return { title: "Exigeant·e", text: "Tu laisses une petite chance, mais pas deux de trop." };
    if (accepted <= 7)
        return { title: "Ouvert·e d'esprit", text: "Tu sais passer sur quelques défauts. Jusqu'à un certain point." };
    if (accepted <= 15)
        return {
            title: "Très, très patient·e",
            text: "À ce stade, ce n'est plus de la tolérance, c'est de l'abnégation.",
        };
    if (accepted <= 30) return { title: "Aveugle", text: "Les red flags ? Tu les prends pour des fanions de fête." };
    return { title: "Cas désespéré", text: "Tu collectionnes les red flags comme d'autres les timbres." };
}
