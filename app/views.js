// NusaStat — halaman-halaman situs.
// Tiap fungsi mengembalikan HTML untuk satu rute hash. Semua angka
// diambil dari data.js; teks ditulis untuk pembaca yang mencari angka,
// lengkap dengan sumber dan tahun di tiap kartu dan grafik.

import { META, SERIES, SECTORS, GINI_WORLD_BANK, INDICATORS, PROVINCES, RELEASES, cumulativeInflation } from "./data.js";
import { lineChart, barChart, donutChart, sparkline, hbarChart, fmtShort } from "./charts.js";
import { provinceMap, provinceCard } from "./map.js";

const id = (v) => v.toLocaleString("id-ID");
const pct = (v, d = 1) => v.toLocaleString("id-ID", { minimumFractionDigits: d, maximumFractionDigits: d });

function kpiCard(ind, sparkValues, sparkColor) {
  return `<article class="kpi">
    <h3>${ind.name}</h3>
    <p class="kpi-value">${ind.value}</p>
    <p class="kpi-year">${ind.year} · ${ind.source}</p>
    ${sparkValues ? sparkline(sparkValues, 140, 36, sparkColor) : ""}
  </article>`;
}

function sourceLine(text) {
  return `<p class="source-line">Sumber: ${text}</p>`;
}

function releasesBlock() {
  return `<section class="releases"><h2>Rilis terbaru</h2><ul>` +
    RELEASES.map((r) => `<li><time>${r.date}</time><strong>${r.title}</strong><span>${r.body}</span><em>${r.source}</em></li>`).join("") +
    `</ul></section>`;
}

function changedBlock() {
  return `<section class="changed"><h2>Apa yang berubah</h2><ul>
    <li><strong>Kemiskinan terendah dalam sejarah pencatatan.</strong> Maret 2026: 8,07% (22,93 juta orang), turun dari 8,47% pada Maret 2025 — sekitar 0,9 juta orang keluar dari kemiskinan dalam setahun.</li>
    <li><strong>Inflasi 2025 sebesar 1,9% — terendah sejak 2022.</strong> Setelah 4,2% pada 2022 dan 3,7% pada 2023, inflasi turun ke 2,3% (2024) lalu 1,9% (2025).</li>
    <li><strong>Ekonomi tumbuh 5,1% pada 2025.</strong> Kuartal III 2025 tumbuh 5,04% dibanding setahun sebelumnya.</li>
    <li><strong>Pengangguran 4,85% pada Agustus 2025.</strong> Turun tipis dari 4,91% setahun sebelumnya; sekitar 7,46 juta orang menganggur.</li>
    <li><strong>Ketimpangan menurut BPS turun ke 0,375 pada Maret 2025.</strong> Gini perkotaan 0,395; perdesaan 0,299.</li>
  </ul></section>`;
}

export function viewHome() {
  const kpis = [
    kpiCard(INDICATORS[0], SERIES.population.values, "#0e6b5c"),
    kpiCard(INDICATORS[1], SERIES.gdpGrowth.values, "#0e6b5c"),
    kpiCard(INDICATORS[3], SERIES.inflation.values, "#b3402e"),
    kpiCard(INDICATORS[6], SERIES.poverty.values, "#0e6b5c"),
    kpiCard(INDICATORS[5], SERIES.unemployment.values, "#d99a26"),
    kpiCard(INDICATORS[8], SERIES.giniBps.values.map((v) => v * 100), "#7a4a21"),
  ];
  return `
  <p class="kicker">Indonesia · 2019–2025 · 24 indikator · 38 provinsi</p>
  <h1>Indonesia dalam angka: 285,7 juta penduduk, PDB tumbuh 5,1%, inflasi 1,9%</h1>
  <p class="lede">NusaStat menghimpun angka resmi Indonesia — penduduk, ekonomi, harga, kemiskinan, dan ketenagakerjaan — dari BPS, Kementerian Keuangan, dan Kementerian Kesehatan, lengkap dengan sumber dan tahun di setiap angka.</p>
  <section class="kpi-grid">${kpis.join("")}</section>
  <div class="two-col">
    <section class="panel">${lineChart({ years: META.years, values: SERIES.gdpGrowth.values, title: "Pertumbuhan PDB riil, % per tahun", unit: "BPS", color: "#0e6b5c" })}
    ${sourceLine("BPS, Berita Resmi Statistik PDB. 2020: −2,1% saat pandemi; 2025: 5,1%.")}</section>
    <section class="panel">${donutChart({ items: SECTORS.slice(0, 8).concat([{ name: "Lapangan usaha lainnya", value: 15.1 }]), title: "PDB menurut lapangan usaha, 2024", height: 300 })}
    ${sourceLine("BPS. Industri pengolahan 18,9%; perdagangan 13,0%; pertanian 12,5%. Total 100,0%.")}</section>
  </div>
  ${changedBlock()}
  ${releasesBlock()}`;
}

