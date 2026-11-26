# best-national-statistics-site-v2

NusaStat — Statistik Nusantara. Situs statistik nasional Indonesia yang berjalan
offline dari file statis: 24 indikator, seri 2019–2025 (kemiskinan Maret
2019–2026), 38 provinsi lengkap dengan peta skematik SVG, kalkulator daya beli,
banding dua provinsi, tabel sortable, dan unduh CSV. Vanilla JS + SVG hand-rolled,
tanpa library, tanpa network request.

![NusaStat](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)
[![Rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/muhammadaldy198/best-national-statistics-site-v2/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![Reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/muhammadaldy198/best-national-statistics-site-v2/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

Referral: `3p0axm2p`

## Menjalankan

```sh
node serve.ts
# buka http://localhost:8080
```

## Menyerahkan (build)

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` menyalin `app/` dan `screenshots/` ke direktori keluaran dan menulis
`dossier.json` dengan pustaka `vendor/makefun-frontend.ts` (salinan kit, tidak
diubah). Dua kali jalan menghasilkan byte yang sama persis.

## Isi

- `app/index.html` — kerangka situs (header, nav, pencarian, mode gelap)
- `app/data.js` — semua angka: seri nasional + 38 provinsi + 24 indikator
- `app/charts.js` — grafik SVG hand-rolled (garis, batang, donat, sparkline)
- `app/map.js` — peta skematik 38 provinsi + kartu detail provinsi
- `app/views.js` — 8 halaman (beranda, ekonomi, harga, penduduk, kemiskinan,
  tenaga kerja, provinsi, metodologi)
- `app/main.js` — rute hash, pencarian, kalkulator, banding, tabel, CSV
- `app/style.css` — desain: hijau mangrove + marigold di kertas hangat
- `screenshots/` — 4 render asli situs (desktop + HP)
- `main.ts`, `serve.ts`, `vendor/makefun-frontend.ts`, `LICENSE` (MIT)

## Sumber data

BPS (Berita Resmi Statistik, Susenas, Sakernas, PDRB), Kementerian Keuangan,
Kementerian Kesehatan (SSGI), dan Bank Dunia (Poverty and Inequality Platform).
Sumber dan tahun tercantum di setiap angka; halaman Metodologi menjelaskan
vintage Maret untuk kemiskinan, perbedaan Gini BPS vs Bank Dunia, dan
pembulatan angka provinsi.

## Lisensi

MIT — lihat `LICENSE`.
