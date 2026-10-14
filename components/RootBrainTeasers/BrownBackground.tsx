import { BROWN_PAGE_BACKGROUND } from "@/lib/RootBrainTeasers/theme";

export default function BrownBackground() {
    return (
        <div
            aria-hidden="true"
            className="fixed inset-0 -z-10"
            style={{ background: BROWN_PAGE_BACKGROUND }}
        />
    );
}