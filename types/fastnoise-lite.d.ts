// Types minimaux du portage JavaScript officiel de FastNoiseLite (le paquet n'en fournit pas)
declare module "fastnoise-lite" {
    export default class FastNoiseLite {
        static NoiseType: Readonly<
            Record<"OpenSimplex2" | "OpenSimplex2S" | "Cellular" | "Perlin" | "ValueCubic" | "Value", string>
        >;
        static FractalType: Readonly<
            Record<"None" | "FBm" | "Ridged" | "PingPong" | "DomainWarpProgressive" | "DomainWarpIndependent", string>
        >;
        constructor(seed?: number);
        SetSeed(seed: number): void;
        SetFrequency(frequency: number): void;
        SetNoiseType(noiseType: string): void;
        SetFractalType(fractalType: string): void;
        SetFractalOctaves(octaves: number): void;
        GetNoise(x: number, y: number, z?: number): number;
    }
}
