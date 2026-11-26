// NusaStat — pembuat grafik SVG tanpa library.
// Semua grafik digambar sebagai elemen SVG murni: garis, batang,
// lingkaran (donat), dan garis mini (sparkline). Tidak ada dependensi.

function niceTicks(min, max, count) {
  const span = max - min || 1;
  const stepRaw = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(stepRaw)));
  const norm = stepRaw / mag;
  const step = (norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10) * mag;
  const start = Math.ceil(min / step) * step;
  const ticks = [];
  for (let v = start; v <= max + 1e-9; v += step) ticks.push(v);
  return { ticks, step };
}

function fmtNum(v, decimals) {
  return v.toLocaleString("id-ID", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function fmtShort(v) {
  if (Math.abs(v) >= 1000) return fmtNum(v, 0);
  if (Math.abs(v) >= 100) return fmtNum(v, 0);
  if (Number.isInteger(v)) return fmtNum(v, 0);
  return fmtNum(v, 1);
}

// Grafik garis dengan titik, label sumbu, dan garis nol bila relevan.
export function lineChart({ years, values, width = 640, height = 260, color = "#0e6b5c", unit = "", decimals = 1, title = "" }) {
  const padL = 44, padR = 12, padT = title ? 26 : 10, padB = 26;
  const w = width - padL - padR, h = height - padT - padB;
  let min = Math.min(...values), max = Math.max(...values);
  if (min > 0) min = Math.min(0, min - (max - min) * 0.15);
  if (max < 0) max = 0;
  const pad = (max - min) * 0.08 || 1;
  min -= pad; max += pad;
  const X = (i) => padL + (i / (years.length - 1)) * w;
  const Y = (v) => padT + (1 - (v - min) / (max - min)) * h;
  const { ticks } = niceTicks(min, max, 4);
  let s = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${title || "Grafik garis"}" class="chart">`;
  if (title) s += `<text x="${padL}" y="16" class="chart-title">${title}</text>`;
  for (const t of ticks) {
    const y = Y(t);
    s += `<line x1="${padL}" y1="${y}" x2="${width - padR}" y2="${y}" class="grid"/>`;
    s += `<text x="${padL - 6}" y="${y + 4}" text-anchor="end" class="tick">${fmtNum(t, decimals)}</text>`;
  }
  if (min < 0 && max > 0) {
    s += `<line x1="${padL}" y1="${Y(0)}" x2="${width - padR}" y2="${Y(0)}" class="zero"/>`;
  }
  const pts = values.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(" ");
  s += `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
  values.forEach((v, i) => {
    s += `<circle cx="${X(i)}" cy="${Y(v)}" r="3.5" fill="${color}" stroke="#fffdf6" stroke-width="1.5"/>`;
    // Label nilai titik pertama/terakhir digeser ke dalam supaya tidak
    // menabrak label sumbu-y di tepi kiri/kanan.
    const anchor = i === 0 ? "start" : i === values.length - 1 ? "end" : "middle";
    const lx = i === 0 ? X(i) + 8 : i === values.length - 1 ? X(i) - 8 : X(i);
    s += `<text x="${lx.toFixed(1)}" y="${Y(v) - 9}" text-anchor="${anchor}" class="vlabel">${fmtNum(v, decimals)}</text>`;
    s += `<text x="${X(i)}" y="${height - 8}" text-anchor="middle" class="tick">${years[i]}</text>`;
  });
  if (unit) s += `<text x="${width - padR}" y="16" text-anchor="end" class="chart-unit">${unit}</text>`;
  return s + "</svg>";
}

// Grafik batang tegak.
export function barChart({ years, values, width = 640, height = 260, color = "#0e6b5c", unit = "", decimals = 1, title = "" }) {
  const padL = 44, padR = 12, padT = title ? 26 : 10, padB = 26;
  const w = width - padL - padR, h = height - padT - padB;
  let min = Math.min(0, ...values), max = Math.max(...values);
  const pad = (max - min) * 0.08 || 1;
  max += pad;
  const slot = w / years.length;
  const bw = Math.min(46, slot * 0.62);
  const X = (i) => padL + i * slot + slot / 2;
  const Y = (v) => padT + (1 - (v - min) / (max - min)) * h;
  const { ticks } = niceTicks(min, max, 4);
  let s = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${title || "Grafik batang"}" class="chart">`;
  if (title) s += `<text x="${padL}" y="16" class="chart-title">${title}</text>`;
  for (const t of ticks) {
    const y = Y(t);
    s += `<line x1="${padL}" y1="${y}" x2="${width - padR}" y2="${y}" class="grid"/>`;
    s += `<text x="${padL - 6}" y="${y + 4}" text-anchor="end" class="tick">${fmtNum(t, decimals)}</text>`;
  }
  values.forEach((v, i) => {
    const y0 = Y(Math.max(v, 0)), y1 = Y(Math.min(v, 0));
    const fill = v < 0 ? "#b3402e" : color;
    s += `<rect x="${(X(i) - bw / 2).toFixed(1)}" y="${Math.min(y0, y1).toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.abs(y1 - y0).toFixed(1)}" rx="3" fill="${fill}"/>`;
    s += `<text x="${X(i)}" y="${(Math.min(y0, y1) - 6).toFixed(1)}" text-anchor="middle" class="vlabel">${fmtNum(v, decimals)}</text>`;
    s += `<text x="${X(i)}" y="${height - 8}" text-anchor="middle" class="tick">${years[i]}</text>`;
  });
  if (unit) s += `<text x="${width - padR}" y="16" text-anchor="end" class="chart-unit">${unit}</text>`;
  return s + "</svg>";
}

// Donat: irisan + legenda di bawah.
export function donutChart({ items, width = 640, height = 300, title = "" }) {
  const cx = 120, cy = height / 2, r = 78, inner = 48;
  const total = items.reduce((a, b) => a + b.value, 0);
  const palette = ["#0e6b5c", "#d99a26", "#7a4a21", "#4a7a96", "#8a9a3b", "#b3402e", "#5b4a8a", "#2e6b4f", "#a86a1e", "#466b7a", "#94843a"];
  let s = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${title || "Diagram donat"}" class="chart">`;
  if (title) s += `<text x="12" y="18" class="chart-title">${title}</text>`;
  let angle = -Math.PI / 2;
  items.forEach((it, i) => {
    const frac = it.value / total;
    const a0 = angle, a1 = angle + frac * Math.PI * 2;
    angle = a1;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1), yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0), yi0 = cy + inner * Math.sin(a0);
    const col = palette[i % palette.length];
    s += `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" fill="${col}"/>`;
  });
  s += `<text x="${cx}" y="${cy - 2}" text-anchor="middle" class="donut-big">${fmtNum(total, 1)}%</text>`;
  s += `<text x="${cx}" y="${cy + 16}" text-anchor="middle" class="tick">total</text>`;
  const lx = 230;
  items.forEach((it, i) => {
    const y = 34 + i * 24;
    const col = palette[i % palette.length];
    s += `<rect x="${lx}" y="${y - 10}" width="12" height="12" rx="2" fill="${col}"/>`;
    s += `<text x="${lx + 20}" y="${y}" class="legend">${it.name} — ${fmtNum(it.value, 1)}%</text>`;
  });
  return s + "</svg>";
}

