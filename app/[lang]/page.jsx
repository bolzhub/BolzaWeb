export default async function HomePage({ params }) {
  const { lang } = await params; // <- important !

  const t = {
    fr: {
      title: "Bienvenue sur Bolzano Crafts",
      desc: "Site en construction 🚧",
    },
    en: {
      title: "Welcome to Bolzano Crafts",
      desc: "Website under construction 🚧",
    },
  }[lang ?? "fr"]; // fallback "fr" si undefined

  return (
    <main>
      <h1>{t.title}</h1>
      <p>{t.desc}</p>
    </main>
  );
}
