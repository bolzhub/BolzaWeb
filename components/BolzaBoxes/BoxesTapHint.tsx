export default function BoxesTapHint() {
    return (
        <div className="flex items-center gap-2 text-[#3a352c] bg-[#ECE5D8]/90 rounded-full px-4 py-2 text-sm md:text-base shadow-md shrink-0">
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse"
            >
                <path d="M9 11.5V6a1.5 1.5 0 0 1 3 0v5" />
                <path d="M12 11V4.5a1.5 1.5 0 0 1 3 0V11" />
                <path d="M15 11.5V7a1.5 1.5 0 0 1 3 0v7c0 3.5-2 6.5-6 6.5s-6-2-7-4l-1.5-3c-.5-1 .3-2 1.3-1.7.7.2 1.2.8 1.7 1.7" />
            </svg>
            <span style={{ fontFamily: "var(--font-playfair)" }}>
                Touchez une couleur pour découvrir chaque boîte
            </span>
        </div>
    );
}