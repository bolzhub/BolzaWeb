// Générateur aléatoire de Godot 4 (RandomNumberGenerator = PCG32), reproduit à l'identique :
// une même graine donne les mêmes tirages que dans le jeu (vérifié contre Godot 4.7).
// Les flottants « float » de Godot (32 bits) sont reproduits avec Math.fround.

// (BigInt(...) plutôt que les littéraux 123n : le projet cible ES2017)
const B = (x: number | string) => BigInt(x);
const MASK64 = (B(1) << B(64)) - B(1);
const MULT = B("6364136223846793005");
const DEFAULT_INC = B("1442695040888963407");
const B0 = B(0),
    B1 = B(1),
    B18 = B(18),
    B27 = B(27),
    B59 = B(59),
    U32 = B(0xffffffff);
const CMP_EPSILON = 0.00001;
const TAU = Math.PI * 2;

const clz32 = Math.clz32;

export class GodotRng {
    private state = B0;
    private inc = B0;

    constructor(seed: number | bigint) {
        this.seed(seed);
    }

    // pcg32_srandom_r(seed, DEFAULT_INC)
    seed(seed: number | bigint): void {
        this.state = B0;
        this.inc = ((DEFAULT_INC << B1) | B1) & MASK64;
        this.next();
        this.state = (this.state + (BigInt(seed) & MASK64)) & MASK64;
        this.next();
    }

    // pcg32_random_r : entier non signé sur 32 bits
    next(): number {
        const old = this.state;
        this.state = (old * MULT + this.inc) & MASK64;
        const xorshifted = Number((((old >> B18) ^ old) >> B27) & U32);
        const rot = Number(old >> B59);
        return ((xorshifted >>> rot) | (xorshifted << (-rot & 31))) >>> 0;
    }

    randi(): number {
        return this.next();
    }

    // pcg32_boundedrand_r
    private bounded(bound: number): number {
        const threshold = (0x100000000 - bound) % bound;
        for (;;) {
            const r = this.next();
            if (r >= threshold) return r % bound;
        }
    }

    randiRange(from: number, to: number): number {
        if (from === to) return from;
        return this.bounded(Math.abs(from - to) + 1) + Math.min(from, to);
    }

    // RandomPCG::randf (float sur 32 bits) : l'exposant vient des zéros de tête d'un premier tirage,
    // la mantisse d'un second dont le bit de poids fort est forcé (| 0x80000001, comme dans Godot)
    randf(): number {
        const protoExpOffset = this.next();
        if (protoExpOffset === 0) return 0;
        const mantissa = Math.fround((this.next() | 0x80000001) >>> 0);
        return Math.fround(mantissa * 2 ** (-32 - clz32(protoExpOffset)));
    }

    randfRange(from: number, to: number): number {
        return Math.fround(Math.fround(this.randf() * Math.fround(to - from)) + Math.fround(from));
    }

    // Box-Muller, version float de Godot
    randfn(mean = 0, deviation = 1): number {
        let temp = this.randf();
        if (temp < CMP_EPSILON) temp = Math.fround(temp + CMP_EPSILON);
        const angle = Math.fround(Math.fround(TAU) * this.randf());
        return Math.fround(mean + deviation * (Math.fround(Math.cos(angle)) * Math.sqrt(-2.0 * Math.log(temp))));
    }
}
