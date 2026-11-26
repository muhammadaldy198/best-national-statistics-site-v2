// NusaStat v2 — program penyerahan (Node 22, pustaka standar saja).
// Menyalin app/ dan screenshots/ dari samping file ini ke direktori
// keluaran, lalu menulis dossier.json dengan pustaka make.fun yang
// divendor. Di luar kontainer grader, MAKEFUN_OUTPUT_DIR menggantikan
// /output. Program ini murni: tanpa waktu, tanpa acak, tanpa jaringan —
// Satu-satunya keluaran adalah salinan app/, salinan screenshots/,
// dan dossier.json yang ditulis pustaka — tidak ada file lain.
// dua kali jalan menghasilkan byte yang sama persis.

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(out, { recursive: true });
cpSync(join(here, "app"), join(out, "app"), { recursive: true });
mkdirSync(join(out, "screenshots"), { recursive: true });
if (existsSync(join(here, "screenshots"))) {
  cpSync(join(here, "screenshots"), join(out, "screenshots"), { recursive: true });
}

// Batas yang dipakai scorer: teks dossier 160 KiB, maksimal 4
// screenshot @ 256 KiB, app/ maksimal 993 entri dan 16 MiB.
writeFileSync(
  join(out, "dossier.json"),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
