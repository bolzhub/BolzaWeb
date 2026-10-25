const IMAGE_CLASS =
    "max-w-full max-h-full object-contain rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-white active:scale-105 active:ring-2 active:ring-white";

export default function ImageTile({ src, alt, onClick }: { src: string; alt: string; onClick?: () => void }) {
    return (
        <div className="relative w-full cursor-pointer" style={{ paddingTop: "100%" }} onClick={onClick}>
            <div className="absolute inset-0 flex items-center justify-center">
                <img src={src} alt={alt} className={IMAGE_CLASS} />
            </div>
        </div>
    );
}
