// NusaStat — peta skematik 38 provinsi.
// Peta ini SKEMATIK: garis pantai digambar sederhana, titik provinsi
// diletakkan pada koordinat ibu kota (bukan batas wilayah resmi).
// Warna titik = tingkat kemiskinan Maret 2025 (BPS): makin gelap
// merah berarti makin tinggi. Klik titik untuk melihat detail provinsi.

import { PROVINCES } from "./data.js";

// Garis pantai yang disederhanakan, satu path per gugus pulau.
const ISLANDS = [
  // Sumatra
  "M40,95 L70,60 L110,90 L150,150 L180,210 L210,270 L240,330 L250,380 L225,385 L190,320 L150,250 L110,180 L70,130 L45,110 Z",
  // Jawa
  "M260,425 L300,415 L350,420 L400,430 L440,445 L430,460 L380,458 L320,450 L270,445 Z",
  // Kalimantan
  "M340,240 L380,210 L430,205 L470,230 L490,270 L480,320 L450,355 L410,360 L370,340 L340,300 L325,265 Z",
  // Sulawesi
  "M560,220 L600,200 L630,220 L620,260 L650,290 L640,330 L610,350 L580,330 L560,300 L540,260 L550,230 Z",
  // Papua
  "M770,280 L830,250 L900,255 L960,280 L970,330 L950,390 L920,450 L880,470 L820,450 L780,400 L760,340 Z",
  // Bali dan Nusa Tenggara (gugus kecil)
  "M438,478 L452,474 L456,486 L442,490 Z",
  "M480,486 L500,482 L506,494 L488,498 Z",
  "M545,505 L575,500 L585,514 L552,520 Z",
  // Maluku
  "M690,330 L706,326 L712,342 L694,348 Z",
];

function povertyColor(p) {
  if (p < 5) return "#2e7d5b";
  if (p < 8) return "#7a9a3b";
  if (p < 11) return "#d99a26";
  if (p < 16) return "#c96a1e";
  return "#a02c1e";
}

function povertyBand(p) {
  if (p < 5) return "di bawah 5%";
  if (p < 8) return "5–8%";
  if (p < 11) return "8–11%";
  if (p < 16) return "11–16%";
  return "di atas 16%";
}

export function provinceMap(selectedName) {
  let s = `<svg viewBox="0 0 1000 560" role="img" aria-label="Peta skematik 38 provinsi Indonesia" class="prov-map">`;
  for (const d of ISLANDS) {
    s += `<path d="${d}" class="island"/>`;
  }
  // Garis lintang khatulistiwa, sebagai orientasi.
  s += `<line x1="20" y1="242" x2="980" y2="242" class="equator"/>`;
  s += `<text x="972" y="236" text-anchor="end" class="map-note">khatulistiwa</text>`;
  for (const p of PROVINCES) {
    const sel = p.name === selectedName;
    const r = 5 + Math.sqrt(p.pop) * 1.1;
    s += `<g class="prov-dot${sel ? " selected" : ""}" data-prov="${p.name}" tabindex="0" role="button" aria-label="${p.name}: kemiskinan ${p.poor}%">`;
    if (sel) s += `<circle cx="${p.x}" cy="${p.y}" r="${(r + 7).toFixed(1)}" class="halo"/>`;
    s += `<circle cx="${p.x}" cy="${p.y}" r="${r.toFixed(1)}" fill="${povertyColor(p.poor)}"/>`;
    s += `<title>${p.name} — penduduk ${p.pop} jt, miskin ${p.poor}%, TPT ${p.tpt}%, PDRB/kapita Rp ${p.pdrb} jt</title></g>`;
  }
  // Label untuk provinsi besar, supaya peta terbaca sekilas.
  const labels = [
    ["Aceh", 46, 66], ["Sumut", 114, 122], ["Jabar", 292, 466],
    ["Jatim", 394, 484], ["Kalimantan", 410, 290], ["Sulawesi", 596, 300],
    ["Papua", 870, 360], ["NTT", 562, 540], ["Bali", 444, 508],
  ];
  for (const [t, x, y] of labels) {
    s += `<text x="${x}" y="${y}" text-anchor="middle" class="map-label">${t}</text>`;
  }
  s += `</svg>`;
  // Legenda di bawah peta.
  s += `<div class="map-legend">`;
  s += `<span class="legend-title">Warna = kemiskinan Maret 2025 (BPS):</span>`;
  for (const [lo, col] of [[4, "#2e7d5b"], [7, "#7a9a3b"], [10, "#d99a26"], [14, "#c96a1e"], [20, "#a02c1e"]]) {
    s += `<span class="legend-item"><i style="background:${col}"></i>${povertyBand(lo === 20 ? 20 : lo)}</span>`;
  }
  s += `<span class="legend-note">Ukuran titik = jumlah penduduk. Klik titik untuk detail.</span></div>`;
  return s;
}

export function provinceCard(p) {
  if (!p) return `<p class="muted">Pilih satu provinsi di peta atau dari tabel untuk melihat rinciannya.</p>`;
  return `<h3>${p.name}</h3>
  <dl class="stat-list">
    <div><dt>Penduduk (2024)</dt><dd>${p.pop.toLocaleString("id-ID")} juta jiwa</dd></div>
    <div><dt>Kemiskinan (Mar 2025)</dt><dd>${p.poor.toLocaleString("id-ID")}%</dd></div>
    <div><dt>Pengangguran (Agu 2024)</dt><dd>${p.tpt.toLocaleString("id-ID")}%</dd></div>
    <div><dt>PDRB per kapita (2024)</dt><dd>Rp ${p.pdrb.toLocaleString("id-ID")} jt</dd></div>
  </dl>
  <p class="source-line">Sumber: BPS (penduduk 2024; Susenas Maret 2025; Sakernas Agustus 2024; PDRB 2024). Angka dibulatkan.</p>`;
}
