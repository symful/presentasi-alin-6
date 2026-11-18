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
          "1. Simetris: urutan ditukar",
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
          "2. Aditivitas: jumlah dapat dipisahkan",
          "Misalkan u=(2,0), v=(0,1), dan w=(1,2).",
          "u + v = (2,0) + (0,1) = (2,1)\n⟨u+v,w⟩ = ⟨(2,1),(1,2)⟩\n= 2×1 + 1×2 = 4",
          [
            V("u", [2, 0, 0]),
            V("v", [0, 1, 0]),
            V("sum", [2, 1, 0], "u+v", 2),
            V("w", [1, 2, 0]),
          ],
          { measure: 4 },
        ),
        S(
          "Dihitung terpisah, hasilnya juga 4",
          "Hitung hasil kali masing-masing vektor dengan w.",
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
          "4. Positivitas: kalikan dengan dirinya sendiri",
          "Untuk u=(2,1), hasil kali u dengan dirinya sendiri adalah 5. Vektor bukan nol harus memberi hasil positif.",
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
          "Hasil negatif tidak dapat menjadi kuadrat norm real. Positivitas gagal. satu contoh penyangkal cukup untuk menolak operasi ini.",
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
          "u ≠ 0. a=0, b=2, c=0",
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
          "Keempat aksioma terpenuhi. Permukaan norm satu adalah elipsoid. panah menunjukkan tiga ujung vektor yang masing-masing bernorm satu.",
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
    const baseVectors = [V("u", [1,1,0]), V("v", [1,0,0])];
    ax[4].heading = "3. Homogenitas: pengaruh faktor skalar";
    ax[4].explain = "Vektor u berubah dari (1,1) menjadi (3,3), sedangkan v tetap. Hitung hasil kali dalam pasangan yang baru.";
    ax[4].formulaParts = ["3", R("u"), " = 3", R("(1,1)"), " = ", R("(3,3)"), "\n⟨3", R("u"), ",", B("v"), "⟩ = ", R("3"), "×", B("1"), " + ", R("3"), "×", B("0"), " = 3"];
    const scaledResult = S("3. Homogenitas: bandingkan hasilnya", "Untuk u=(1,1) dan v=(1,0), hasil kali dalamnya adalah 1. Jika hasil tersebut dikalikan 3, diperoleh 3, sama dengan hasil ketika vektor u dikalikan 3.", "3⟨u,v⟩ = 3×1 = 3\n⟨3u,v⟩ = 3⟨u,v⟩", baseVectors, { measure: 3 });
    scaledResult.formulaParts = ["3⟨", R("u"), ",", B("v"), "⟩ = 3[", R("1"), "×", B("1"), " + ", R("1"), "×", B("0"), "]\n= 3×1 = 3\n⟨3", R("u"), ",", B("v"), "⟩ = 3⟨", R("u"), ",", B("v"), "⟩ = 3"];
    ax.splice(5, 0, scaledResult);
    const failed = S("4. Contoh operasi yang gagal positivitas", "Misalkan u=(a,b,c) dan v=(d,e,f), diberikan operasi ⟨u,v⟩=ad+cf. Ambil u=(0,2,0). Vektor ini bukan nol, tetapi hasil kali dengan dirinya sendiri adalah nol.", "⟨u,v⟩ = ad + cf\n⟨u,u⟩ = a² + c²\n= 0² + 0² = 0, padahal u ≠ 0", [V("u", [0,2,0])], { measure: 0 });
    failed.formulaParts = ["⟨", R("u"), ",", B("v"), "⟩ = ", R("a"), B("d"), " + ", R("c"), B("f"), "\n⟨", R("u,u"), "⟩ = ", R("a"), "² + ", R("c"), "² ≥ 0\n", R("u = (0,2,0)"), " ≠ 0\n⟨", R("u,u"), "⟩ = ", R("0"), "² + ", R("0"), "² = 0\nAksioma positivitas tidak terpenuhi."];
    failed.vectors[0].coordinatesText = "0, 2, 0";
    ax.push(failed);
    const symbolic = (id, to, coords) => ({ ...V(id, to), coordinatesText: coords });
    const su = symbolic("u", [2,1,0], "u₁, u₂, …, uₙ"), sv = symbolic("v", [1,2,0], "v₁, v₂, …, vₙ");
    c[7] = {
      title: "Contoh Soal 1: Hasil Kali Dalam Euclides",
      intro: "Misalkan u, v ∈ Rⁿ. Pada Rⁿ, hasil kali dalam Euclides didefinisikan sebagai berikut.",
      zoom: 90,
      steps: [
        S("Dua vektor pada Rⁿ", "Setiap vektor mempunyai n komponen. Gambar mewakili pasangan vektor secara skematis. komponen pada soal tetap berupa simbol.", "u = (u₁,u₂,…,uₙ)\nv = (v₁,v₂,…,vₙ)", [su,sv]),
        S("Jumlah hasil kali komponen", "Kalikan komponen yang bersesuaian, kemudian jumlahkan semuanya. Inilah aturan pada Contoh 1 dosen.", "⟨u,v⟩ = u₁v₁ + u₂v₂ + ⋯ + uₙvₙ", [su,sv]),
        S("Norm pada ruang Euclides", "Hasil kali suatu vektor dengan dirinya merupakan jumlah kuadrat komponennya. Akar dari jumlah tersebut adalah norm.", "⟨u,u⟩ = u₁² + u₂² + ⋯ + uₙ²\n‖u‖ = √⟨u,u⟩ ≥ 0", [su]),
      ],
    };
    const U = symbolic("u", [1,1,0], "u₁, u₂, u₃"), VV = symbolic("v", [2,0,1], "v₁, v₂, v₃"), WW = symbolic("w", [0,1,1], "w₁, w₂, w₃");
    c[8] = {
      title: "Contoh Soal 2: Hasil Kali Dalam Berbobot",
      intro: "Misalnya W ⊆ R³ dilengkapi operasi ⟨u,v⟩ = 2u₁v₁ + u₂v₂ + 3u₃v₃, dengan u,v ∈ W. Buktikan bahwa W adalah ruang hasil kali dalam.",
      dimension: 3, zoom: 110,
      steps: [
        S("Diberikan operasi hasil kali", "Periksa empat aksioma untuk vektor sembarang u, v, w ∈ W dan skalar k ∈ R. Subskrip menyatakan komponen vektor.", "⟨u,v⟩ = 2u₁v₁ + u₂v₂ + 3u₃v₃", [U,VV]),
        S("Simetris", "Tukar urutan faktor pada setiap perkalian komponen.", "⟨u,v⟩ = 2u₁v₁ + u₂v₂ + 3u₃v₃\n= 2v₁u₁ + v₂u₂ + 3v₃u₃\n= ⟨v,u⟩", [U,VV]),
        S("Aditivitas: buka tanda kurung", "Terapkan operasi pada pasangan u+v dan w.", "⟨u+v,w⟩\n= 2(u₁+v₁)w₁ + (u₂+v₂)w₂ + 3(u₃+v₃)w₃\n= 2u₁w₁ + 2v₁w₁ + u₂w₂ + v₂w₂\n   + 3u₃w₃ + 3v₃w₃", [U,VV,WW]),
        S("Aditivitas: kelompokkan suku", "Kelompokkan suku yang memuat u dan suku yang memuat v.", "= (2u₁w₁ + u₂w₂ + 3u₃w₃)\n   + (2v₁w₁ + v₂w₂ + 3v₃w₃)\n= ⟨u,w⟩ + ⟨v,w⟩", [U,VV,WW]),
        S("Homogenitas", "Keluarkan faktor k dari seluruh penjumlahan.", "⟨ku,v⟩ = 2ku₁v₁ + ku₂v₂ + 3ku₃v₃\n= k(2u₁v₁ + u₂v₂ + 3u₃v₃)\n= k⟨u,v⟩", [symbolic("u", [2,2,0], "ku₁, ku₂, ku₃"),VV]),
        S("Positivitas", "Semua bobot positif. Jumlah kuadrat ini tidak negatif dan hanya nol jika seluruh komponen u nol.", "⟨u,u⟩ = 2u₁² + u₂² + 3u₃² ≥ 0\n⟨u,u⟩ = 0 ⇔ u₁=u₂=u₃=0 ⇔ u=0", [U]),
        S("Keempat aksioma terpenuhi", "Operasi yang diberikan merupakan hasil kali dalam. W, sebagai ruang vektor dengan operasi ini, merupakan ruang hasil kali dalam.", "Simetris · Aditivitas · Homogenitas · Positivitas", [U,VV]),
      ],
    };
    c[9] = {
      title: "Contoh Soal 3: Operasi yang Bukan Hasil Kali Dalam",
      intro: "Tunjukkan bahwa ⟨u,v⟩ = u₁v₁ + 2u₂v₂ − 3u₃v₃ bukan merupakan hasil kali dalam.",
      dimension: 3, zoom: 110,
      steps: [
        S("Kalikan u dengan dirinya", "Perhatikan bentuk hasil kali suatu vektor dengan dirinya.", "⟨u,u⟩ = u₁² + 2u₂² − 3u₃²", [U]),
        S("Suku negatif dapat lebih besar", "Jika 3u₃² lebih besar daripada u₁²+2u₂², hasilnya negatif. Ini melanggar positivitas.", "3u₃² > u₁² + 2u₂²\n⇒ ⟨u,u⟩ < 0", [U]),
        S("Operasi ditolak", "Hasil kali dalam harus memberikan ⟨u,u⟩ ≥ 0 untuk setiap u. Operasi ini tidak memenuhi syarat tersebut.", "Aksioma positivitas tidak terpenuhi.", [U]),
      ],
    };
    const rules = [
      ["1. Simetris: rumus umum", "Urutan kedua vektor dapat ditukar tanpa mengubah hasil.", "⟨u,v⟩ = ⟨v,u⟩", "1. Simetris: urutan ditukar"],
      ["2. Aditivitas: rumus umum", "Hasil kali dalam jumlah vektor dengan w sama dengan jumlah hasil kali dalam masing-masing vektor dengan w.", "⟨u+v,w⟩ = ⟨u,w⟩ + ⟨v,w⟩", "2. Aditivitas: jumlah dapat dipisahkan"],
      ["3. Homogenitas: rumus umum", "Untuk setiap skalar k ∈ R, faktor skalar dapat dikeluarkan dari hasil kali dalam.", "⟨ku,v⟩ = ⟨u,kv⟩ = k⟨u,v⟩", "3. Homogenitas: pengaruh faktor skalar"],
      ["4. Positivitas: rumus umum", "Hasil kali vektor dengan dirinya sendiri tidak negatif. Hasilnya nol tepat ketika vektornya nol.", "⟨u,u⟩ ≥ 0\n⟨u,u⟩ = 0 ⇔ u = 0", "4. Positivitas: kalikan dengan dirinya sendiri"],
    ];
    for (const [heading, explain, formula, before] of rules) {
      const index = c[5].steps.findIndex(step => step.heading === before);
      c[5].steps.splice(index, 0, S(heading, explain, formula, []));
    }
    c[5].intro = "Untuk setiap u, v, w ∈ V dan setiap skalar k ∈ R, hasil kali dalam memenuhi empat aksioma berikut.";
    c[8].steps.unshift(S("Asumsi ruang vektor", "Pada contoh ini, W dipahami sebagai ruang vektor bagian dari R³. Yang kita periksa adalah apakah operasi yang diberikan memenuhi aksioma hasil kali dalam.", "W merupakan ruang vektor bagian dari R³", []));
    c[10].title = "Contoh Soal 4: Vektor Tak Nol, Hasilnya Nol";
    c[10].steps[0].vectors = [symbolic("u", [1,2,1], "a, b, c")];
    c[13].title = "Contoh Soal 5: Ortogonal dan Ortonormal";
    c[15].title = "Contoh Soal 6: Kombinasi Linear";
    c[18].title = "Contoh Soal 7: Ortonormalisasi pada R³";
    c[19].title = "Contoh Soal 7: Langkah Ketiga";
    c[21].title = "Contoh Soal 8: Basis Ortonormal Bidang";
    c[22].title = "Contoh Soal 8 dan 9: Proyeksi Ortogonal";
  };
})();
