import { getHomeItems } from "@/lib/ADR/galleries";
import HomeGallery from "@/components/ADR/HomeGallery";

export default function Home() {
  const items = getHomeItems();
  return <HomeGallery items={items} />;
}