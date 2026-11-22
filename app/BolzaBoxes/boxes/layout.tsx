import type { ReactNode } from "react";
import BoxesFrame from "@/components/BolzaBoxes/BoxesFrame";

export default function BoxesLayout({ children }: { children: ReactNode }) {
    return <BoxesFrame>{children}</BoxesFrame>;
}
