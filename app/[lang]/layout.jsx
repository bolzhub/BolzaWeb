import "../global.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: {
    default: "Bolzano Crafts",
    template: "%s | Bolzano Crafts",
  },
  description: "Crafts by Bolzano",
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

export default async function LangLayout({ children, params }) {
  const { lang } = await params; // ⬅️ important !
  console.log("LangLayout params:", lang);

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
