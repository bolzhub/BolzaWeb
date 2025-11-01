import fr from "@/locales/fr.json";
import en from "@/locales/en.json";

export async function generateMetadata({ params }) {
  const { lang } = params;
  const t = lang === "fr" ? fr : en;
  
  return {
    title: `${t.nav.about}`,
    // description: t.meta.aboutDesc, // si tu définis une description spécifique
  };
}

export default async function AboutPage({ params }) {
  const { lang } = await params;
  const t = lang === "fr" ? fr : en;

  return (
    <section>
      <h1>{t.nav.about}</h1>
      <p>{lang === "fr"
        ? "Bienvenue sur la page À propos."
        : "Welcome to the About page."}
      </p>
    </section>
  );
}
