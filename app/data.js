// NusaStat — data statistik Indonesia.
// Semua angka adalah angka publik BPS / Kemenkeu / Kemenkes / Bank Dunia.
// Vintage ditulis di tiap seri: kemiskinan memakai Susenas MARET saja
// (September tidak dicampur, supaya satu seri satu vintage).
// Angka provinsi dibulatkan ke 1 desimal; jumlah provinsi bisa selisih
// kecil dari angka nasional karena pembulatan dan pembobotan survei.

export const META = {
  brand: "NusaStat",
  tagline: "Statistik Nusantara",
  country: "Indonesia",
  years: [2019, 2020, 2021, 2022, 2023, 2024, 2025],
  updated: "27 November 2026",
};

// Seri nasional. values sejajar dengan META.years, kecuali POVERTY yang
// memakai tahun 2019-2026 (delapan titik Maret).
export const SERIES = {
  gdpGrowth: {
    label: "Pertumbuhan PDB riil",
    unit: "% per tahun",
    values: [5.0, -2.1, 3.7, 5.3, 5.0, 5.0, 5.1],
    source: "BPS, Berita Resmi Statistik PDB",
    note: "2025: pertumbuhan setahun penuh. PDB kuartal III 2025 tumbuh 5,04% yoy (BPS, 5 Nov 2025).",
  },
  inflation: {
    label: "Inflasi (IHK, yoy)",
    unit: "%",
    values: [2.8, 2.0, 1.6, 4.2, 3.7, 2.3, 1.9],
    source: "BPS, Berita Resmi Statistik Inflasi",
    note: "Inflasi 2025 sebesar 1,9% — terendah sejak 2022 (2022: 4,2%; 2023: 3,7%; 2024: 2,3%).",
  },
  population: {
    label: "Penduduk",
    unit: "juta jiwa",
    values: [270.6, 271.7, 273.9, 275.8, 278.7, 281.6, 285.7],
    source: "BPS, proyeksi & estimasi pertengahan tahun",
    note: "Jawa menampung sekitar 55% penduduk; tiga provinsi terpadat adalah Jawa Barat, Jawa Timur, dan Jawa Tengah.",
  },
  unemployment: {
    label: "Pengangguran terbuka (TPT)",
    unit: "% angkatan kerja",
    values: [5.28, 7.07, 6.49, 5.86, 5.32, 4.91, 4.85],
    source: "BPS, Sakernas Agustus",
    note: "TPT Agustus 2025 sebesar 4,85% (sekitar 7,46 juta orang).",
  },
  poverty: {
    label: "Penduduk miskin",
    unit: "% penduduk",
    years: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026],
    values: [9.41, 9.78, 10.14, 9.54, 9.36, 9.03, 8.47, 8.07],
    source: "BPS, Susenas Maret (BRS 5 Agu 2026)",
    note: "Satu vintage: Maret saja. Maret 2026: 22,93 juta orang, berkurang sekitar 0,9 juta dibanding Maret 2025 (23,85 juta). Garis kemiskinan Maret 2026: Rp 669.235 per kapita per bulan.",
  },
  giniBps: {
    label: "Rasio Gini (BPS)",
    unit: "0–1",
    values: [0.38, 0.385, 0.381, 0.384, 0.388, 0.379, 0.375],
    source: "BPS, Susenas Maret (BRS No. 64/07/Th. XXVIII, 25 Jul 2025)",
    note: "Gini BPS Maret 2025 sebesar 0,375 (37,5), turun dari 0,379 pada Maret 2024. Diukur dari pengeluaran rumah tangga.",
  },
  debt: {
    label: "Utang pemerintah",
    unit: "% PDB",
    values: [30.6, 37.6, 40.7, 39.6, 39.2, 39.7, 40.9],
    source: "Kementerian Keuangan, APBN Kita",
    note: "Rasio utang naik saat pandemi 2020, lalu stabil di kisaran 39–41% PDB.",
  },
  exports: {
    label: "Ekspor barang",
    unit: "miliar US$",
    values: [167.7, 163.2, 231.6, 291.9, 258.8, 264.7, 271.0],
    source: "BPS, Statistik Perdagangan Luar Negeri",
    note: "Ekspor 2022 melonjak ke US$ 291,9 miliar, lalu turun dan pulih ke US$ 271,0 miliar pada 2025.",
  },
};

