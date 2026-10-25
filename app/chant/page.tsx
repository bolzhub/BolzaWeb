import { isAuthenticated } from "@/lib/chant/auth";
import { getTags, listSongs } from "@/lib/chant/storage";
import PasswordGate from "@/components/chant/PasswordGate";
import ChantHome from "@/components/chant/ChantHome";

export const dynamic = "force-dynamic";

export default async function ChantPage() {
  if (!(await isAuthenticated())) return <PasswordGate />;

  try {
    const [songs, tags] = await Promise.all([listSongs(), getTags()]);
    return <ChantHome songs={songs} tags={tags} />;
  } catch (err) {
    console.error("[chant]", err);
    return (
      <main className="p-8">
        Impossible de lire le dossier Chant. Vérifiez CHANT_ROOT et les permissions.
      </main>
    );
  }
}