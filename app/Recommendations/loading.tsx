const BG = "#1E2420";
const FG = "#ECE5D8";

export default function Loading() {
    return (
        <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BG }}>
            <p
                className="text-sm tracking-widest uppercase animate-pulse"
                style={{ color: `${FG}99`, fontFamily: "var(--font-playfair)" }}
            >
                Chargement…
            </p>
        </main>
    );
}