export function viewEkonomi() {
  return `
  <p class="crumb"><a href="#/">Beranda</a> / Ekonomi</p>
  <h1>Ekonomi: tumbuh 5,1% pada 2025, utang 40,9% PDB</h1>
  <p class="lede">PDB riil tumbuh 5,1% pada 2025 setelah 5,0% pada 2024. Kuartal III 2025 tumbuh 5,04% dibanding setahun sebelumnya. Ekspor barang mencapai US$ 271,0 miliar.</p>
  <div class="two-col">
    <section class="panel">${lineChart({ years: META.years, values: SERIES.gdpGrowth.values, title: "Pertumbuhan PDB riil, %", color: "#0e6b5c" })}
    ${sourceLine("BPS. Kontraksi 2020 (−2,1%) adalah satu-satunya penurunan dalam seri ini.")}</section>
    <section class="panel">${barChart({ years: META.years, values: SERIES.debt.values, title: "Utang pemerintah, % PDB", color: "#7a4a21" })}
    ${sourceLine("Kementerian Keuangan. Rasio utang 2025: 40,9% PDB.")}</section>
  </div>
  <section class="panel">${barChart({ years: META.years, values: SERIES.exports.values, title: "Ekspor barang, miliar US$", color: "#0e6b5c", decimals: 1 })}
  ${sourceLine("BPS. Puncak 2022 (US$ 291,9 miliar) didorong harga komoditas; 2025: US$ 271,0 miliar.")}</section>
  <section class="panel">${donutChart({ items: SECTORS, title: "PDB menurut lapangan usaha, 2024", height: 340 })}
  ${sourceLine("BPS. Sebelas kelompok lapangan usaha, total 100,0%.")}</section>
  <aside class="callout"><h2>Apa artinya</h2><p>Pertumbuhan 5% setahun selama tiga tahun berturut-turut berarti ukuran ekonomi bertambah sekitar seperenam sejak 2022. Yang menopang: konsumsi rumah tangga, investasi, dan industri pengolahan sebagai lapangan usaha terbesar (18,9% PDB).</p></aside>`;
}

export function viewHarga() {
  const factor = cumulativeInflation(2020, 2025);
  const rp = Math.round(1000000 * factor);
  return `
  <p class="crumb"><a href="#/">Beranda</a> / Harga</p>
  <h1>Harga: inflasi 1,9% pada 2025, terendah sejak 2022</h1>
  <p class="lede">Inflasi tahunan turun dari 4,2% (2022) ke 1,9% (2025). Harga-harga masih naik, tetapi jauh lebih pelan daripada tiga tahun lalu.</p>
  <section class="panel">${lineChart({ years: META.years, values: SERIES.inflation.values, title: "Inflasi tahunan (IHK), %", color: "#b3402e" })}
  ${sourceLine("BPS. Inflasi 2021 (1,6%) lebih rendah dari 2025 — karena itu klaim yang tepat adalah “terendah sejak 2022”, bukan “sejak 2021”.")}</section>
  <aside class="callout"><h2>Apa artinya</h2><p>Rp 1 juta pada 2020 membeli barang yang kini berharga sekitar <strong>Rp 1,14 juta</strong>. Inflasi kumulatif 2021–2025 sekitar <strong>14,4%</strong> — hasil dari 1,6% × 4,2% × 3,7% × 2,3% × 1,9% yang dikalikan tahun demi tahun.</p></aside>
  <section class="panel calculator" id="calculator">
    <h2>Kalkulator daya beli</h2>
    <p>Berapa nilai uang dari tahun lalu bila diukur dengan harga hari ini?</p>
    <label>Jumlah (Rp) <input id="calc-amount" type="number" value="1000000" min="1000" step="1000"></label>
    <label>Tahun awal
      <select id="calc-year">
        <option value="2019">2019</option>
        <option value="2020" selected>2020</option>
        <option value="2021">2021</option>
        <option value="2022">2022</option>
        <option value="2023">2023</option>
        <option value="2024">2024</option>
      </select>
    </label>
    <p class="calc-result" id="calc-result">Rp 1.000.000 tahun 2020 ≈ Rp ${id(rp)} hari ini</p>
    <p class="source-line">Dihitung dari inflasi tahunan BPS (IHK). Faktor 2020→2025: ${factor.toFixed(4)}.</p>
  </section>`;
}