// Struktur PDB menurut lapangan usaha, 2024 (persen, jumlah 100,0).
export const SECTORS = [
  { name: "Industri pengolahan", value: 18.9 },
  { name: "Perdagangan", value: 13.0 },
  { name: "Pertanian, kehutanan, perikanan", value: 12.5 },
  { name: "Konstruksi", value: 10.2 },
  { name: "Pertambangan & penggalian", value: 9.0 },
  { name: "Administrasi pemerintahan", value: 8.0 },
  { name: "Informasi & komunikasi", value: 7.6 },
  { name: "Transportasi & pergudangan", value: 5.7 },
  { name: "Jasa perusahaan", value: 5.3 },
  { name: "Keuangan & asuransi", value: 4.3 },
  { name: "Lapangan usaha lainnya", value: 5.5 },
];

// Gini menurut Bank Dunia — ukuran BERBEDA dari Gini BPS, jangan
// dibandingkan langsung: Bank Dunia memakai Poverty and Inequality
// Platform (survei rumah tangga terbaru, 2025) dan melaporkannya
// dalam skala 0–100.
export const GINI_WORLD_BANK = {
  value: 34.4,
  year: 2025,
  source: "Bank Dunia, Poverty and Inequality Platform (survei 2025)",
  note: "Angka 34,4 adalah Gini Bank Dunia, bukan Gini BPS (37,5 pada Maret 2025). Keduanya mengukur ketimpangan dari data pengeluaran, tetapi dengan cakupan dan pengolahan survei yang berbeda.",
};

// 24 indikator utama yang tampil di kartu beranda.
export const INDICATORS = [
  { name: "Penduduk", value: "285,7 jt", year: 2025, source: "BPS" },
  { name: "Pertumbuhan PDB", value: "5,1%", year: 2025, source: "BPS" },
  { name: "PDB kuartal III 2025", value: "5,04% yoy", year: 2025, source: "BPS, 5 Nov 2025" },
  { name: "Inflasi", value: "1,9%", year: 2025, source: "BPS" },
  { name: "Inflasi kumulatif 2021–2025", value: "14,4%", year: 2025, source: "Dihitung dari inflasi tahunan BPS" },
  { name: "Pengangguran (TPT)", value: "4,85%", year: "Agu 2025", source: "BPS, Sakernas" },
  { name: "Penduduk miskin", value: "8,07%", year: "Mar 2026", source: "BPS, Susenas" },
  { name: "Jumlah penduduk miskin", value: "22,93 jt", year: "Mar 2026", source: "BPS" },
  { name: "Gini (BPS)", value: "37,5", year: "Mar 2025", source: "BPS, Susenas" },
  { name: "Gini (Bank Dunia)", value: "34,4", year: 2025, source: "Bank Dunia, PIP" },
  { name: "Indeks Pembangunan Manusia", value: "75,02", year: 2024, source: "BPS" },
  { name: "Harapan hidup", value: "73,0 thn", year: 2024, source: "BPS" },
  { name: "Balita stunting", value: "19,8%", year: 2024, source: "Kemenkes, SSGI" },
  { name: "Utang pemerintah", value: "40,9% PDB", year: 2025, source: "Kemenkeu" },
  { name: "Ekspor barang", value: "US$ 271,0 M", year: 2025, source: "BPS" },
  { name: "Garis kemiskinan", value: "Rp 669.235", year: "Mar 2026", source: "BPS" },
  { name: "Kemiskinan perdesaan", value: "10,67%", year: "Mar 2026", source: "BPS" },
  { name: "Kemiskinan perkotaan", value: "6,34%", year: "Mar 2026", source: "BPS" },
  { name: "Provinsi terpadat", value: "Jabar 50,3 jt", year: 2024, source: "BPS" },
  { name: "Kemiskinan terendah", value: "Bali 3,42%", year: "Mar 2025", source: "BPS" },
  { name: "Kemiskinan tertinggi", value: "Papua Tengah 29,4%", year: "Mar 2025", source: "BPS" },
  { name: "PDRB/kapita tertinggi", value: "DKI Rp 322 jt", year: 2024, source: "BPS" },
  { name: "TPT tertinggi", value: "Banten 6,8%", year: "Agu 2024", source: "BPS, Sakernas" },
  { name: "TPT terendah", value: "Bali 2,1%", year: "Agu 2024", source: "BPS, Sakernas" },
];

