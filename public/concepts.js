/* Makna geometri ALIN-6. Perhitungan contoh tetap berada pada scenes.js. */
(() => {
  const s = (heading, explain, formula, phase) => ({
    heading,
    explain,
    formula,
    phase,
    vectors: [],
  });
  globalThis.AlinConcepts = [{
    before: 4,
    concept: "metric",
    title: "Memahami Hasil Kali Dalam",
    intro:
      "",
    source: "Ilustrasi Euclides untuk ALIN-6 hlm. 3–5. bukan definisi ulang ruang vektor.",
    application:
      "Grafika 3D: hasil kali dalam arah cahaya dan normal permukaan menentukan kuat pencahayaan pada model Lambert.",
    steps: [
      s(
        "Misalkan terdapat vektor a",
        "Misalkan suatu benda berpindah 4 satuan ke kanan dan 3 satuan ke atas. Perpindahan itu kita tulis sebagai vektor a = (4,3).",
        "a = (4,3)",
        0,
      ),
      s(
        "Diberikan pula vektor b",
        "Diberikan pula vektor b = (2,0). Kita akan menghitung hasil kali dalam vektor a dan b.",
        "",
        1,
      ),
      s(
        "Apa yang sebenarnya dicari?",
        "Yang dicari adalah nilai skalar ⟨a,b⟩. Pada aturan Euclides, nilai ini dipengaruhi panjang kedua vektor dan sudutnya:\n• positif untuk sudut lancip\n• nol untuk tegak lurus\n• negatif untuk sudut tumpul.",
        "Vektor a dan b → nilai skalar ⟨a,b⟩",
        2,
      ),
      s(
        "Hitung tiap komponen vektor",
        "Kalikan setiap komponen vektor a dengan komponen vektor b yang bersesuaian, kemudian jumlahkan hasil perkaliannya.",
        "⟨a,b⟩ = a₁b₁ + a₂b₂\n= (4 × 2) + (3 × 0) = 8",
        3,
      ),
      s(
        "Hasil kali dalam kedua vektor adalah 8",
        "Hasilnya 8, bernilai positif karena sudut antara a dan b lancip. Besar nilai ini juga dipengaruhi panjang kedua vektor. 8 bukan panjang vektor maupun besar sudut.",
        "⟨a,b⟩ = a₁b₁ + a₂b₂\n= (4 × 2) + (3 × 0)\n= 8 + 0 = 8",
        4,
      ),
      s(
        "Dari hasil kali dalam menjadi RHD",
        "Secara umum, ruang vektor yang dilengkapi hasil kali dalam yang memenuhi empat aksioma disebut ruang hasil kali dalam. Aksiomanya dibahas setelah ini.",
        "Dari aturan yang sama ditentukan norm dan ortogonalitas.",
        5,
      ),
    ],
  }, {
    before: 4,
    concept: "metric-negative",
    title: "Hasil Kali Dalam Sudut Tumpul",
    intro: "Diberikan vektor b = (2,0) dan vektor a = (−4,3).",
    steps: [
      s("Ubah arah gerak a", "Ambil a = (−4,3): 4 satuan ke kiri dan 3 satuan ke atas. Vektor b tetap (2,0).", "a = (−4,3). b = (2,0)", 1),
      s("Sudut kedua vektor kini tumpul", "Vektor a mengarah ke kiri atas, sedangkan b tetap ke kanan. Sudut di antara keduanya lebih dari 90°, sehingga hasil kali dalamnya akan negatif.", "Sudut tumpul → hasil kali dalam negatif", 2),
      s("Hitung dengan aturan yang sama", "Kalikan komponen yang bersesuaian, lalu jumlahkan.", "⟨a,b⟩ = (−4) × 2 + 3 × 0 = −8", 3),
      s("Bandingkan kedua arah gerak", "Kuadran I tadi memberi 8. Kuadran II ini memberi −8. Vektor b tetap sama. Yang berubah adalah arah komponen mendatar a.", "⟨(4,3),(2,0)⟩ = 8\n⟨(−4,3),(2,0)⟩ = −8", 4),
    ],
  }, {
    before: 12,
    concept: "orthogonal",
    title: "Ortogonal dan Ortonormal",
    intro:
      "Himpunan ortogonal berisi vektor yang saling tegak lurus. Himpunan ortonormal juga mensyaratkan norm setiap vektor sama dengan satu.",
    source: "ALIN-6 hlm. 10–13 • ilustrasi dengan hasil kali dalam Euclides",
    steps: [
      s(
        "Periksa sudut antarvektor",
        "Dua panah ini belum tegak lurus. Karena itu, pasangan ini belum membentuk himpunan ortogonal.",
        "Dalam RHD: ortogonal berarti hasil kali dalamnya nol.",
        0,
      ),
      s(
        "Ortogonal tidak harus panjang satu",
        "Sekarang kedua panah tegak lurus. Norm masing-masing masih dua. Jadi, pasangan ini ortogonal, tetapi BELUM ortonormal.",
        "Syarat ortogonal: setiap pasangan berbeda saling tegak lurus.",
        1,
      ),
      s(
        "Ortonormal: tegak lurus dan norm satu",
        "Sekarang bagi tiap vektor dengan normnya, yaitu dua. Kedua panah dipendekkan tanpa mengubah arah. Setelah norm masing-masing menjadi satu, pasangan ini disebut ortonormal.",
        "Norm 1 ditunjukkan oleh lingkaran satuan.",
        2,
      ),
      s(
        "Mengapa basis ortonormal berguna?",
        "Vektor a dapat dipisahkan menurut dua arah basis. Karena basisnya ortonormal, koefisien pada setiap arah diperoleh langsung dari hasil kali dalam. Contoh perhitungannya dibahas setelah ini.",
        "Komponen pada arah pertama + komponen pada arah kedua = a.",
        3,
      ),
    ],
  }];
  const colored = (text, color) => ({ text, color });
  const red = text => colored(text, "#c53243"), blue = text => colored(text, "#1f4bff"), green = text => colored(text, "#15804a");
  const positive = globalThis.AlinConcepts[0], negative = globalThis.AlinConcepts[1];
  positive.steps[1].formulaParts = [blue("b = (2,0)")];
  positive.steps[3].note = "Notasi ⟨a,b⟩ dibaca hasil kali dalam vektor a dan vektor b.";
  positive.steps[0].formulaParts = [red("a = (4,3)")];
  positive.steps[3].formulaParts = ["⟨", red("a"), ",", blue("b"), "⟩ = ", red("a₁"), blue("b₁"), " + ", red("a₂"), blue("b₂"), "\n= (", red("4"), " × ", blue("2"), ") + (", red("3"), " × ", blue("0"), ")\n= 8 + 0 = 8"];
  positive.steps[4].formulaParts = positive.steps[3].formulaParts;
  negative.steps[0].formulaParts = [red("a = (−4,3)"), ". ", blue("b = (2,0)")];
  negative.steps[2].formulaParts = ["⟨", red("a"), ",", blue("b"), "⟩ = ", red("a₁"), blue("b₁"), " + ", red("a₂"), blue("b₂"), "\n= (", red("−4"), " × ", blue("2"), ") + (", red("3"), " × ", blue("0"), ")\n= −8 + 0 = −8"];
  negative.steps[3].formulaParts = ["⟨", red("(4,3)"), ",", blue("(2,0)"), "⟩ = 8\n⟨", red("(−4,3)"), ",", blue("(2,0)"), "⟩ = −8"];
  positive.steps.splice(4, 2);
  negative.steps.splice(0, 2);
  globalThis.drawAlinConcept = (svg, c, state) => {
    svg.replaceChildren();
    const ns = "http://www.w3.org/2000/svg", blue = "#1f4bff", ink = "#25334c", grey = "#8694ab";
    const n = (tag, a, t) => {
      const e = document.createElementNS(ns, tag);
      Object.entries(a).forEach(([k, v]) => e.setAttribute(k, v));
      if (t !== undefined) e.textContent = t;
      svg.append(e);
      return e;
    };
    const text = (x, y, t, size = 21, color = ink) =>
      n("text", { x, y, style: `font-size:${size}px;fill:${color};font-weight:600` }, t);
    const line = (a, b, color = grey, w = 2, dash = "") =>
      n("line", {
        x1: a[0],
        y1: a[1],
        x2: b[0],
        y2: b[1],
        stroke: color,
        "stroke-width": w,
        "stroke-dasharray": dash,
      });
    const arrow = (a, b, label = "", color = blue) => {
      line(a, b, color, 4);
      const t = Math.atan2(b[1] - a[1], b[0] - a[0]);
      n("path", {
        d: `M${b[0] - 12 * Math.cos(t - .4)},${b[1] - 12 * Math.sin(t - .4)} L${b} L${
          b[0] - 12 * Math.cos(t + .4)
        },${b[1] - 12 * Math.sin(t + .4)}`,
        fill: "none",
        stroke: color,
        "stroke-width": 4,
      });
      if (label) text(b[0] + 12, b[1] - 12, label, 22, color);
    };
    const clamp = (x) => Math.min(1, Math.max(0, x)), p = state.phase || 0, O = [330, 260];
    const ellipse = (rx, ry, opacity = 1, dash = "") =>
      n("ellipse", {
        cx: O[0],
        cy: O[1],
        rx,
        ry,
        fill: "#1f4bff",
        "fill-opacity": .035 * opacity,
        stroke: blue,
        "stroke-opacity": opacity,
        "stroke-width": 3,
        "stroke-dasharray": dash,
      });
    const axes = () => {
      for (let x = 90; x <= 650; x += 80) line([x, 70], [x, 405], "#e2e8f4", 1);
      for (let y = 100; y <= 405; y += 80) line([70, y], [690, y], "#e2e8f4", 1);
      line([70, 260], [690, 260]);
      line([330, 65], [330, 405]);
      text(690, 285, "x", 16);
      text(343, 75, "y", 16);
      text(310, 281, "0", 16);
    };
    const square = (x, y) =>
      n("path", { d: `M${x + 16},${y} v-16 h-16`, stroke: ink, "stroke-width": 2, fill: "none" });
    if (c.concept.startsWith("metric")) {
      const negative = c.concept === "metric-negative";
      const base = [negative ? 420 : 160, 335], A = [negative ? 140 : 440, 125];
      text(
        30,
        35,
        [
          "Satu vektor: a",
          "Dua vektor: a dan b",
          negative ? "Sudut tumpul antara a dan b" : "Hubungan arah dua vektor",
          "Perkalian komponen yang bersesuaian",
          negative ? "Hasil kali dalam: −8" : "Hasil kali dalam: 8",
          "Ruang + hasil kali dalam yang memenuhi aksioma",
        ][Math.floor(p + 0.00001)],
        23,
      );
      line([80, 335], [680, 335]);
      line([base[0], 85], [base[0], 400], "#cad3e3", 1.5);
      text(base[0] - 17, 365, "0", 16, grey);
      text(690, 340, "x", 16, grey);
      text(base[0] + 8, 90, "y", 16, grey);
      arrow(base, A, negative ? "a = (−4,3)" : "a = (4,3)", "#c53243");
      if (p > 0) arrow(base, [base[0] + 140 * clamp(p), 335], "b = (2,0)", blue);
      if (p >= 1) text(base[0] + 65, 315, "2", 23, blue);
      if (p >= 3) {
        text(negative ? 440 : 500, 185, negative ? "(−4) × 2" : "4 × 2", 27, "#15804a");
        text(negative ? 440 : 500, 225, "+ 3 × 0", 27, ink);
        text(negative ? 440 : 500, 265, negative ? "= −8" : "= 8", 29, ink);
      }
    } else {
      axes();
      const a = (45 + 45 * clamp(p)) * Math.PI / 180,
        len = 160 - 80 * clamp(p - 1),
        end = [330 + len * Math.cos(a), 260 - len * Math.sin(a)];
      text(
        30,
        35,
        [
          "Belum ortogonal",
          "Ortogonal",
          "Ortonormal",
          "Komponen pada basis ortonormal",
        ][Math.floor(p + 0.00001)],
        25,
      );
      if (p >= 1) ellipse(80, 80, clamp(p - 1), "5 5");
      arrow(
        O,
        [330 + len, 260],
        p >= 2 ? "w₁ (1,0)" : `u (${Number((len / 80).toFixed(2))},0)`,
        "#c53243",
      );
      arrow(
        O,
        end,
        p >= 2
          ? "w₂ (0,1)"
          : `v (${Number((len * Math.cos(a) / 80).toFixed(2))},${
            Number((len * Math.sin(a) / 80).toFixed(2))
          })`,
      );
      if (p >= 1) square(...O);
      if (p > 2) {
        const t = clamp(p - 2), T = [330 + 160 * t, 260 - 80 * t];
        line([490, 260], T, grey, 3, "6 5");
        line([330, 180], T, grey, 2, "6 5");
        arrow(O, T, "a (2,1)");
        text(415, 308, "2w₁", 22, ink);
        text(505, 225, "w₂", 22, blue);
      }
      text(
        35,
        445,
        p < 2
          ? "Tegak lurus ditentukan oleh hasil kali dalam."
          : "Setiap vektor basis mempunyai norm satu.",
        21,
      );
    }
  };
})();
