function rng(seed: number) {
    let t = seed;
    return () => {
        t = (t + 0x6d2b79f5) | 0;
        let r = Math.imul(t ^ (t >>> 15), 1 | t);
        r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
}

function pinePath(cx: number, baseY: number, h: number, w: number): string {
    const tier = (apexY: number, bottomY: number, half: number) =>
        `M${cx},${apexY} L${cx + half},${bottomY} L${cx - half},${bottomY} Z`;
    return [
        tier(baseY - h, baseY - h * 0.6, w * 0.26),
        tier(baseY - h * 0.8, baseY - h * 0.3, w * 0.38),
        tier(baseY - h * 0.55, baseY - h * 0.05, w * 0.5),
        `M${cx - w * 0.04},${baseY - h * 0.05} h${w * 0.08} v${h * 0.08} h${-w * 0.08} Z`,
    ].join(" ");
}

function treeLayer(seed: number, count: number, baseY: number, minH: number, maxH: number): string {
    const r = rng(seed);
    const step = 1700 / count;
    let d = "";
    for (let i = 0; i < count; i++) {
        const cx = -50 + i * step + r() * step * 0.8;
        const h = minH + r() * (maxH - minH);
        d += pinePath(cx, baseY, h, h * 0.55) + " ";
    }
    return d;
}

const BACK = treeLayer(11, 20, 330, 120, 200);
const MID = treeLayer(23, 15, 370, 170, 260);
const FRONT = treeLayer(37, 10, 420, 220, 330);

export default function ForestBackground() {
    return (
        <div
            aria-hidden="true"
            className="fixed inset-0 -z-10 overflow-hidden"
            style={{
                background:
                    "radial-gradient(ellipse at 50% -10%, rgba(255,226,150,0.35), transparent 60%), linear-gradient(to bottom, #3f6e4c 0%, #2b5139 50%, #1d3a2b 100%)",
            }}
        >
            <svg
                viewBox="0 0 1600 420"
                preserveAspectRatio="xMidYMax slice"
                className="absolute bottom-0 left-0 w-full h-[46vh]"
            >
                <path d={BACK} fill="#2d5a42" />
                <path d={MID} fill="#1f4430" />
                <path d={FRONT} fill="#142c20" />
                <rect y="400" width="1600" height="20" fill="#142c20" />
            </svg>
        </div>
    );
}