// 38 provinsi. pop = penduduk 2024 (juta jiwa, BPS, dibulatkan);
// poor = kemiskinan Maret 2025 (%, BPS, dibulatkan);
// tpt = pengangguran Agustus 2024 (%, BPS Sakernas, dibulatkan);
// pdrb = PDRB per kapita 2024 (Rp juta, BPS, dibulatkan).
// x, y = posisi skematik di peta (viewBox 1000x560), dari koordinat
// ibu kota provinsi — BUKAN batas wilayah resmi.
export const PROVINCES = [
  { name: "Aceh", pop: 5.6, poor: 12.3, tpt: 5.7, pdrb: 62, x: 46, y: 83 },
  { name: "Sumatera Utara", pop: 15.6, poor: 7.9, tpt: 5.6, pdrb: 68, x: 114, y: 138 },
  { name: "Sumatera Barat", pop: 6.0, poor: 5.6, tpt: 5.5, pdrb: 61, x: 148, y: 257 },
  { name: "Riau", pop: 6.7, poor: 6.3, tpt: 4.0, pdrb: 178, x: 168, y: 228 },
  { name: "Jambi", pop: 3.6, poor: 7.2, tpt: 4.4, pdrb: 74, x: 212, y: 289 },
  { name: "Sumatera Selatan", pop: 8.8, poor: 10.6, tpt: 4.3, pdrb: 71, x: 236, y: 329 },
  { name: "Bengkulu", pop: 2.1, poor: 11.9, tpt: 3.5, pdrb: 48, x: 186, y: 352 },
  { name: "Lampung", pop: 9.3, poor: 10.0, tpt: 4.1, pdrb: 52, x: 246, y: 375 },
  { name: "Kep. Bangka Belitung", pop: 1.5, poor: 4.1, tpt: 4.5, pdrb: 82, x: 262, y: 320 },
  { name: "Kepulauan Riau", pop: 2.3, poor: 5.5, tpt: 6.0, pdrb: 204, x: 238, y: 216 },
  { name: "DKI Jakarta", pop: 10.7, poor: 4.1, tpt: 6.2, pdrb: 322, x: 276, y: 421 },
  { name: "Jawa Barat", pop: 50.3, poor: 7.2, tpt: 6.2, pdrb: 61, x: 292, y: 441 },
  { name: "Jawa Tengah", pop: 37.9, poor: 9.4, tpt: 4.8, pdrb: 56, x: 348, y: 444 },
  { name: "DI Yogyakarta", pop: 3.8, poor: 10.7, tpt: 3.5, pdrb: 52, x: 348, y: 467 },
  { name: "Jawa Timur", pop: 41.8, poor: 9.3, tpt: 4.2, pdrb: 76, x: 394, y: 459 },
  { name: "Banten", pop: 12.4, poor: 5.4, tpt: 6.8, pdrb: 78, x: 264, y: 427 },
  { name: "Bali", pop: 4.4, poor: 3.4, tpt: 2.1, pdrb: 70, x: 444, y: 485 },
  { name: "Nusa Tenggara Barat", pop: 5.6, poor: 12.8, tpt: 3.2, pdrb: 34, x: 488, y: 493 },
  { name: "Nusa Tenggara Timur", pop: 5.7, poor: 18.4, tpt: 3.0, pdrb: 30, x: 562, y: 516 },
  { name: "Kalimantan Barat", pop: 5.9, poor: 6.4, tpt: 4.4, pdrb: 56, x: 326, y: 242 },
  { name: "Kalimantan Tengah", pop: 2.8, poor: 5.0, tpt: 3.7, pdrb: 74, x: 418, y: 306 },
  { name: "Kalimantan Selatan", pop: 4.3, poor: 4.0, tpt: 4.2, pdrb: 62, x: 448, y: 340 },
  { name: "Kalimantan Timur", pop: 4.0, poor: 5.3, tpt: 5.0, pdrb: 289, x: 490, y: 228 },
  { name: "Kalimantan Utara", pop: 0.7, poor: 6.5, tpt: 4.0, pdrb: 178, x: 478, y: 147 },
  { name: "Sulawesi Utara", pop: 2.7, poor: 6.8, tpt: 5.8, pdrb: 62, x: 636, y: 199 },
  { name: "Sulawesi Tengah", pop: 3.2, poor: 11.5, tpt: 3.3, pdrb: 108, x: 578, y: 283 },
  { name: "Sulawesi Selatan", pop: 9.5, poor: 7.9, tpt: 4.8, pdrb: 62, x: 546, y: 349 },
  { name: "Sulawesi Tenggara", pop: 2.8, poor: 10.4, tpt: 3.9, pdrb: 78, x: 590, y: 355 },
  { name: "Gorontalo", pop: 1.3, poor: 13.9, tpt: 4.2, pdrb: 42, x: 602, y: 228 },
  { name: "Sulawesi Barat", pop: 1.6, poor: 10.6, tpt: 3.0, pdrb: 48, x: 522, y: 320 },
  { name: "Maluku", pop: 2.0, poor: 15.4, tpt: 6.1, pdrb: 34, x: 704, y: 349 },
  { name: "Maluku Utara", pop: 1.4, poor: 5.9, tpt: 4.4, pdrb: 62, x: 696, y: 219 },
  { name: "Papua Barat", pop: 0.6, poor: 19.1, tpt: 5.1, pdrb: 118, x: 786, y: 260 },
  { name: "Papua Barat Daya", pop: 0.6, poor: 17.9, tpt: 5.8, pdrb: 96, x: 766, y: 257 },
  { name: "Papua", pop: 1.2, poor: 18.9, tpt: 4.0, pdrb: 76, x: 954, y: 315 },
  { name: "Papua Selatan", pop: 0.5, poor: 18.2, tpt: 4.5, pdrb: 62, x: 948, y: 473 },
  { name: "Papua Tengah", pop: 1.4, poor: 29.4, tpt: 4.2, pdrb: 58, x: 850, y: 340 },
  { name: "Papua Pegunungan", pop: 1.5, poor: 32.3, tpt: 3.9, pdrb: 36, x: 918, y: 361 },
];