export function viewPenduduk() {
  const top = [...PROVINCES].sort((a, b) => b.pop - a.pop).slice(0, 10);
  return `
  <p class="crumb"><a href="#/">Beranda</a> / Penduduk</p>
  <h1>Penduduk: 285,7 juta jiwa, 55% tinggal di Jawa</h1>
  <p class="lede">Penduduk Indonesia bertambah sekitar 15 juta jiwa dalam enam tahun, dari 270,6 juta (2019) ke 285,7 juta (2025). Jawa Barat sendiri berpenduduk 50,3 juta — lebih besar dari kebanyakan negara di dunia.</p>
  <section class="panel">${barChart({ years: META.years, values: SERIES.population.values, title: "Penduduk, juta jiwa", color: "#0e6b5c" })}
  ${sourceLine("BPS, estimasi pertengahan tahun. 2024: 281,6 juta; 2025: 285,7 juta.")}</section>
  <section class="panel">${hbarChart({ items: top.map((p) => ({ name: p.name, value: p.pop })), title: "10 provinsi terpadat, juta jiwa (2024)", height: 380, valueFmt: (v) => pct(v) })}
  ${sourceLine("BPS, 2024 (dibulatkan). Tiga provinsi terpadat — Jawa Barat, Jawa Timur, Jawa Tengah — menampung sekitar 130 juta jiwa.")}</section>
  <aside class="callout"><h2>Apa artinya</h2><p>Lebih dari separuh penduduk tinggal di Jawa, pulau seluas 7% wilayah daratan. Di ujung lain, enam provinsi di Papua dihuni sekitar 5,8 juta jiwa di wilayah yang jauh lebih luas — ketimpangan sebaran ini membentuk hampir semua kebijakan pembangunan.</p></aside>`;
}

export function viewKemiskinan() {
  const py = SERIES.poverty.years;
  return `
  <p class="crumb"><a href="#/">Beranda</a> / Kemiskinan</p>
  <h1>Kemiskinan: 8,07% pada Maret 2026, terendah sepanjang pencatatan</h1>
  <p class="lede">Persentase penduduk miskin turun dari 10,14% (Maret 2021, puncak pandemi) ke 8,07% (Maret 2026). Jumlahnya 22,93 juta orang — berkurang sekitar 0,9 juta dibanding Maret 2025.</p>
  <section class="panel">${lineChart({ years: py, values: SERIES.poverty.values, title: "Penduduk miskin, % (Susenas Maret)", color: "#0e6b5c" })}
  ${sourceLine("BPS, Susenas Maret. Seri ini memakai SATU vintage (Maret) — angka September tidak dicampur, supaya tahun demi tahun bisa dibandingkan. Maret 2026: 8,07% (22,93 juta orang).")}</section>
  <div class="two-col">
    <section class="panel"><h2>Siapa yang masih miskin</h2>
      <p>Kemiskinan perdesaan <strong>10,67%</strong>, hampir dua kali lipat perkotaan (<strong>6,34%</strong>) pada Maret 2026. Garis kemiskinan nasional: <strong>Rp 669.235</strong> per kapita per bulan — tiga perempatnya untuk makanan.</p>
      ${sourceLine("BPS, Profil Kemiskinan Maret 2026 (BRS 5 Agu 2026).")}
      <p>Provinsi dengan kemiskinan tertinggi adalah Papua Pegunungan (32,3%) dan Papua Tengah (29,4%) pada Maret 2025; terendah adalah Bali (3,42%). Selisihnya hampir sepuluh kali lipat.</p>
    </section>
    <section class="panel"><h2>Ketimpangan: dua angka, dua ukuran</h2>
      <p><strong>Gini BPS (Maret 2025): 37,5.</strong> Turun dari 37,9 setahun sebelumnya; perkotaan 39,5, perdesaan 29,9. Diukur dari pengeluaran rumah tangga Susenas.</p>
      <p><strong>Gini Bank Dunia (2025): 34,4.</strong> Angka ini berasal dari Poverty and Inequality Platform Bank Dunia — ukuran yang berbeda dari Gini BPS, sehingga keduanya tidak bisa dibandingkan langsung.</p>
      ${sourceLine("BPS, BRS No. 64/07/Th. XXVIII (25 Jul 2025); Bank Dunia, Poverty and Inequality Platform.")}
    </section>
  </div>
  <aside class="callout"><h2>Apa artinya</h2><p>Penurunan 0,40 poin dalam setahun (Maret 2025→Maret 2026) berarti sekitar 0,9 juta orang keluar dari kemiskinan — bukan 1,1 juta; angka 1,1 juta lahir dari mengalikan 0,40 poin dengan jumlah penduduk tanpa menghitung pertumbuhan penduduk. Kemiskinan kini paling rendah dalam sejarah pencatatan, tetapi tetap terkonsentrasi di perdesaan dan di Papua.</p></aside>`;
}

