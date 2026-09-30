export default function FactionInfo({
    name,
    description,
    textColor,
}: {
    name: string;
    description: string;
    textColor: string;
}) {
    return (
        <div className="flex flex-col gap-3" style={{ color: textColor }}>
            <img src="/logo/logo-icon.svg" alt="Bolzano Crafts" className="h-8" />
            <h1
                className="text-3xl md:text-4xl tracking-wide"
                style={{ fontFamily: "var(--font-playfair)", fontWeight: 400 }}
            >
                {name}
            </h1>
            <p className="opacity-80 leading-relaxed">{description}</p>
        </div>
    );
}