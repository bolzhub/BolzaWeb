import HomeBunny from "@/components/site/HomeBunny";
import LanguageSwitch from "@/components/i18n/LanguageSwitch";
import { getLang } from "@/lib/i18n/server";

const TEXT = {
    en: {
        title: "Herodotus The Owl",
        text: "Herodotus' The Owl is a children's book. It has yet to be finished.",
    },
    fr: {
        title: "La Chouette Hérodote",
        text: "La Chouette Hérodote est un livre pour enfants. Il n'est pas encore terminé.",
    },
};

export default async function HerodotusPage() {
    const t = TEXT[await getLang()];
    return (
        <main className="min-h-screen min-h-dvh bg-black">
            <div
                data-nav-row="herodote"
                className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-5 md:px-10"
            >
                <HomeBunny body="#f3ecdc" tail="#000000" />
                <LanguageSwitch />
            </div>

            <div className="relative w-full h-screen">
                <img
                    src="/projects/herodotus/cover.png"
                    alt={t.title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/0" />

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                    <p
                        className="text-white text-lg md:text-2xl max-w-2xl"
                        style={{ fontFamily: "var(--font-manrope)", fontWeight: 500 }}
                    >
                        {t.text}
                    </p>
                </div>
            </div>
        </main>
    );
}