// Rilis terbaru, terbaru dulu.
export const RELEASES = [
  { date: "5 Agu 2026", title: "Kemiskinan Maret 2026 turun ke 8,07%", body: "Penduduk miskin 22,93 juta, berkurang sekitar 0,9 juta dari Maret 2025. Garis kemiskinan Rp 669.235 per kapita per bulan.", source: "BPS" },
  { date: "5 Nov 2025", title: "PDB kuartal III 2025 tumbuh 5,04%", body: "Pertumbuhan ditopang konsumsi rumah tangga dan investasi; lapangan usaha dengan pertumbuhan tertinggi adalah jasa lainnya.", source: "BPS" },
  { date: "5 Nov 2025", title: "Pengangguran Agustus 2025 sebesar 4,85%", body: "TPT turun dari 4,91% pada Agustus 2024; sekitar 7,46 juta orang menganggur.", source: "BPS, Sakernas" },
  { date: "25 Jul 2025", title: "Gini Maret 2025 sebesar 0,375", body: "Ketimpangan pengeluaran turun dari 0,379 (Maret 2024). Gini perkotaan 0,395; perdesaan 0,299.", source: "BPS" },
  { date: "25 Jul 2025", title: "Kemiskinan Maret 2025 sebesar 8,47%", body: "Penduduk miskin 23,85 juta. Kemiskinan tertinggi di Papua Tengah (29,4%); terendah di Bali (3,42%).", source: "BPS" },
  { date: "15 Jan 2026", title: "Inflasi 2025 sebesar 1,9%", body: "Inflasi tahun kalender 2025 tercatat 1,9% — terendah sejak 2022. Inflasi inti 2,4%.", source: "BPS" },
];

// Faktor pengali daya beli, dihitung dari inflasi tahunan.
// Dipakai kalkulator di halaman Harga: Rp 1.000.000 tahun 2020
// menjadi sekitar Rp 1.144.000 pada 2025 (kumulatif 14,4%).
export function cumulativeInflation(fromYear, toYear) {
  const inf = SERIES.inflation.values;
  const years = META.years;
  let factor = 1;
  for (let i = 0; i < years.length; i++) {
    if (years[i] > fromYear && years[i] <= toYear) factor *= 1 + inf[i] / 100;
  }
  return factor;
}
