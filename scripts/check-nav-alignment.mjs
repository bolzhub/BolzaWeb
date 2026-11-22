#!/usr/bin/env node
// Vérifie l'alignement vertical des éléments de chaque barre de navigation, à plusieurs largeurs d'écran.
//
// Usage : lancer le site (npm run dev), puis
//   node scripts/check-nav-alignment.mjs [http://localhost:3000] [--verbose]
//
// Dans le code, une barre se déclare avec l'attribut `data-nav-row`. Le script en mesure les éléments visibles :
//  - image, SVG, ou élément qui a son propre fond, contour ou ombre (bulle, bouton) : centre de sa boîte ;
//  - texte seul : milieu des majuscules (entre la ligne de base et la hauteur de capitale),
//    car c'est ce que l'œil aligne, pas la boîte du texte qui inclut l'interlignage ;
//  - simple conteneur de mise en page : on mesure ses enfants.
// Un élément marqué `data-nav-center` doit en plus être centré horizontalement dans la fenêtre.
// Un élément marqué `data-nav-ignore` n'est pas mesuré.
//
// Le script n'a besoin que de Chromium (aucune dépendance npm) : il le pilote via le protocole DevTools.

import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const args = process.argv.slice(2);
const VERBOSE = args.includes("--verbose");
const BASE = args.find((a) => !a.startsWith("--")) ?? "http://localhost:3000";
const TOLERANCE = 0.75; // px : en dessous, l'écart est invisible

const ONLY = process.env.PAGES?.split(",");
const PAGES = ONLY ?? [
    "/",
    "/ADR",
    "/ADR/gallery/32%20Laurent%20-%2022%20octobre%202026",
    "/ADR/gallery/06%20Diana%20et%20%C3%89tienne%20-%20janvier%202026",
    "/Recommendations",
    "/RedFlags",
    "/RootBrainTeasers",
    "/RootBrainTeasers/1",
    "/herodotus",
    "/BolzaBoxes",
    "/BolzaBoxes/configurations",
    "/BolzaBoxes/boxes/cats",
];
const LANGS = process.env.LANGS?.split(",") ?? ["en", "fr"];
const WIDTHS = process.env.WIDTHS?.split(",").map(Number) ?? [360, 390, 480, 600, 768, 1024, 1280, 1600];

// Fonction exécutée dans la page : renvoie, pour chaque barre, la liste des éléments et leur centre vertical
const MEASURE = `(() => {
    const visible = (el) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none" && +cs.opacity > 0;
    };
    const hasOwnBox = (el) => {
        const cs = getComputedStyle(el);
        const bg = cs.backgroundColor;
        return (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") ||
            parseFloat(cs.borderTopWidth) > 0 || cs.boxShadow !== "none" || cs.backgroundImage !== "none";
    };
    // Centre visuel d'un texte : entre le haut des majuscules de la première ligne
    // et la ligne de base de la dernière (sur une seule ligne : le milieu des majuscules)
    const capCenter = (el) => {
        const texts = [];
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) if (node.textContent.trim()) texts.push(node);
        if (!texts.length) return null;
        const baselineAt = (textNode, atEnd) => {
            const probe = document.createElement("span");
            probe.style.cssText = "display:inline-block;width:0;height:0;vertical-align:baseline";
            if (atEnd) textNode.parentNode.insertBefore(probe, textNode.nextSibling);
            else textNode.parentNode.insertBefore(probe, textNode);
            const y = probe.getBoundingClientRect().top;
            probe.remove();
            return y;
        };
        const first = texts[0];
        const firstBaseline = baselineAt(first, false);
        const lastBaseline = baselineAt(texts[texts.length - 1], true);
        const ncs = getComputedStyle(first.parentNode);
        const ctx = document.createElement("canvas").getContext("2d");
        ctx.font = ncs.fontStyle + " " + ncs.fontWeight + " " + ncs.fontSize + " " + ncs.fontFamily;
        const cap = ctx.measureText("H").actualBoundingBoxAscent;
        return (firstBaseline - cap + lastBaseline) / 2;
    };
    const label = (el) => {
        const t = (el.getAttribute("aria-label") || el.getAttribute("alt") || el.textContent || "").trim().replace(/\\s+/g, " ");
        return el.tagName.toLowerCase() + (t ? " «" + t.slice(0, 24) + "»" : "");
    };
    const collect = (el, out) => {
        for (const child of el.children) {
            if (child.hasAttribute("data-nav-ignore")) continue;
            if (getComputedStyle(child).display === "contents") {
                collect(child, out);
                continue;
            }
            if (!visible(child)) continue;
            const tag = child.tagName.toLowerCase();
            const r = child.getBoundingClientRect();
            if (tag === "img" || tag === "svg" || tag === "picture" || tag === "button" && !child.textContent.trim() || hasOwnBox(child)) {
                out.push({ what: label(child), y: r.top + r.height / 2, kind: "boîte", rect: [r.left, r.top, r.right, r.bottom] });
            } else if (child.children.length === 0 || [...child.children].every((c) => ["SPAN", "B", "I", "EM", "STRONG"].includes(c.tagName) && !hasOwnBox(c))) {
                const y = capCenter(child);
                if (y !== null) out.push({ what: label(child), y, kind: "texte", rect: [r.left, r.top, r.right, r.bottom] });
            } else {
                collect(child, out);
            }
        }
        return out;
    };
    const rows = [...document.querySelectorAll("[data-nav-row]")].filter(visible).map((row) => ({
        row: row.getAttribute("data-nav-row") || "barre",
        items: collect(row, []),
    }));
    const centers = [...document.querySelectorAll("[data-nav-center]")].filter(visible).map((el) => {
        const r = el.getBoundingClientRect();
        return { what: label(el), offset: r.left + r.width / 2 - document.documentElement.clientWidth / 2 };
    });
    return { rows, centers };
})()`;

