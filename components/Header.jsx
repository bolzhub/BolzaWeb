"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import fr from "@/locales/fr.json";
import en from "@/locales/en.json";

export default function Header({ lang }) {
  const pathname = usePathname();
  const t = lang === "fr" ? fr : en;

  // Nettoie le pathname pour retirer /fr ou /en
  const currentPath = pathname.replace(/^\/(fr|en)/, "");

  const otherLang = lang === "fr" ? "en" : "fr";

  return (
    <header>
      <nav>
        <Link href={`/${lang}`}>{t.nav.home}</Link>
        <Link href={`/${lang}/about`}>{t.nav.about}</Link>
        <Link href={`/${lang}/contact`}>{t.nav.contact}</Link>

        <button
          onClick={() =>
            (window.location.pathname = `/${otherLang}${currentPath || ""}`)
          }
          style={{ marginLeft: "1rem" }}
        >
          {t.switch}
        </button>
      </nav>
    </header>
  );
}
