import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ForestBackground from "@/components/RootBrainTeasers/ForestBackground";
import { ResponsiveLogo } from "@/components/site/Logo";
import LanguageSwitch from "@/components/i18n/LanguageSwitch";
import { getLang } from "@/lib/i18n/server";
import { ASSETS_ROUTE, listAssets, type AssetFile } from "@/lib/RootBrainTeasers/assets";

type Props = { params: Promise<{ path?: string[] }> };

const TEXT = {
    en: {
        title: "Make your own",
        intro: "Assets to build your own Root puzzles. Open a folder, then download the files you need, one by one.",
        root: "Assets",
        empty: "This folder is empty.",
        items: (n: number) => `${n} item${n > 1 ? "s" : ""}`,
        download: "Download",
        open: "Open",
        back: "Puzzles",
    },
    fr: {
        title: "Crée les tiens",
        intro: "Des ressources pour construire tes propres puzzles Root. Ouvre un dossier, puis télécharge les fichiers dont tu as besoin, un par un.",
        root: "Ressources",
        empty: "Ce dossier est vide.",
        items: (n: number) => `${n} élément${n > 1 ? "s" : ""}`,
        download: "Télécharger",
        open: "Ouvrir",
        back: "Puzzles",
    },
};

function formatSize(bytes: number, lang: "en" | "fr"): string {
    const units = lang === "fr" ? ["o", "Ko", "Mo", "Go"] : ["B", "KB", "MB", "GB"];
    let v = bytes;
    let i = 0;
    while (v >= 1024 && i < units.length - 1) {
        v /= 1024;
        i++;
    }
    const n = i === 0 ? String(v) : v.toLocaleString(lang, { maximumFractionDigits: v < 10 ? 1 : 0 });
    return `${n} ${units[i]}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { path } = await params;
    const t = TEXT[await getLang()];
    const last = listAssets(path)?.crumbs.at(-1)?.name;
    return {
        title: last ? `${last} — ${t.title}` : t.title,
        description: t.intro,
    };
}

const PILL = "flex items-center rounded-full bg-cream/95 shadow-md text-ink";

function FolderIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-9 w-9 shrink-0 text-gold" fill="currentColor" aria-hidden="true">
            <path d="M3 6a2 2 0 0 1 2-2h4.2a2 2 0 0 1 1.6.8L12 6.5h7a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
        </svg>
    );
}

function FileIcon({ label }: { label: string }) {
    return (
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-ink/10 text-[0.65rem] font-bold uppercase text-ink/70">
            {label}
        </span>
    );
}

function FileThumb({ file }: { file: AssetFile }) {
    if (file.thumb) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={file.thumb}
                alt=""
                loading="lazy"
                className="h-12 w-12 shrink-0 rounded-lg bg-ink/5 object-contain"
            />
        );
    }
    const ext = file.name.includes(".") ? file.name.split(".").pop()!.slice(0, 4) : "file";
    return <FileIcon label={ext} />;
}

export default async function AssetsPage({ params }: Props) {
    const { path } = await params;
    const listing = listAssets(path);
    if (!listing) notFound();

    const lang = await getLang();
    const t = TEXT[lang];
    const { crumbs, folders, files } = listing;
    const parent = crumbs.length > 1 ? crumbs[crumbs.length - 2].href : ASSETS_ROUTE;

    return (
        <main className="relative min-h-screen flex flex-col">
            <ForestBackground />

            <header data-nav-row="assets" className="flex items-center gap-2 px-4 md:px-10 py-5">
                <Link href="/" aria-label={lang === "fr" ? "Accueil" : "Home"} className={`${PILL} px-4 py-2`}>
                    <ResponsiveLogo />
                </Link>
                <Link href="/RootBrainTeasers" className={`${PILL} px-3 py-2 text-sm`}>
                    <span className="trim-cap">← {t.back}</span>
                </Link>
                <LanguageSwitch className="ml-auto" />
            </header>

            <section className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-6 pb-16">
                <h1
                    className="text-center text-4xl md:text-5xl text-parchment"
                    style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, textShadow: "0 2px 6px rgba(0,0,0,0.45)" }}
                >
                    {t.title}
                </h1>
                <p
                    className="mx-auto mt-4 max-w-2xl text-center text-base md:text-lg text-parchment/90"
                    style={{ textShadow: "0 1px 3px rgba(0,0,0,0.55)" }}
                >
                    {t.intro}
                </p>

                <div className="mt-8 rounded-2xl bg-cream/95 p-3 md:p-5 text-ink shadow-xl">
                    {/* Fil d'Ariane */}
                    <nav className="flex flex-wrap items-center gap-1 px-2 pb-3 text-sm border-b border-ink/10">
                        {crumbs.length > 0 && (
                            <Link
                                href={parent}
                                aria-label={lang === "fr" ? "Dossier parent" : "Parent folder"}
                                className="mr-1 rounded-full px-2 py-1 hover:bg-ink/10"
                            >
                                ↑
                            </Link>
                        )}
                        <Link href={ASSETS_ROUTE} className="rounded px-1 py-1 font-semibold hover:underline">
                            {t.root}
                        </Link>
                        {crumbs.map((c, i) => (
                            <span key={c.href} className="flex items-center gap-1">
                                <span className="text-ink/40">/</span>
                                {i === crumbs.length - 1 ? (
                                    <span className="px-1 py-1 font-semibold">{c.name}</span>
                                ) : (
                                    <Link href={c.href} className="rounded px-1 py-1 hover:underline">
                                        {c.name}
                                    </Link>
                                )}
                            </span>
                        ))}
                    </nav>

                    {folders.length === 0 && files.length === 0 && (
                        <p className="px-2 py-8 text-center text-ink/60">{t.empty}</p>
                    )}

                    {folders.length > 0 && (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-3">
                            {folders.map((f) => (
                                <li key={f.href}>
                                    <Link
                                        href={f.href}
                                        className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-ink/10 transition-colors"
                                    >
                                        <FolderIcon />
                                        <span className="min-w-0">
                                            <span className="block truncate font-semibold">{f.name}</span>
                                            <span className="block text-xs text-ink/60">{t.items(f.count)}</span>
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}

                    {files.length > 0 && (
                        <ul className={`divide-y divide-ink/10 ${folders.length > 0 ? "mt-3 border-t border-ink/10" : ""}`}>
                            {files.map((f) => (
                                <li key={f.downloadUrl} className="flex items-center gap-3 px-2 py-2">
                                    <FileThumb file={f} />
                                    <span className="min-w-0 flex-1">
                                        {f.kind === "other" ? (
                                            <span className="block truncate">{f.name}</span>
                                        ) : (
                                            <a
                                                href={f.viewUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title={t.open}
                                                className="block truncate hover:underline"
                                            >
                                                {f.name}
                                            </a>
                                        )}
                                        <span className="block text-xs text-ink/60">{formatSize(f.size, lang)}</span>
                                    </span>
                                    <a
                                        href={f.downloadUrl}
                                        download={f.name}
                                        aria-label={`${t.download} ${f.name}`}
                                        className="flex shrink-0 items-center gap-2 rounded-full bg-ink px-3 py-2 text-sm text-cream hover:bg-ink/80 transition-colors"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="h-4 w-4"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            <path d="M12 4v11" />
                                            <path d="m7 10 5 5 5-5" />
                                            <path d="M5 20h14" />
                                        </svg>
                                        <span className="hidden sm:inline">{t.download}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>
        </main>
    );
}