// Sparkline kecil untuk kartu KPI.
export function sparkline(values, width = 120, height = 34, color = "#0e6b5c") {
  const min = Math.min(...values), max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => `${((i / (values.length - 1)) * (width - 4) + 2).toFixed(1)},${(height - 4 - ((v - min) / span) * (height - 8)).toFixed(1)}`).join(" ");
  return `<svg viewBox="0 0 ${width} ${height}" class="spark" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
}

// Batang horizontal berlabel, untuk daftar provinsi.
export function hbarChart({ items, width = 640, height = 420, unit = "", valueFmt = (v) => fmtNum(v, 1), title = "" }) {
  const padL = 168, padR = 64, padT = title ? 28 : 8, rowH = (height - padT - 8) / items.length;
  const max = Math.max(...items.map((d) => d.value));
  let s = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${title || "Batang horizontal"}" class="chart">`;
  if (title) s += `<text x="12" y="18" class="chart-title">${title}</text>`;
  items.forEach((d, i) => {
    const y = padT + i * rowH;
    const bw = ((width - padL - padR) * d.value) / max;
    s += `<text x="${padL - 8}" y="${y + rowH / 2 + 4}" text-anchor="end" class="hbar-label">${d.name}</text>`;
    s += `<rect x="${padL}" y="${y + rowH * 0.18}" width="${Math.max(2, bw).toFixed(1)}" height="${(rowH * 0.64).toFixed(1)}" rx="3" fill="${d.color || "#0e6b5c"}"/>`;
    s += `<text x="${padL + Math.max(2, bw) + 6}" y="${y + rowH / 2 + 4}" class="vlabel">${valueFmt(d.value)}${unit}</text>`;
  });
  return s + "</svg>";
}