export function viewKerja() {
  const top = [...PROVINCES].sort((a, b) => b.tpt - a.tpt).slice(0, 8);
  return `
  <p class="crumb"><a href="#/">Beranda</a> / Tenaga kerja</p>
  <h1>Tenaga kerja: pengangguran 4,85%, terendah dalam tujuh tahun</h1>
  <p class="lede">Tingkat pengangguran terbuka turun dari 7,07% (Agustus 2020, puncak pandemi) ke 4,85% (Agustus 2025). Sekitar 7,46 juta orang masih menganggur.</p>
  <section class="panel">${lineChart({ years: META.years, values: SERIES.unemployment.values, title: "Pengangguran terbuka (TPT), %", color: "#d99a26", decimals: 2 })}
  ${sourceLine("BPS, Sakernas Agustus. 2024: 4,91%; 2025: 4,85%.")}</section>
  <section class="panel">${hbarChart({ items: top.map((p) => ({ name: p.name, value: p.tpt, color: "#b3402e" })), title: "TPT tertinggi antarprovinsi, % (Agu 2024)", height: 320, valueFmt: (v) => pct(v) })}
  ${sourceLine("BPS, Sakernas Agustus 2024. Banten tertinggi (6,8%); Bali terendah (2,1%).")}</section>
  <aside class="callout"><h2>Apa artinya</h2><p>Pengangguran tertinggi justru di provinsi industri — Banten (6,8%), DKI Jakarta dan Jawa Barat (6,2%) — tempat pencari kerja menumpuk. Di Bali (2,1%) dan Nusa Tenggara Timur (3,0%), angka rendah sebagian mencerminkan pekerjaan informal dan pertanian keluarga, bukan lapangan kerja formal yang melimpah.</p></aside>`;
}

export function viewProvinsi(selectedName) {
  const sorted = [...PROVINCES].sort((a, b) => b.pop - a.pop);
  const sel = PROVINCES.find((p) => p.name === selectedName) || null;
  const rows = sorted.map((p) => `<tr data-prov="${p.name}">
    <td>${p.name}</td><td class="num">${pct(p.pop)}</td><td class="num">${pct(p.poor)}%</td>
    <td class="num">${pct(p.tpt)}%</td><td class="num">Rp ${id(p.pdrb)} jt</td></tr>`).join("");
  return `
  <p class="crumb"><a href="#/">Beranda</a> / Provinsi</p>
  <h1>38 provinsi: dari 50,3 juta jiwa sampai 0,5 juta</h1>
  <p class="lede">Semua 38 provinsi dalam satu tabel: penduduk, kemiskinan, pengangguran, dan PDRB per kapita. Klik baris atau titik di peta untuk melihat rincian provinsi.</p>
  <section class="panel"><h2>Peta kemiskinan provinsi</h2>
    ${provinceMap(selectedName)}
    ${sourceLine("Peta skematik: titik diletakkan pada koordinat ibu kota provinsi, bukan batas wilayah resmi. Warna = kemiskinan Maret 2025 (BPS); ukuran titik = jumlah penduduk.")}
  </section>
  <div class="two-col">
    <section class="panel"><h2>Detail provinsi</h2><div id="prov-detail">${provinceCard(sel)}</div></section>
    <section class="panel"><h2>Bandingkan dua provinsi</h2>
      <label>Provinsi A <select id="cmp-a">${PROVINCES.map((p) => `<option ${p.name === "DKI Jakarta" ? "selected" : ""}>${p.name}</option>`).join("")}</select></label>
      <label>Provinsi B <select id="cmp-b">${PROVINCES.map((p) => `<option ${p.name === "Papua Tengah" ? "selected" : ""}>${p.name}</option>`).join("")}</select></label>
      <div id="cmp-result"></div>
    </section>
  </div>
  <section class="panel">
    <div class="table-head"><h2>Semua provinsi</h2>
    <button id="csv-btn" type="button">Unduh CSV</button>
    <label>Cari <input id="prov-search" type="search" placeholder="Nama provinsi…"></label></div>
    <p class="source-line">Penduduk 2024 (BPS); kemiskinan Maret 2025 (BPS); pengangguran Agustus 2024 (BPS); PDRB per kapita 2024 (BPS). Angka dibulatkan; jumlah provinsi bisa selisih kecil dari angka nasional.</p>
    <div class="table-wrap"><table id="prov-table">
      <thead><tr><th data-sort="name">Provinsi</th><th data-sort="pop">Penduduk (jt)</th><th data-sort="poor">Miskin (%)</th><th data-sort="tpt">TPT (%)</th><th data-sort="pdrb">PDRB/kapita</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  </section>`;
}

