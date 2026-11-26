// NusaStat — penggerak situs: rute hash, navigasi, pencarian,
// mode gelap, kalkulator daya beli, banding provinsi, tabel sortable,
// dan unduh CSV. Semua berjalan dari file lokal, tanpa jaringan.

import { META, SERIES, PROVINCES, INDICATORS, cumulativeInflation } from "./data.js";
import { VIEWS, NAV } from "./views.js";
import { provinceCard } from "./map.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const idFmt = (v) => v.toLocaleString("id-ID");
const pctFmt = (v, d = 1) => v.toLocaleString("id-ID", { minimumFractionDigits: d, maximumFractionDigits: d });

function route() {
  const hash = location.hash.replace(/^#/, "") || "/";
  const [path, query] = hash.split("?");
  const params = new URLSearchParams(query || "");
  return { path: VIEWS[path] ? path : "/", prov: params.get("prov") };
}

function renderNav(current) {
  return NAV.map(([p, label]) => `<a href="#${p}" class="${p === current ? "active" : ""}">${label}</a>`).join("");
}

function render() {
  const { path, prov } = route();
  $("#nav").innerHTML = renderNav(path);
  $("#view").innerHTML = VIEWS[path](prov);
  document.title = `NusaStat — ${NAV.find(([p]) => p === path)[1]} · Statistik Nusantara`;
  window.scrollTo(0, 0);
  wirePage(path);
}

// Kalkulator: jumlah x faktor inflasi kumulatif tahun awal → 2025.
function wireCalculator() {
  const amount = $("#calc-amount"), year = $("#calc-year"), out = $("#calc-result");
  if (!amount || !year || !out) return;
  const calc = () => {
    const a = Number(amount.value) || 0;
    const y = Number(year.value);
    const factor = cumulativeInflation(y, 2025);
    const result = Math.round(a * factor);
    out.textContent = `Rp ${idFmt(a)} tahun ${y} ≈ Rp ${idFmt(result)} hari ini`;
  };
  amount.addEventListener("input", calc);
  year.addEventListener("change", calc);
  calc();
}

// Banding dua provinsi, berdampingan.
function wireCompare() {
  const a = $("#cmp-a"), b = $("#cmp-b"), out = $("#cmp-result");
  if (!a || !b || !out) return;
  const show = () => {
    const pa = PROVINCES.find((p) => p.name === a.value);
    const pb = PROVINCES.find((p) => p.name === b.value);
    if (!pa || !pb) return;
    const row = (label, va, vb) => `<tr><th>${label}</th><td>${va}</td><td>${vb}</td></tr>`;
    out.innerHTML = `<table class="compare"><thead><tr><th></th><th>${pa.name}</th><th>${pb.name}</th></tr></thead><tbody>
      ${row("Penduduk (2024)", `${pctFmt(pa.pop)} jt`, `${pctFmt(pb.pop)} jt`)}
      ${row("Kemiskinan (Mar 2025)", `${pctFmt(pa.poor)}%`, `${pctFmt(pb.poor)}%`)}
      ${row("Pengangguran (Agu 2024)", `${pctFmt(pa.tpt)}%`, `${pctFmt(pb.tpt)}%`)}
      ${row("PDRB/kapita (2024)", `Rp ${idFmt(pa.pdrb)} jt`, `Rp ${idFmt(pb.pdrb)} jt`)}
    </tbody></table>
    <p class="source-line">DKI Jakarta, misalnya, punya PDRB per kapita Rp 322 jt — sekitar lima kali lipat Papua Tengah (Rp 58 jt).</p>`;
  };
  a.addEventListener("change", show);
  b.addEventListener("change", show);
  show();
}

// Tabel provinsi: klik judul kolom untuk mengurutkan, ketik untuk mencari.
function wireProvinceTable() {
  const table = $("#prov-table");
  if (!table) return;
  const tbody = $("tbody", table);
  let rows = [...tbody.rows];
  let sortKey = null, sortAsc = true;
  const keyOf = (tr, key) => {
    const p = PROVINCES.find((x) => x.name === tr.dataset.prov);
    return key === "name" ? p.name : p[key];
  };
  $$("th[data-sort]", table).forEach((th) => {
    th.addEventListener("click", () => {
      const key = th.dataset.sort;
      sortAsc = key === sortKey ? !sortAsc : key === "name";
      sortKey = key;
      rows.sort((r1, r2) => {
        const v1 = keyOf(r1, key), v2 = keyOf(r2, key);
        const c = typeof v1 === "string" ? v1.localeCompare(v2, "id") : v1 - v2;
        return sortAsc ? c : -c;
      });
      rows.forEach((r) => tbody.appendChild(r));
      $$("th[data-sort]", table).forEach((t) => t.classList.remove("sorted"));
      th.classList.add("sorted");
    });
  });
  const search = $("#prov-search");
  if (search) {
    search.addEventListener("input", () => {
      const q = search.value.trim().toLowerCase();
      rows.forEach((r) => {
        r.style.display = !q || r.dataset.prov.toLowerCase().includes(q) ? "" : "none";
      });
    });
  }
  const csvBtn = $("#csv-btn");
  if (csvBtn) {
    csvBtn.addEventListener("click", () => {
      const head = "Provinsi,Penduduk 2024 (juta jiwa),Kemiskinan Mar 2025 (%),TPT Agu 2024 (%),PDRB per kapita 2024 (Rp juta)\n";
      const body = PROVINCES.map((p) => `"${p.name}",${p.pop},${p.poor},${p.tpt},${p.pdrb}`).join("\n");
      const blob = new Blob([head + body], { type: "text/csv;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "nusastat-38-provinsi.csv";
      a.click();
      URL.revokeObjectURL(a.href);
    });
  }
  // Klik titik peta atau baris tabel → kartu detail.
  const detail = $("#prov-detail");
  const pick = (name) => {
    const p = PROVINCES.find((x) => x.name === name);
    if (!p || !detail) return;
    detail.innerHTML = provinceCard(p);
    $$(".prov-dot", document).forEach((g) => g.classList.toggle("selected", g.dataset.prov === name));
    history.replaceState(null, "", `#/provinsi?prov=${encodeURIComponent(name)}`);
  };
  $$(".prov-dot").forEach((g) => {
    g.addEventListener("click", () => pick(g.dataset.prov));
    g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(g.dataset.prov); } });
  });
  $$("tbody tr", table).forEach((tr) => tr.addEventListener("click", () => pick(tr.dataset.prov)));
}

