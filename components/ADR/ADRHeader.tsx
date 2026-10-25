import type { ReactNode } from "react";

export default function ADRHeader({ left, title }: { left: ReactNode; title: string }) {
    return (
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 pt-8 pb-2 px-4 md:px-8">
            <div className="shrink-0">{left}</div>
            <h1
                className="text-center text-white m-0 text-5xl tracking-wide"
                style={{ fontFamily: "var(--font-playfair)", fontWeight: 400 }}
            >
                {title}
            </h1>
            <div className="invisible shrink-0" aria-hidden="true">
                {left}
            </div>
        </div>
    );
}