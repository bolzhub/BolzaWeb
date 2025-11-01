import "../global.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const dynamicParams = false; // langues fixes
export async function generateStaticParams() {
  return [{ lang: "fr" }, { lang: "en" }];
}

// Metadata dynamique selon la langue
export async function generateMetadata({ params }) {
  const { lang } = await params;
  
  const titles = {
    fr: "Bolzano Crafts",
    en: "Bolzano Crafts",
  };

  const descriptions = {
    fr: "Artisanat par Bolzano",
    en: "Crafts by Bolzano",
  };

  return {
    title: {
      default: titles[lang],
      template: "Bolzano Crafts | %s",
    },
    description: descriptions[lang],
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

export default async function LangLayout({ children, params }) {
  const { lang } = await params;

  return (
    <html lang={lang}>
      <body>
        <Header lang={lang} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
