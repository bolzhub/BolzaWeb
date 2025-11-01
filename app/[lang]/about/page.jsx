import fr from "@/locales/fr.json";
import en from "@/locales/en.json";

export default async function AboutPage({ params }) {
  const { lang } = await params; // <- important
  const t = lang === "fr" ? fr : en;

  return (
    <section>
      <h1>{t.nav.about}</h1>
      <p>
        {lang === "fr"
          ? "Bienvenue sur la page À propos."
          : "Welcome to the About page."}
      </p>
    </section>
  );
}
