import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { getLang } from "@/lib/i18n/server";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

const playfair = localFont({
    src: [
        { path: "./fonts/PlayfairDisplay-Variable.ttf", weight: "400 900", style: "normal" },
        { path: "./fonts/PlayfairDisplay-Italic-Variable.ttf", weight: "400 900", style: "italic" },
    ],
    variable: "--font-playfair",
    display: "swap",
});

const manrope = localFont({
    src: "./fonts/Manrope-Variable.ttf",
    weight: "200 800",
    variable: "--font-manrope",
    display: "swap",
});

const cinzelDecorative = localFont({
    src: [
        { path: "./fonts/CinzelDecorative-Bold.ttf", weight: "700", style: "normal" },
        { path: "./fonts/CinzelDecorative-Black.ttf", weight: "900", style: "normal" },
    ],
    variable: "--font-cinzel-decorative",
    display: "swap",
});

const cinzel = localFont({
    src: "./fonts/Cinzel-Variable.ttf",
    weight: "400 900",
    variable: "--font-cinzel",
    display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
    const lang = await getLang();
    const description = lang === "fr" ? "Le site personnel de Bolzano." : "Bolzano's personal website.";
    return {
        metadataBase: new URL("https://bolzanocrafts.com"),
        title: {
            default: "Bolzano Crafts",
            template: "%s | Bolzano Crafts", // appliqué aux sous-pages
        },
        description,
        openGraph: {
            title: "Bolzano Crafts",
            description,
            url: "https://bolzanocrafts.com",
            siteName: "Bolzano Crafts",
            images: ["/og-image.png"], // aperçu affiché quand on partage le lien (idéalement 1200×630)
            type: "website",
        },
        icons: {
            icon: [
                { url: "/favicon/favicon.svg", type: "image/svg+xml" },
                { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
            ],
            shortcut: "/favicon/favicon.ico",
            apple: "/favicon/apple-touch-icon.png",
        },
        manifest: "/favicon/site.webmanifest",
        applicationName: "BCrafts",
    };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
    const lang = await getLang();
    return (
        <html
            lang={lang}
            className={`${playfair.variable} ${manrope.variable} ${cinzelDecorative.variable} ${cinzel.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">
                <LanguageProvider initialLang={lang}>{children}</LanguageProvider>
            </body>
        </html>
    );
}
