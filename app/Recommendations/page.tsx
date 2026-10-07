import Link from "next/link";
import RecommendationsYoutube from "@/components/Recommendations/RecommendationsYoutube";

export default function RecommendationsPage() {
    return (
        <main className="min-h-screen bg-[#ECE5D8]">
            <header className="flex items-center justify-between px-6 md:px-10 py-6">
                <Link href="/" className="shrink-0">
                    <img src="/logo/bolzano-word.svg" alt="Bolzano" className="h-8 md:h-10" />
                </Link>
                <h1
                    className="text-xl md:text-2xl text-[#3a352c]"
                    style={{ fontFamily: "var(--font-playfair)", fontWeight: 700 }}
                >
                    Recommendations
                </h1>
            </header>

            <nav className="flex justify-center gap-8 pb-10 text-sm tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>
                <span className="text-[#3a352c] underline underline-offset-4">YouTube</span>
                <span className="text-[#3a352c]/30 cursor-not-allowed">Films (bientôt)</span>
            </nav>

            <RecommendationsYoutube />
        </main>
    );
}