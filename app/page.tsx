import { getHomeItems } from "@/lib/galleries";
import HomeGallery from "@/components/HomeGallery";

export default function Home() {
  const items = getHomeItems();
  return <HomeGallery items={items} />;
}