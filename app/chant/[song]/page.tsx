import { notFound } from "next/navigation";
import { isAuthenticated } from "@/lib/chant/auth";
import { ChantError, fromSlug, getSongDetail } from "@/lib/chant/storage";
import PasswordGate from "@/components/chant/PasswordGate";
import SongView from "@/components/chant/SongView";

export const dynamic = "force-dynamic";

export default async function SongPage({ params }: { params: Promise<{ song: string }> }) {
  if (!(await isAuthenticated())) return <PasswordGate />;

  const { song: slug } = await params;

  let detail;
  try {
    detail = await getSongDetail(fromSlug(slug));
  } catch (err) {
    if (err instanceof ChantError) notFound();
    throw err;
  }

  return (
    <SongView
      diskName={detail.diskName}
      name={detail.name}
      files={detail.files}
      allTags={detail.allTags}
      selectedTags={detail.selectedTags}
    />
  );
}