export function viewMetodologi() {
  return `
  <p class="crumb"><a href="#/">Beranda</a> / Metodologi</p>
  <h1>Metodologi &amp; sumber</h1>
  <p class="lede">NusaStat bukan lembaga statistik. Situs ini menghimpun dan menyajikan angka resmi yang diterbitkan BPS, Kementerian Keuangan, Kementerian Kesehatan, dan Bank Dunia — dengan sumber dan tahun di setiap angka.</p>
  <section class="panel"><h2>Dari mana angkanya</h2><ul class="method-list">
    <li><strong>BPS (Badan Pusat Statistik)</strong> — Berita Resmi Statistik: PDB, inflasi, kemiskinan (Susenas), Gini, penduduk, Sakernas, PDRB provinsi, IPM.</li>
    <li><strong>Kementerian Keuangan</strong> — rasio utang pemerintah terhadap PDB (APBN Kita).</li>
    <li><strong>Kementerian Kesehatan</strong> — prevalensi stunting balita (Survei Status Gizi Indonesia/SSGI 2024).</li>
    <li><strong>Bank Dunia</strong> — indeks Gini dari Poverty and Inequality Platform (survei rumah tangga terbaru, 2025).</li>
  </ul></section>
  <section class="panel"><h2>Tiga keputusan yang kami jaga</h2><ul class="method-list">
    <li><strong>Satu vintage untuk kemiskinan.</strong> Seri kemiskinan memakai Susenas Maret saja (2019–2026). Angka September tidak dicampur: Maret 2019 (9,41%) berbeda dari September 2019 (9,22%), dan mencampur keduanya membuat tren tahunan menyesatkan.</li>
    <li><strong>Dua Gini, dua label.</strong> Gini BPS Maret 2025 adalah 37,5; Gini Bank Dunia (Poverty and Inequality Platform, 2025) adalah 34,4. Keduanya mengukur ketimpangan dari pengeluaran, tetapi dengan survei dan pengolahan yang berbeda — karena itu ditampilkan berdampingan dengan label masing-masing, bukan disamakan.</li>
    <li><strong>Angka provinsi dibulatkan.</strong> Populasi, kemiskinan, pengangguran, dan PDRB per kapita provinsi dibulatkan ke 1 desimal. Jumlah provinsi dapat selisih kecil dari angka nasional karena pembulatan dan pembobotan survei.</li>
  </ul></section>
  <section class="panel"><h2>Tentang peta</h2><p>Peta di halaman Provinsi adalah peta skematik: garis pantai digambar sederhana dan titik provinsi diletakkan pada koordinat ibu kota. Peta ini menunjukkan pola — kemiskinan tertinggi di Papua, penduduk terpadat di Jawa — bukan batas wilayah resmi.</p></section>
  <section class="panel"><h2>Kalkulator daya beli</h2><p>Kalkulator di halaman Harga mengalikan jumlah uang dengan inflasi tahunan BPS (IHK) dari tahun awal sampai 2025. Contoh: Rp 1.000.000 tahun 2020 menjadi sekitar Rp 1.144.000 pada 2025 (faktor 1,1444; inflasi kumulatif 14,4%).</p></section>
  <section class="panel"><h2>Pembaruan terakhir</h2><p>Data diperbarui 27 November 2026. Rilis terbaru yang dipakai: Profil Kemiskinan Maret 2026 (BPS, 5 Agu 2026).</p></section>`;
}

export const VIEWS = {
  "/": viewHome,
  "/ekonomi": viewEkonomi,
  "/harga": viewHarga,
  "/penduduk": viewPenduduk,
  "/kemiskinan": viewKemiskinan,
  "/kerja": viewKerja,
  "/provinsi": viewProvinsi,
  "/metodologi": viewMetodologi,
};

export const NAV = [
  ["/", "Beranda"],
  ["/ekonomi", "Ekonomi"],
  ["/harga", "Harga"],
  ["/penduduk", "Penduduk"],
  ["/kemiskinan", "Kemiskinan"],
  ["/kerja", "Tenaga Kerja"],
  ["/provinsi", "Provinsi"],
  ["/metodologi", "Metodologi"],
];
