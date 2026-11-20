import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

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

export const metadata: Metadata = {
    metadataBase: new URL("https://bolzanocrafts.com"),
    title: {
        default: "Bolzano Crafts",
        template: "%s | Bolzano Crafts", // appliqué aux sous-pages
    },
    description: "Bolzano's personal website.",
    openGraph: {
        title: "Bolzano Crafts",
        description: "Bolzano's personal website.",
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

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={`${playfair.variable} ${manrope.variable} ${cinzelDecorative.variable} ${cinzel.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">{children}</body>
        </html>
    );
}