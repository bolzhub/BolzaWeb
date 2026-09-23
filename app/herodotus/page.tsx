import Logo from "@/components/site/Logo";

export default function HerodotusPage() {
    return (
        <main className="min-h-screen min-h-dvh bg-black">
            <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
                <Logo size="small" height={32} />
            </div>

            <div className="relative w-full h-screen">
                <img
                    src="/projects/herodotus/cover.png"
                    alt="Herodotus The Owl"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/0" />

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                    <p
                        className="text-white text-lg md:text-2xl max-w-2xl"
                        style={{ fontFamily: "var(--font-manrope)", fontWeight: 500 }}
                    >
                        Herodotus' The Owl is a children's book. It has yet to be finished.
                    </p>
                </div>
            </div>
        </main>
    );
}