import { getHomeItems } from "@/lib/LifeDrawing/galleries";
import HomeGallery from "@/components/LifeDrawing/HomeGallery";

export default function Home() {
    const items = getHomeItems();
    return <HomeGallery items={items} />;
}
