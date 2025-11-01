import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
