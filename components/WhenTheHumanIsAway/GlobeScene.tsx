"use client";

import { useEffect, useRef } from "react";

// Globe de When the Human's Away, calculé dans le navigateur (aucun calcul côté serveur) :
// géométrie de Goldberg « taille moyenne » (fréquence 18, 3 242 cases), terrain aléatoire
// à chaque visite, rendu fidèle au jeu (godot/scripts/globe.gd, main.gd, camera_rig.gd).

export const FREQUENCY = 18; // « Medium (3,242 tiles) » dans le menu du jeu
export const BACKGROUND = "#05060b"; // Color(0.02, 0.025, 0.045) du jeu, affichée en sRGB

const AUTO_ROTATE_SPEED = 0.8; // tours/minute ≈ speed × 2 : un tour en ~75 s

export default function GlobeScene({
    seed,
    capture = false,
    onReady,
}: {
    seed?: number; // sans graine : nouveau terrain à chaque visite (même intervalle que le menu du jeu)
    capture?: boolean; // rendu fixe pour l'aperçu de la page principale
    onReady?: (ms: number) => void;
}) {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;
        let disposed = false;
        let cleanup = () => {};

        (async () => {
            const THREE = await import("three");
            const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
            const { EffectComposer } = await import("three/examples/jsm/postprocessing/EffectComposer.js");
            const { RenderPass } = await import("three/examples/jsm/postprocessing/RenderPass.js");
            const { OutputPass } = await import("three/examples/jsm/postprocessing/OutputPass.js");
            const { buildGoldberg } = await import("@/lib/WhenTheHumanIsAway/goldberg");
            const { generateWorld } = await import("@/lib/WhenTheHumanIsAway/world");
            const { buildGlobeSurfaces } = await import("@/lib/WhenTheHumanIsAway/globeMesh");
            const { GodotRng } = await import("@/lib/WhenTheHumanIsAway/rng");
            if (disposed) return;

            const t0 = performance.now();
            const world = generateWorld(buildGoldberg(FREQUENCY), seed ?? 1 + Math.floor(Math.random() * 999999));
            const [land, water] = buildGlobeSurfaces(world);
            const genMs = performance.now() - t0;
            mount.dataset.generationMs = genMs.toFixed(0); // temps de génération, consultable dans l'inspecteur

            const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: capture });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(mount.clientWidth, mount.clientHeight);
            renderer.toneMapping = THREE.NoToneMapping; // TONE_MAPPER_LINEAR du jeu
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            mount.appendChild(renderer.domElement);
            renderer.domElement.style.display = "block";
            renderer.domElement.style.touchAction = "none";

            const scene = new THREE.Scene();
            // fond du jeu ; via scene.background, la couleur est convertie correctement pour le tampon linéaire
            scene.background = new THREE.Color(BACKGROUND);
            // couleurs de lumière données en sRGB dans le jeu (converties en linéaire, comme Godot)
            const srgb = (r: number, g: number, b: number) => new THREE.Color().setRGB(r, g, b, THREE.SRGBColorSpace);

            // Caméra du jeu : champ vertical de 40°, inclinaison 0,35 rad. La distance (3,2 dans le jeu)
            // est adaptée à l'écran : le globe et son halo tiennent entre le titre et le message.
            const camera = new THREE.PerspectiveCamera(40, mount.clientWidth / mount.clientHeight, 0.005, 200);
            const pitch = 0.35;
            const fitDistance = () => {
                const halfV = THREE.MathUtils.degToRad(20);
                const halfH = Math.atan(Math.tan(halfV) * camera.aspect);
                // part de l'écran occupée par le rayon du halo (1,09), en hauteur et en largeur
                const angle = capture ? Math.min(halfV, halfH) * 0.94 : Math.min(halfV * 0.74, halfH * 0.86);
                return 1.09 / Math.sin(angle);
            };
            const distance = fitDistance();
            camera.position.set(0, Math.sin(pitch) * distance, Math.cos(pitch) * distance);
            camera.lookAt(0, 0, 0);
            scene.add(camera);

            // Lumière ambiante et lumière principale attachée à la caméra (rotation -28°, -32°) :
            // la face regardée est toujours éclairée. Facteur π : convention d'énergie de Godot 4.
            scene.add(new THREE.AmbientLight(srgb(0.55, 0.6, 0.75), 0.32 * Math.PI));
            const key = new THREE.DirectionalLight(srgb(1.0, 0.96, 0.88), Math.PI);
            const rx = THREE.MathUtils.degToRad(-28);
            const ry = THREE.MathUtils.degToRad(-32);
            // direction -Z tournée par Ry·Rx (ordre YXZ de Godot) ; la lumière vient du côté opposé
            const dir = new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(rx, ry, 0, "YXZ"));
            key.position.copy(dir.clone().negate());
            camera.add(key);
            camera.add(key.target);

            // Diffusion de Burley, celle de Godot 4 par défaut (three.js utilise Lambert) : sur une surface
            // lisse comme l'eau, elle assombrit les angles rasants. Formule de scene_forward_lights_inc.glsl ;
            // Godot ne retire pas non plus la part réfléchie (1 - F) de la diffusion.
            const physicalChunk = THREE.ShaderChunk.lights_physical_pars_fragment;
            const lambert = "vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );";
            const burley = `float burleyNV = saturate( dot( geometryNormal, geometryViewDir ) );
        vec3 burleyH = normalize( directLight.direction + geometryViewDir );
        float burleyLH = saturate( dot( directLight.direction, burleyH ) );
        float fd90Minus1 = 2.0 * burleyLH * burleyLH * material.roughness - 0.5;
        float fdV = 1.0 + fd90Minus1 * pow( 1.0 - burleyNV, 5.0 );
        float fdL = 1.0 + fd90Minus1 * pow( 1.0 - dotNL, 5.0 );
        vec3 diffuseBRDF = material.diffuseContribution * RECIPROCAL_PI * fdV * fdL;`;
            const fresnelCut = "reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );";
            if (!physicalChunk.includes(lambert) || !physicalChunk.includes(fresnelCut)) {
                console.warn("three.js : bloc d'éclairage inattendu, diffusion de Lambert conservée");
            }
            const godotLighting = physicalChunk
                .replace(lambert, burley)
                .replace(fresnelCut, "reflectedLight.directDiffuse += irradiance * diffuseBRDF;");
            const withGodotLighting = <M extends InstanceType<typeof THREE.Material>>(material: M): M => {
                material.onBeforeCompile = (shader) => {
                    shader.fragmentShader = shader.fragmentShader.replace(
                        "#include <lights_physical_pars_fragment>",
                        godotLighting,
                    );
                };
                return material;
            };

            // Globe : terres mates (rugosité 0,92), eau brillante (rugosité 0,28, spéculaire 0,7)
            const surfaceMesh = (s: typeof land, material: InstanceType<typeof THREE.Material>) => {
                const geo = new THREE.BufferGeometry();
                geo.setAttribute("position", new THREE.BufferAttribute(s.positions, 3));
                geo.setAttribute("normal", new THREE.BufferAttribute(s.normals, 3));
                geo.setAttribute("color", new THREE.BufferAttribute(s.colors, 3));
                geo.setIndex(new THREE.BufferAttribute(s.indices, 1));
                return new THREE.Mesh(geo, material);
            };
            const globe = new THREE.Group();
            globe.add(
                surfaceMesh(
                    land,
                    withGodotLighting(
                        new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92, metalness: 0 }),
                    ),
                ),
            );
            // F0 = 0,16 × 0,7² ≈ 0,078 (metallic_specular 0,7 dans Godot) ↔ ior ≈ 1,78
            globe.add(
                surfaceMesh(
                    water,
                    withGodotLighting(
                        new THREE.MeshPhysicalMaterial({
                            vertexColors: true,
                            roughness: 0.28,
                            metalness: 0,
                            ior: 1.778,
                        }),
                    ),
                ),
            );
            scene.add(globe);

            // Atmosphère : halo additif sur les bords (globe.gd, _add_atmosphere)
            const atmosphere = new THREE.Mesh(
                new THREE.SphereGeometry(1.09, 96, 48),
                new THREE.ShaderMaterial({
                    blending: THREE.AdditiveBlending,
                    transparent: true,
                    depthWrite: false,
                    side: THREE.FrontSide,
                    vertexShader: `
                        varying vec3 vNormal;
                        varying vec3 vView;
                        void main() {
                            vec4 mv = modelViewMatrix * vec4(position, 1.0);
                            vNormal = normalize(normalMatrix * normal);
                            vView = normalize(-mv.xyz);
                            gl_Position = projectionMatrix * mv;
                        }`,
                    fragmentShader: `
                        varying vec3 vNormal;
                        varying vec3 vView;
                        void main() {
                            float f = pow(1.0 - clamp(dot(vNormal, vView), 0.0, 1.0), 3.0);
                            gl_FragColor = vec4(vec3(0.35, 0.6, 1.0) * f * 0.9, 1.0);
                        }`,
                }),
            );
            scene.add(atmosphere);

            // Étoiles du jeu : 1 500 points, graine 3, même générateur aléatoire que Godot
            const rng = new GodotRng(3);
            const starPos = new Float32Array(1500 * 3);
            const starCol = new Float32Array(1500 * 3);
            for (let i = 0; i < 1500; i++) {
                const x = rng.randfn();
                const y = rng.randfn();
                const z = rng.randfn();
                const l = Math.hypot(x, y, z);
                starPos.set([(x / l) * 80, (y / l) * 80, (z / l) * 80], 3 * i);
                const b = rng.randfRange(0.3, 1.0);
                starCol.set([b, b, Math.min(1, b * 1.1)], 3 * i);
            }
            const starGeo = new THREE.BufferGeometry();
            starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
            starGeo.setAttribute("color", new THREE.BufferAttribute(starCol, 3));
            const starMat = new THREE.PointsMaterial({
                vertexColors: true,
                size: 2 * renderer.getPixelRatio(),
                sizeAttenuation: false,
            });
            scene.add(new THREE.Points(starGeo, starMat));

            // Rotation : lente au repos, libre au doigt ou à la souris ; ni zoom ni déplacement
            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableZoom = false;
            controls.enablePan = false;
            controls.enableDamping = true;
            controls.dampingFactor = 0.08;
            controls.rotateSpeed = 0.6;
            controls.minPolarAngle = Math.PI / 2 - 1.45;
            controls.maxPolarAngle = Math.PI / 2 + 1.45;
            controls.autoRotate = !capture;
            controls.autoRotateSpeed = AUTO_ROTATE_SPEED;

            // Rendu dans un tampon linéaire (demi-flottants, MSAA), converti en sRGB à la fin :
            // comme Godot, le halo additif de l'atmosphère s'ajoute en lumière linéaire.
            const target = new THREE.WebGLRenderTarget(mount.clientWidth, mount.clientHeight, {
                type: THREE.HalfFloatType,
                samples: 4,
            });
            const composer = new EffectComposer(renderer, target);
            composer.addPass(new RenderPass(scene, camera));
            composer.addPass(new OutputPass());

            const resize = () => {
                const w = mount.clientWidth;
                const h = mount.clientHeight;
                renderer.setSize(w, h);
                composer.setSize(w, h);
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                camera.position.setLength(fitDistance());
            };
            const observer = new ResizeObserver(resize);
            observer.observe(mount);

            let frame = 0;
            const tick = () => {
                controls.update();
                composer.render();
                frame = requestAnimationFrame(tick);
            };
            tick();
            onReady?.(genMs);

            cleanup = () => {
                cancelAnimationFrame(frame);
                observer.disconnect();
                controls.dispose();
                scene.traverse((o) => {
                    const m = o as InstanceType<typeof THREE.Mesh>;
                    m.geometry?.dispose();
                    const mat = m.material as InstanceType<typeof THREE.Material> | undefined;
                    mat?.dispose();
                });
                composer.dispose();
                target.dispose();
                renderer.dispose();
                renderer.domElement.remove();
            };
        })();

        return () => {
            disposed = true;
            cleanup();
        };
    }, [seed, capture, onReady]);

    return <div ref={mountRef} className="absolute inset-0" />;
}
