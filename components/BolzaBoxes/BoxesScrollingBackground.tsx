export default function BoxesScrollingBackground({ src }: { src: string }) {
    // Ratio hauteur/largeur réel de l'image source (2150 x 2800)
    const ASPECT = 2800 / 2150;

    return (
        <div className="fixed inset-0 -z-20 overflow-hidden bg-[#3a352c]">
            <style>{`
                @keyframes boxes-bg-scroll {
                    from { transform: translateY(0); }
                    to { transform: translateY(-50%); }
                }
                .boxes-bg-scroll-track {
                    animation: boxes-bg-scroll 60s linear infinite;
                }
            `}</style>

            <div className="flex flex-col items-center boxes-bg-scroll-track">
                <img
                    src={src}
                    alt=""
                    aria-hidden
                    draggable={false}
                    className="select-none shrink-0"
                    style={{
                        height: `max(100vh, calc(100vw * ${ASPECT}))`,
                        width: "auto",
                        maxWidth: "none",
                    }}
                />
                <img
                    src={src}
                    alt=""
                    aria-hidden
                    draggable={false}
                    className="select-none shrink-0"
                    style={{
                        height: `max(100vh, calc(100vw * ${ASPECT}))`,
                        width: "auto",
                        maxWidth: "none",
                    }}
                />
            </div>
        </div>
    );
}