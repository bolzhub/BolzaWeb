import { ReactNode } from "react";
import { VersionProvider } from "@/lib/BolzaBoxes/VersionContext";

export default function BolzaBoxesLayout({ children }: { children: ReactNode }) {
    return <VersionProvider>{children}</VersionProvider>;
}