import Link from "next/link";
import { ASSETS_LINK } from "@/lib/RootBrainTeasers/puzzles";

export default function AssetsEntry() {
    const external = /^https?:\/\//.test(ASSETS_LINK.href);

    const content = (
        <>
            <span className="rbt-icon-wiggle flex items-center justify-center w-[var(--rbt-size)] h-[var(--rbt-size)] rounded-[22%] border-2 border-dashed border-[#F3ECDC]/70 bg-[#F3ECDC]/10 text-[#F3ECDC]">
                <svg
                    className="w-[42%] h-[42%]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
                    <path d="M12 10v6" />
                    <path d="m9 13 3 3 3-3" />
                </svg>
            </span>

            <span
                className="max-w-[calc(var(--rbt-size)*1.2)]"
                style={{ textShadow: "0 1px 3px rgba(0,0,0,0.55)" }}
            >
                <span
                    className="block text-lg md:text-xl text-[#F3ECDC] mb-1"
                    style={{ fontFamily: "var(--font-playfair)", fontWeight: 700 }}
                >
                    {ASSETS_LINK.label}
                </span>
                <span className="block text-base md:text-lg leading-relaxed text-[#F3ECDC]/90">
                    {ASSETS_LINK.description}
                </span>
            </span>
        </>
    );

    const className = "rbt-item flex flex-col items-center gap-5 text-center outline-none";

    return external ? (
        <a href={ASSETS_LINK.href} target="_blank" rel="noopener noreferrer" className={className}>
            {content}
        </a>
    ) : (
        <Link href={ASSETS_LINK.href} className={className}>
            {content}
        </Link>
    );
}