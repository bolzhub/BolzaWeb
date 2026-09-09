import { notFound } from "next/navigation";
import { getGalleryBySlug } from "@/lib/galleries";
import PhotoGallery from "@/components/PhotoGallery";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gallery = getGalleryBySlug(slug);

  if (!gallery) notFound();

  return <PhotoGallery title={gallery.name} images={gallery.images} />;
}