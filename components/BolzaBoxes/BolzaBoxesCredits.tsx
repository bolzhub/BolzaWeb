"use client";

import { useLang } from "@/lib/i18n/LanguageContext";

export const LICENSE_URL = "https://creativecommons.org/licenses/by-nc-sa/4.0/";
export const REPO_URL = "https://github.com/bolzhub/Root-BolzaBoxes";

// Remerciements et licence, repris du README du dépôt GitHub du projet
export default function BolzaBoxesCredits() {
    const fr = useLang() === "fr";
    const link = "underline underline-offset-2 hover:opacity-70";

    return (
        <footer
            className="mx-6 mb-6 rounded-3xl bg-cream px-8 py-8 text-ink md:mx-10 md:px-16"
            style={{ marginBottom: "calc(var(--bolzaboxes-switch-zone) + 1rem)" }}
        >
            <div className="grid gap-8 md:grid-cols-2">
                <section>
                    <h2 className="mb-2 text-xl" style={{ fontFamily: "var(--font-playfair)", fontWeight: 700 }}>
                        {fr ? "Remerciements" : "Acknowledgements"}
                    </h2>
                    <p className="leading-relaxed">
                        {fr
                            ? "Merci à Paul, Tanguy, Suzanne, Adrien et à ma famille pour leur aide et leur soutien."
                            : "Thanks to Paul, Tanguy, Suzanne, Adrien and my family for their help and support."}
                    </p>
                </section>
                <section>
                    <h2 className="mb-2 text-xl" style={{ fontFamily: "var(--font-playfair)", fontWeight: 700 }}>
                        {fr ? "Licence" : "License"}
                    </h2>
                    <p className="leading-relaxed">
                        {fr
                            ? "Ceci n'est pas un produit officiel de Leder Games."
                            : "This is not an official product of Leder Games."}
                        <br />
                        Root Inserts © 2025 Romain Chaussonnier{" "}
                        {fr ? "est mis à disposition sous licence" : "is licensed under"}{" "}
                        <a href={LICENSE_URL} target="_blank" rel="noopener noreferrer license" className={link}>
                            CC BY-NC-SA 4.0
                        </a>
                        {fr
                            ? " : partage et adaptation autorisés en citant l'auteur, sans usage commercial, et sous la même licence."
                            : ": sharing and adapting are allowed with attribution, for non-commercial use only, under the same license."}
                    </p>
                    <p className="mt-2 leading-relaxed">
                        <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className={link}>
                            {fr ? "Fichiers et sources sur GitHub" : "Files and sources on GitHub"}
                        </a>
                    </p>
                </section>
            </div>
        </footer>
    );
}