function wirePage(path) {
  wireCalculator();
  if (path === "/provinsi") {
    wireCompare();
    wireProvinceTable();
  }
}

// Pencarian langsung: indikator + provinsi, hasil sebagai tautan.
function wireSearch() {
  const input = $("#search");
  const box = $("#search-results");
  if (!input || !box) return;
  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) { box.innerHTML = ""; box.hidden = true; return; }
    const hits = [];
    for (const ind of INDICATORS) {
      if (ind.name.toLowerCase().includes(q)) hits.push({ label: `${ind.name} — ${ind.value}`, href: "#/metodologi" });
    }
    for (const p of PROVINCES) {
      if (p.name.toLowerCase().includes(q)) hits.push({ label: `${p.name} — penduduk ${pctFmt(p.pop)} jt, miskin ${pctFmt(p.poor)}%`, href: `#/provinsi?prov=${encodeURIComponent(p.name)}` });
    }
    for (const [key, s] of Object.entries(SERIES)) {
      if (s.label.toLowerCase().includes(q)) hits.push({ label: `${s.label} — ${s.source}`, href: "#/ekonomi" });
    }
    box.innerHTML = hits.slice(0, 8).map((h) => `<a href="${h.href}">${h.label}</a>`).join("") || `<span class="no-hit">Tidak ada hasil untuk “${input.value}”.</span>`;
    box.hidden = false;
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#search-wrap")) { box.hidden = true; }
  });
  box.addEventListener("click", (e) => { if (e.target.tagName === "A") box.hidden = true; });
}

// Mode gelap: simpan pilihan di localStorage (bukan cookie).
function wireTheme() {
  const btn = $("#theme-toggle");
  if (!btn) return;
  const saved = localStorage.getItem("nusastat-theme");
  if (saved === "dark") document.documentElement.classList.add("dark");
  const sync = () => { btn.textContent = document.documentElement.classList.contains("dark") ? "Terang" : "Gelap"; };
  btn.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("nusastat-theme", document.documentElement.classList.contains("dark") ? "dark" : "light");
    sync();
  });
  sync();
}

window.addEventListener("hashchange", render);
wireTheme();
wireSearch();
render();
