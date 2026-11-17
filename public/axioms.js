(() => {
  const V = (id, to, label = id, kind = 0, from = [0, 0, 0]) => ({ id, to, label, kind, from });
  const S = (heading, explain, formula, vectors, extra = {}) => ({
    heading,
    explain,
    formula,
    vectors,
    ...extra,
  });
  const C = (text, color) => ({ text, color });
  const R = text => C(text, "#c53243"), B = text => C(text, "#1f4bff"),
    G = text => C(text, "#15804a"), W = text => C(text, "#8650b6");
  globalThis.AlinAxioms = (c) => {
    c[5] = {
      title: "Empat Aksioma Hasil Kali Dalam",
      intro:
        "Operasi hasil kali dalam harus memenuhi simetris, aditivitas, homogenitas, dan positivitas.",
      zoom: 85,
      steps: [
        S(
          "Simetris: urutan ditukar",
          "Panah u dan v tetap. Menukar urutan kedua masukan tidak mengubah hasil kali dalam.",
          "⟨u,v⟩ = 2×1 + 1×3 = 5",
          [V("u", [2, 1, 0]), V("v", [1, 3, 0])],
          { measure: 5 },
        ),
        S(
          "Hasil pertukaran tetap sama",
          "Sekarang masukan pertama adalah v dan masukan kedua u. Kontribusi komponen tetap menghasilkan nilai yang sama.",
          "⟨v,u⟩ = 1×2 + 3×1 = 5",
          [V("v", [1, 3, 0]), V("u", [2, 1, 0])],
          { measure: 5 },
        ),
        S(
          "Aditivitas: jumlah dapat dipisahkan",
          "Gunakan u=(2,0), v=(0,1), dan w=(1,2). Panah hijau u+v diperoleh dengan menyambung kedua panah.",
          "u + v = (2,0) + (0,1) = (2,1)\n⟨u+v,w⟩ = ⟨(2,1),(1,2)⟩\n= 2×1 + 1×2 = 4",
          [
            V("u", [2, 0, 0]),
            V("v", [2, 1, 0], "v", 0, [2, 0, 0]),
            V("sum", [2, 1, 0], "u+v", 2),
            V("w", [1, 2, 0]),
          ],
          { measure: 4 },
        ),
        S(
          "Dihitung terpisah, hasilnya juga 4",
          "Hitung hasil kali masing-masing vektor dengan w, lalu jumlahkan. Inilah arti aditivitas.",
          "⟨u,w⟩ + ⟨v,w⟩\n= ⟨(2,0),(1,2)⟩ + ⟨(0,1),(1,2)⟩\n= (2×1 + 0×2) + (0×1 + 1×2)\n= 2 + 2 = 4",
          [V("u", [2, 0, 0]), V("v", [0, 1, 0]), V("w", [1, 2, 0])],
          { measure: 4 },
        ),
        S(
          "Homogenitas: pengaruh faktor skalar",
          "Ambil u=(1,1), v=(1,0), dan k=3. Panah u diperpanjang tiga kali. Hasil kali dalamnya juga menjadi tiga kali.",
          "⟨3u,v⟩ = 3 = 3⟨u,v⟩",
          [V("u", [3, 3, 0], "3u"), V("v", [1, 0, 0])],
          { measure: 3 },
        ),
        S(
          "Positivitas: kalikan dengan dirinya",
          "Untuk u=(2,1), hasil kali u dengan dirinya adalah 5, yaitu kuadrat norm u. Vektor bukan nol harus memberi hasil positif.",
          "⟨u,u⟩ = 2² + 1² = 5 > 0",
          [V("u", [2, 1, 0])],
          { measure: 5 },
        ),
        S(
          "Hanya vektor nol yang menghasilkan nol",
          "Ketika u menjadi (0,0), panah menyusut menjadi titik asal. Inilah satu-satunya vektor yang boleh menghasilkan ⟨u,u⟩=0.",
          "⟨0,0⟩ = 0",
          [V("u", [0, 0, 0], "u")],
          { measure: 0 },
        ),
      ],
    };
    c[9] = {
      title: "Contoh 3: Hasil Negatif",
      intro: "Periksa operasi ⟨u,v⟩ = u₁v₁ + 2u₂v₂ − 3u₃v₃.",
      dimension: 3,
      zoom: 125,
      steps: [
        S(
          "Pilih satu vektor bukan nol",
          "Ambil u=(1,0,2). Panah ini jelas berbeda dari titik asal.",
          "u = (1,0,2)",
          [V("u", [1, 0, 2])],
        ),
        S(
          "Kalikan u dengan dirinya",
          "Komponen pertama menyumbang 1. Komponen kedua nol. Komponen ketiga menyumbang −12 karena bobotnya negatif.",
          "⟨u,u⟩ = 1² + 2(0²) − 3(2²)",
          [V("u", [1, 0, 2])],
        ),
        S(
          "Nilainya −11, bukan kuadrat panjang",
          "Hasil negatif tidak dapat menjadi kuadrat norm real. Positivitas gagal; satu contoh penyangkal cukup untuk menolak operasi ini.",
          "⟨u,u⟩ = 1 + 0 − 12 = −11",
          [V("u", [1, 0, 2])],
          { measure: -11 },
        ),
      ],
    };
    c[10] = {
      title: "Contoh 4: Vektor Tak Nol, Hasilnya Nol",
      intro: "Untuk u=(a,b,c) dan v=(d,e,f), diberikan operasi ⟨u,v⟩=ad+cf.",
      dimension: 3,
      zoom: 120,
      steps: [
        S(
          "Operasi ini melewatkan komponen kedua",
          "Hasil kali dengan diri sendiri menjadi a²+c². Nilai b sama sekali tidak ikut dihitung.",
          "⟨u,u⟩ = a² + c²",
          [V("u", [1, 2, 1], "u")],
        ),
        S(
          "Pilih u=(0,2,0)",
          "Vektor u hanya mempunyai komponen kedua. Panahnya bukan nol, tetapi operasi tadi tidak menghitung arah ini.",
          "u ≠ 0; a=0, b=2, c=0",
          [V("u", [0, 2, 0], "u")],
        ),
        S(
          "Perhitungan memberi nol",
          "Kedua komponen yang dihitung bernilai nol. Hasil nol ini tidak sesuai dengan syarat bahwa hanya vektor nol yang boleh menghasilkan nol.",
          "⟨u,u⟩ = 0² + 0² = 0",
          [V("u", [0, 2, 0], "u")],
          { measure: 0 },
        ),
        S(
          "Positivitas harus lengkap",
          "Tidak cukup hanya mensyaratkan hasil nonnegatif. Syarat “nol hanya untuk vektor nol” juga harus dipenuhi.",
          "Operasi ad+cf bukan hasil kali dalam.",
          [V("u", [0, 2, 0], "u")],
          { measure: 0 },
        ),
      ],
    };
    const u = V("u", [1, 1, 0]), v = V("v", [2, 0, 1]), w = V("w", [0, 1, 1]);
    c[8] = {
      title: "Contoh 2: Hasil Kali Dalam Berbobot",
      intro:
        "⟨u,v⟩ = 2u₁v₁ + u₂v₂ + 3u₃v₃. Subskrip menunjukkan komponen: u₂ adalah komponen kedua vektor u.",
      dimension: 3,
      zoom: 115,
      steps: [
        S(
          "Kenali u dan v",
          "Untuk membaca gambar, gunakan u=(1,1,0) dan v=(2,0,1). Bobot 2,1,3 berlaku pada komponen pertama, kedua, dan ketiga.",
          "⟨u,v⟩ = 2(1)(2) + (1)(0) + 3(0)(1) = 4",
          [u, v],
          { measure: 4 },
        ),
        S(
          "Simetris",
          "Untuk vektor sembarang, tiap perkalian komponen dapat ditukar urutannya. Contoh pada gambar juga memberi 4 setelah u dan v ditukar.",
          "2u₁v₁+u₂v₂+3u₃v₃\n= 2v₁u₁+v₂u₂+3v₃u₃",
          [v, u],
          { measure: 4 },
        ),
        S(
          "Aditivitas",
          "Buka tanda kurung pada setiap komponen u+v. Suku yang memuat u dan yang memuat v dapat dikelompokkan. Pada gambar, w=(0,1,1).",
          "⟨u+v,w⟩ = ⟨u,w⟩ + ⟨v,w⟩\nContoh: 4 = 1 + 3",
          [u, v, w, V("sum", [3, 1, 1], "u+v", 2)],
          { measure: 4 },
        ),
        S(
          "Homogenitas",
          "Faktor k mengalikan setiap komponen u, sehingga dapat dikeluarkan dari seluruh penjumlahan. Gambar memperlihatkan k=2.",
          "⟨ku,v⟩ = k⟨u,v⟩\nContoh: ⟨2u,v⟩ = 8 = 2×4",
          [V("u", [2, 2, 0], "2u"), v],
          { measure: 8 },
        ),
        S(
          "Positivitas",
          "Bobot 2,1,3 semuanya positif. Jumlah kuadrat berbobot tidak negatif dan hanya nol bila ketiga komponen u nol.",
          "⟨u,u⟩ = 2u₁²+u₂²+3u₃² ≥ 0",
          [u],
          { measure: 3 },
        ),
        S(
          "Norm mengikuti aturan berbobot",
          "Keempat aksioma terpenuhi. Permukaan norm satu adalah elipsoid; panah menunjukkan tiga ujung vektor yang masing-masing bernorm satu.",
          "‖u‖ = √(2u₁²+u₂²+3u₃²)",
          [V("x", [1 / Math.sqrt(2), 0, 0]), V("y", [0, 1, 0]), V("z", [0, 0, 1 / Math.sqrt(3)])],
          { ellipsoid: [1 / Math.sqrt(2), 1, 1 / Math.sqrt(3)] },
        ),
      ],
    };
    const ax = c[5].steps;
    ax[0].formulaParts = [R("⟨u"), ",", B("v"), "⟩ = ⟨", R("(2,1)"), ",", B("(1,3)"), "⟩\n= ", R("2"), "×", B("1"), " + ", R("1"), "×", B("3"), " = 5"];
    ax[1].formulaParts = ["⟨", B("v"), ",", R("u"), "⟩ = ⟨", B("(1,3)"), ",", R("(2,1)"), "⟩\n= ", B("1"), "×", R("2"), " + ", B("3"), "×", R("1"), " = 5"];
    ax[2].formulaParts = [R("u"), " + ", B("v"), " = ", R("(2,0)"), " + ", B("(0,1)"), " = ", G("(2,1)"), "\n⟨", G("u+v"), ",", W("w"), "⟩ = ⟨", G("(2,1)"), ",", W("(1,2)"), "⟩\n= ", G("2"), "×", W("1"), " + ", G("1"), "×", W("2"), " = 4"];
    ax[3].formulaParts = ["⟨", R("u"), ",", W("w"), "⟩ + ⟨", B("v"), ",", W("w"), "⟩\n= ⟨", R("(2,0)"), ",", W("(1,2)"), "⟩ + ⟨", B("(0,1)"), ",", W("(1,2)"), "⟩\n= (", R("2"), "×", W("1"), " + ", R("0"), "×", W("2"), ") + (", B("0"), "×", W("1"), " + ", B("1"), "×", W("2"), ")\n= 2 + 2 = 4"];
    ax[4].formulaParts = ["⟨3", R("u"), ",", B("v"), "⟩ = ⟨", R("(3,3)"), ",", B("(1,0)"), "⟩\n= ", R("3"), "×", B("1"), " + ", R("3"), "×", B("0"), " = 3\n= 3⟨", R("u"), ",", B("v"), "⟩"];
    ax[5].formulaParts = ["⟨", R("u,u"), "⟩ = ", R("2"), "² + ", R("1"), "² = 5 > 0"];
    c[8].steps[0].formulaParts = ["⟨", R("u"), ",", B("v"), "⟩ = 2(", R("1"), ")(", B("2"), ") + (", R("1"), ")(", B("0"), ") + 3(", R("0"), ")(", B("1"), ") = 4"];
    c[7].intro = "Pada Rⁿ, hasil kali dalam Euclides adalah dot product: jumlah hasil kali komponen yang bersesuaian. Yang dicari adalah nilai ⟨u,v⟩, bukan vektor baru.";
    c[7].steps.unshift({
      ...c[7].steps[0], heading: "Apa yang dimaksud Euclides?",
      explain: "Ruang Euclides Rⁿ memakai koordinat biasa. Untuk dua vektor, aturan hasil kali dalamnya adalah dot product; aturan ini menentukan panjang dan sudut yang biasa digunakan.",
      formula: "⟨u,v⟩ = u₁v₁ + u₂v₂ + ⋯ + uₙvₙ",
    });
    for (const step of c[7].steps) {
      if (step.formula === "u₁v₁ = 3 × 1 = 3") step.formulaParts = [R("u₁"), B("v₁"), " = ", R("3"), " × ", B("1"), " = 3"];
      if (step.formula.startsWith("u₂v₂ =")) step.formulaParts = [R("u₂"), B("v₂"), " = ", R("1"), " × ", B("2"), " = 2\n⟨", R("u"), ",", B("v"), "⟩ = 3 + 2 = 5"];
      if (step.formula.includes("3² + 1²")) step.formulaParts = ["⟨", R("u,u"), "⟩ = ", R("3"), "² + ", R("1"), "² = 10 ≥ 0"];
    }
  };
})();