async function main() {
    const profile = mkdtempSync(path.join(tmpdir(), "nav-check-"));
    const chrome = spawn(
        "chromium",
        [
            "--headless=new",
            "--disable-gpu",
            "--hide-scrollbars",
            "--remote-debugging-port=0",
            `--user-data-dir=${profile}`,
            "about:blank",
        ],
        { stdio: ["ignore", "ignore", "pipe"] },
    );
    const wsUrl = await new Promise((resolve, reject) => {
        let buf = "";
        chrome.stderr.on("data", (d) => {
            buf += d;
            const m = buf.match(/DevTools listening on (ws:\/\/\S+)/);
            if (m) resolve(m[1]);
        });
        chrome.once("exit", () => reject(new Error("Chromium s'est arrêté")));
    });

    const ws = new WebSocket(wsUrl);
    await new Promise((r) => ws.addEventListener("open", r, { once: true }));
    let id = 0;
    const pending = new Map();
    const waiters = [];
    ws.addEventListener("message", (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id && pending.has(msg.id)) {
            const { resolve, reject } = pending.get(msg.id);
            pending.delete(msg.id);
            msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
        } else if (msg.method) {
            for (const w of [...waiters])
                if (w.method === msg.method && w.sessionId === msg.sessionId) w.resolve(msg.params);
        }
    });
    const send = (method, params = {}, sessionId) =>
        new Promise((resolve, reject) => {
            const msgId = ++id;
            pending.set(msgId, { resolve, reject });
            ws.send(JSON.stringify({ id: msgId, method, params, sessionId }));
        });
    const waitFor = (method, sessionId, timeout = 30000) =>
        new Promise((resolve) => {
            const w = { method, sessionId, resolve: (p) => (waiters.splice(waiters.indexOf(w), 1), resolve(p)) };
            waiters.push(w);
            setTimeout(() => w.resolve(null), timeout);
        });

    const { targetId } = await send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
    await send("Page.enable", {}, sessionId);
    await send("Runtime.enable", {}, sessionId);

    await send("Network.enable", {}, sessionId);
    let failures = 0;
    for (const lang of LANGS) {
        // même cookie que le sélecteur de langue du site
        await send("Network.setCookie", { name: "lang", value: lang, url: BASE }, sessionId);
        for (const page of PAGES) {
            for (const width of WIDTHS) {
                await send(
                    "Emulation.setDeviceMetricsOverride",
                    { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 },
                    sessionId,
                );
                const loaded = waitFor("Page.loadEventFired", sessionId);
                await send("Page.navigate", { url: BASE + page }, sessionId);
                await loaded;
                // polices et mesures côté client (ResizeObserver, etc.)
                await send(
                    "Runtime.evaluate",
                    {
                        expression: "document.fonts.ready.then(() => new Promise(r => setTimeout(r, 400)))",
                        awaitPromise: true,
                    },
                    sessionId,
                );
                const { result } = await send(
                    "Runtime.evaluate",
                    { expression: MEASURE, returnByValue: true },
                    sessionId,
                );
                const { rows, centers } = result.value ?? { rows: [], centers: [] };

                const problems = [];
                if (rows.length === 0) problems.push("aucune barre data-nav-row trouvée");
                for (const { row, items } of rows) {
                    if (items.length < 2) continue;
                    const ref = items[0].y;
                    for (const it of items) {
                        const d = it.y - ref;
                        if (Math.abs(d) > TOLERANCE)
                            problems.push(
                                `[${row}] ${it.what} décalé de ${d > 0 ? "+" : ""}${d.toFixed(1)} px (${it.kind}) par rapport à ${items[0].what}`,
                            );
                    }
                    // chevauchements : deux éléments d'une même barre ne doivent jamais se recouvrir
                    for (let i = 0; i < items.length; i++)
                        for (let j = i + 1; j < items.length; j++) {
                            const [a, b] = [items[i].rect, items[j].rect];
                            const w = Math.min(a[2], b[2]) - Math.max(a[0], b[0]);
                            const h = Math.min(a[3], b[3]) - Math.max(a[1], b[1]);
                            if (w > 0.5 && h > 0.5)
                                problems.push(
                                    `[${row}] ${items[i].what} chevauche ${items[j].what} (${w.toFixed(1)} px)`,
                                );
                        }
                    if (VERBOSE)
                        console.log(
                            `  ${page} @${width} ${lang} [${row}] ` +
                                items.map((i) => `${i.what}=${i.y.toFixed(1)}`).join("  "),
                        );
                }
                for (const c of centers) {
                    if (Math.abs(c.offset) > TOLERANCE)
                        problems.push(`${c.what} décentré horizontalement de ${c.offset.toFixed(1)} px`);
                }
                if (problems.length) {
                    failures += problems.length;
                    console.log(`✗ ${page} @ ${width}px [${lang}]`);
                    for (const p of problems) console.log("    " + p);
                } else if (VERBOSE) {
                    console.log(`✓ ${page} @ ${width}px [${lang}]`);
                }
            }
        }
    }

    ws.close();
    const exited = new Promise((r) => chrome.once("exit", r));
    chrome.kill();
    await exited;
    rmSync(profile, { recursive: true, force: true, maxRetries: 5 });
    console.log(failures ? `\n${failures} défaut(s) d'alignement.` : "\nTout est aligné.");
    process.exit(failures ? 1 : 0);
}

main().catch((e) => {
    console.error(e);
    process.exit(2);
});
