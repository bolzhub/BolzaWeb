// Conversion d'un fichier STL (binaire ou texte) en GLB, le format lu par <model-viewer>.
// Une normale par facette (rendu à arêtes vives, fidèle à une pièce imprimée), un matériau mat uni.
// Le STL est en millimètres avec Z vers le haut ; glTF attend des mètres avec Y vers le haut.

function parseStl(buf: Buffer): Float32Array {
    // STL binaire : en-tête de 80 octets, nombre de triangles, puis 50 octets par triangle
    if (buf.length >= 84) {
        const count = buf.readUInt32LE(80);
        if (84 + count * 50 === buf.length) {
            const out = new Float32Array(count * 9);
            for (let t = 0; t < count; t++) {
                const base = 84 + t * 50 + 12; // on saute la normale enregistrée, recalculée plus bas
                for (let k = 0; k < 9; k++) out[t * 9 + k] = buf.readFloatLE(base + k * 4);
            }
            return out;
        }
    }
    // STL texte : « vertex x y z », trois par facette
    const values: number[] = [];
    const re = /vertex\s+(\S+)\s+(\S+)\s+(\S+)/g;
    const text = buf.toString("latin1");
    let m;
    while ((m = re.exec(text))) values.push(Number(m[1]), Number(m[2]), Number(m[3]));
    return new Float32Array(values.slice(0, values.length - (values.length % 9)));
}

export function stlToGlb(stl: Buffer): Buffer {
    const positions = parseStl(stl);
    const vertexCount = positions.length / 3;
    const normals = new Float32Array(positions.length);
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];

    for (let t = 0; t < positions.length; t += 9) {
        const ax = positions[t + 3] - positions[t],
            ay = positions[t + 4] - positions[t + 1],
            az = positions[t + 5] - positions[t + 2];
        const bx = positions[t + 6] - positions[t],
            by = positions[t + 7] - positions[t + 1],
            bz = positions[t + 8] - positions[t + 2];
        let nx = ay * bz - az * by,
            ny = az * bx - ax * bz,
            nz = ax * by - ay * bx;
        const len = Math.hypot(nx, ny, nz) || 1;
        nx /= len;
        ny /= len;
        nz /= len;
        for (let v = 0; v < 3; v++) {
            normals[t + v * 3] = nx;
            normals[t + v * 3 + 1] = ny;
            normals[t + v * 3 + 2] = nz;
            for (let k = 0; k < 3; k++) {
                const p = positions[t + v * 3 + k];
                if (p < min[k]) min[k] = p;
                if (p > max[k]) max[k] = p;
            }
        }
    }
    if (vertexCount === 0) {
        min.fill(0);
        max.fill(0);
    }

    const bin = Buffer.concat([
        Buffer.from(positions.buffer, positions.byteOffset, positions.byteLength),
        Buffer.from(normals.buffer, normals.byteOffset, normals.byteLength),
    ]);

    const gltf = {
        asset: { version: "2.0", generator: "BolzaWeb STL" },
        scene: 0,
        scenes: [{ nodes: [0] }],
        // Z vers le haut → Y vers le haut (quart de tour autour de X), millimètres → mètres
        nodes: [{ mesh: 0, rotation: [-Math.SQRT1_2, 0, 0, Math.SQRT1_2], scale: [0.001, 0.001, 0.001] }],
        meshes: [{ primitives: [{ attributes: { POSITION: 0, NORMAL: 1 }, material: 0, mode: 4 }] }],
        materials: [
            {
                pbrMetallicRoughness: { baseColorFactor: [0.86, 0.8, 0.7, 1], metallicFactor: 0, roughnessFactor: 0.7 },
                doubleSided: true,
            },
        ],
        buffers: [{ byteLength: bin.length }],
        bufferViews: [
            { buffer: 0, byteOffset: 0, byteLength: positions.byteLength, target: 34962 },
            { buffer: 0, byteOffset: positions.byteLength, byteLength: normals.byteLength, target: 34962 },
        ],
        accessors: [
            { bufferView: 0, componentType: 5126, count: vertexCount, type: "VEC3", min, max },
            { bufferView: 1, componentType: 5126, count: vertexCount, type: "VEC3" },
        ],
    };

    // Les deux blocs d'un GLB doivent avoir une longueur multiple de 4
    let json = Buffer.from(JSON.stringify(gltf));
    if (json.length % 4) json = Buffer.concat([json, Buffer.alloc(4 - (json.length % 4), 0x20)]);
    const binPadded = bin.length % 4 ? Buffer.concat([bin, Buffer.alloc(4 - (bin.length % 4))]) : bin;

    const header = Buffer.alloc(12);
    header.writeUInt32LE(0x46546c67, 0); // « glTF »
    header.writeUInt32LE(2, 4);
    header.writeUInt32LE(12 + 8 + json.length + 8 + binPadded.length, 8);
    const jsonHead = Buffer.alloc(8);
    jsonHead.writeUInt32LE(json.length, 0);
    jsonHead.writeUInt32LE(0x4e4f534a, 4); // « JSON »
    const binHead = Buffer.alloc(8);
    binHead.writeUInt32LE(binPadded.length, 0);
    binHead.writeUInt32LE(0x004e4942, 4); // « BIN »
    return Buffer.concat([header, jsonHead, json, binHead, binPadded]);
}
