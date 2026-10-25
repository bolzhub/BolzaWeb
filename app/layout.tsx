import type { Metadata } from "next";
import { Playfair_Display, Manrope, Cinzel_Decorative, Cinzel } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
    variable: "--font-playfair",
    subsets: ["latin"],
    weight: ["400", "700"],
});

const manrope = Manrope({
    variable: "--font-manrope",
    subsets: ["latin"],
});

const cinzelDecorative = Cinzel_Decorative({
    variable: "--font-cinzel-decorative",
    subsets: ["latin"],
    weight: ["700", "900"],
});

const cinzel = Cinzel({
    variable: "--font-cinzel",
    subsets: ["latin"],
    weight: ["400", "600"],
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
