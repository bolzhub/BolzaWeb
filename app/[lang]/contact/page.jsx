import fr from "@/locales/fr.json";
import en from "@/locales/en.json";

export default async function ContactPage({ params }) {
  const { lang } = await params;
  const t = lang === "fr" ? fr : en;

  return (
    <section>
      <h1>{t.nav.contact}</h1>
      <p>
        {lang === "fr"
          ? "Bienvenue sur la page Contact."
          : "Welcome to the Contact page."}
      </p>
    </section>
  );
}
