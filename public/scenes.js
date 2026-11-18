/* Diagram SVG berbasis koordinat: tidak ada video, CDN, atau hasil hitung palsu. */
(() => {
  const M = globalThis.AlinMath;
  const O = [0, 0, 0];
  const V = (id, to, label, kind = 0, from = O) => ({ id, to, from, label, kind });
  const S = (heading, explain, formula, vectors, extra = {}) => ({
    heading,
    explain,
    formula,
    vectors,
    ...extra,
  });
  const basis = [[1, 1, 1], [0, 1, 1], [0, 0, 1]];
  const w = M.gramSchmidt(basis);
  const p2 = M.projection(basis[1], [w[0]]), u2 = M.sub(basis[1], p2);
  const p3 = M.projection(basis[2], w.slice(0, 2)), u3 = M.sub(basis[2], p3);
  const a = [1, 0, 1], b = [0, 1, 1], x = [1, 1, 1];
  const e = M.gramSchmidt([a, b]), p = M.projection(x, e), r = M.sub(x, p);
  const plane = [
    M.scale(a, -1),
    M.sub(M.scale(a, 1.8), b),
    M.scale(M.add(a, b), 1.8),
    M.sub(M.scale(b, 1.8), a),
  ];
  const unitPlane = [[-1.3, -1.3, 0], [2.1, -1.3, 0], [2.1, 2.1, 0], [-1.3, 2.1, 0]];
  const configs = {
    4: {
      title: "Ruang Hasil Kali Dalam",
      intro:
        "Hasil kali dalam memberi arti pada panjang dan sudut. Amati dua vektor saat sudutnya berubah.",
      source: "Ilustrasi Euclides • pengantar PDF halaman 3–5",
      zoom: 125,
      steps: [60, 90, 120].map((deg) =>
        S(
          deg === 90
            ? "Tegak lurus: hasilnya nol"
            : deg < 90
            ? "Sudut lancip: hasilnya positif"
            : "Sudut tumpul: hasilnya negatif",
          "Vektor u tetap. Vektor v berputar dengan panjang yang sama. yang berubah adalah keselarasan arahnya.",
          `⟨u, v⟩ = ‖u‖ ‖v‖ cos θ\nθ = ${deg}°  →  ⟨u, v⟩ = ${
            deg === 90 ? "0" : deg === 60 ? "2" : "−2"
          }`,
          [
            V("u", [2, 0, 0], "u", 1),
            V("v", [2 * Math.cos(deg * Math.PI / 180), 2 * Math.sin(deg * Math.PI / 180), 0], "v"),
          ],
          { angle: deg },
        )
      ),
    },
    6: {
      title: "Norm dan Jarak",
      intro:
        "Di ruang Euclides, norm adalah panjang panah. Komponen horizontal dan vertikal membentuk segitiga siku-siku.",
      source: "Definisi norm • PDF halaman 5. ilustrasi turunan (3, 4)",
      zoom: 80,
      steps: [
        S(
          "Mulai dari komponen horizontal",
          "Vektor u = (3, 4) bergerak 3 satuan ke kanan dan 4 satuan ke atas.",
          "u = (3, 4)",
          [V("cx", [3, 0, 0], "3 satuan", 1)],
        ),
        S(
          "Tambahkan komponen vertikal",
          "Panah vertikal diletakkan di ujung komponen pertama. Ujung akhirnya tetap pada titik (3, 4).",
          "u = (3, 0) + (0, 4)",
          [V("cx", [3, 0, 0], "3", 1), V("cy", [3, 4, 0], "4", 1, [3, 0, 0])],
        ),
        S(
          "Hubungkan pangkal dengan ujung",
          "Panjang resultan diperoleh dari akar hasil kali dalam u dengan dirinya.",
          "‖u‖ = √⟨u,u⟩\n= √(3² + 4²) = 5",
          [
            V("cx", [3, 0, 0], "3", 2),
            V("cy", [3, 4, 0], "4", 2, [3, 0, 0]),
            V("u", [3, 4, 0], "u · panjang 5"),
          ],
        ),
        S(
          "Jarak adalah panjang selisih",
          "Jika v = (3, 0), maka jarak titik u dan v adalah panjang ruas vertikal di antaranya.",
          "d(u,v) = ‖u − v‖\n= ‖(0,4)‖ = 4",
          [
            V("v", [3, 0, 0], "v", 1),
            V("u", [3, 4, 0], "u"),
            V("diff", [3, 4, 0], "u − v", 2, [3, 0, 0]),
          ],
        ),
      ],
    },
    12: {
      title: "Himpunan Ortogonal dan Ortonormal",
      intro: "Tegak lurus adalah syarat pertama. Panjang satu adalah syarat tambahan.",
      source: "Definisi ortogonal dan ortonormal • PDF halaman 10–11",
      zoom: 100,
      steps: [
        S(
          "Dua arah belum tegak lurus",
          "Hasil kali dalam tidak nol, sehingga kedua vektor belum ortogonal.",
          "⟨(2,0), (1,2)⟩ = 2",
          [V("u", [2, 0, 0], "u", 1), V("v", [1, 2, 0], "v")],
        ),
        S(
          "Ortogonal: sudut 90°",
          "Hasil kali dalamnya nol. Namun kedua panjangnya masih 2, sehingga belum ortonormal.",
          "⟨(2,0), (0,2)⟩ = 0\n‖u‖ = ‖v‖ = 2",
          [V("u", [2, 0, 0], "u", 1), V("v", [0, 2, 0], "v")],
          { right: true },
        ),
        S(
          "Normalisasi: bagi dengan norm",
          "Arah kedua vektor tetap. Panjangnya diperkecil menjadi 1.",
          "w₁ = u / ‖u‖ = (1,0)\nw₂ = v / ‖v‖ = (0,1)",
          [V("u", [1, 0, 0], "w₁", 1), V("v", [0, 1, 0], "w₂")],
          { right: true, circle: true },
        ),
      ],
    },
    15: {
      title: "Kombinasi Linear pada Basis Ortonormal",
      intro:
        "Contoh 6: a = (1, 2), u = (1, 1)/√2 dan v = (1, −1)/√2. Kedua vektor basis ortonormal.",
      source: "Contoh 6 • PDF halaman 14–15",
      zoom: 130,
      steps: [
        S(
          "Basis tidak harus sejajar sumbu",
          "Basis ortonormal tidak harus sejajar sumbu koordinat. Setiap pasangan vektor berbeda saling ortogonal dan masing-masing memiliki norm satu.",
          "⟨u,v⟩ = 0. ‖u‖ = ‖v‖ = 1",
          [
            V("u", [1 / Math.sqrt(2), 1 / Math.sqrt(2), 0], "u", 1),
            V("v", [1 / Math.sqrt(2), -1 / Math.sqrt(2), 0], "v", 2),
            V("a", [1, 2, 0], "a"),
          ],
        ),
        S(
          "Komponen pada arah u",
          "Hasil kali dalam a dengan u menjadi koefisien pada arah u.",
          "k₁ = ⟨a,u⟩ = 3/√2\nk₁u = (3/2, 3/2)",
          [V("a", [1, 2, 0], "a", 2), V("u", [1.5, 1.5, 0], "k₁u")],
        ),
        S(
          "Tambahkan komponen pada v",
          "Koefisien kedua negatif, sehingga komponen bergerak berlawanan dengan arah v.",
          "k₂ = ⟨a,v⟩ = −1/√2\na = (3/2,3/2) + (−1/2,1/2)",
          [
            V("a", [1, 2, 0], "a", 2),
            V("u", [1.5, 1.5, 0], "k₁u"),
            V("v", [1, 2, 0], "k₂v", 1, [1.5, 1.5, 0]),
          ],
        ),
      ],
    },
    17: {
      title: "Proses Gram–Schmidt",
      intro:
        "Proses Gram–Schmidt mengubah basis suatu ruang hasil kali dalam menjadi basis ortonormal.",
      source: "Ilustrasi proses • PDF halaman 17–21",
      zoom: 100,
      steps: [
        S(
          "Basis awal",
          "Vektor pertama menjadi arah acuan. Vektor kedua masih memiliki bagian yang sejajar arah itu.",
          "c₁ = (2,0), c₂ = (2,2)",
          [V("c1", [2, 0, 0], "c₁", 1), V("c2", [2, 2, 0], "c₂")],
        ),
        S(
          "Proyeksikan pada arah pertama",
          "Bagian sejajar c₂ berada tepat pada sumbu arah w₁.",
          "w₁ = (1,0)\nproj c₂ = ⟨c₂,w₁⟩w₁ = (2,0)",
          [
            V("c1", [1, 0, 0], "w₁", 1),
            V("c2", [2, 2, 0], "c₂", 2),
            V("proj", [2, 0, 0], "proyeksi"),
          ],
          { segments: [[[2, 2, 0], [2, 0, 0]]] },
        ),
        S(
          "Kurangi komponen sejajar",
          "Ujung panah bergeser mengikuti pengurangan proyeksi. Hasil akhirnya tegak lurus terhadap w₁.",
          "u₂ = (2,2) − (2,0) = (0,2)",
          [V("c1", [1, 0, 0], "w₁", 1), V("c2", [0, 2, 0], "u₂")],
          { right: true },
        ),
        S(
          "Buat norm sisa menjadi satu",
          "Membagi dengan norm mengubah panjang, bukan arah. Ruang yang direntang tetap sama.",
          "w₂ = u₂ / ‖u₂‖ = (0,1)",
          [V("c1", [1, 0, 0], "w₁", 1), V("c2", [0, 1, 0], "w₂")],
          { right: true, circle: true },
        ),
      ],
    },
    18: {
      title: "Contoh 7: Ortonormalisasi pada R³",
      intro:
        "Contoh 7: c₁ = (1,1,1), c₂ = (0,1,1), c₃ = (0,0,1). Putar gambar untuk melihat arah setiap vektor.",
      source: "Contoh 7 • PDF halaman 22–23",
      dimension: 3,
      zoom: 155,
      steps: [
        S(
          "Basis awal",
          "Ketiga vektor bebas linear, tetapi belum saling tegak lurus.",
          "B = {(1,1,1), (0,1,1), (0,0,1)}",
          [V("c1", basis[0], "c₁"), V("c2", basis[1], "c₂", 1), V("c3", basis[2], "c₃", 2)],
        ),
        S(
          "Normalisasi vektor pertama",
          "Panjang c₁ adalah √3. Pembagian ini menghasilkan vektor satuan w₁.",
          "w₁ = (1,1,1) / √3",
          [V("c1", w[0], "w₁"), V("c2", basis[1], "c₂", 1)],
        ),
        S(
          "Tentukan proyeksi c₂",
          "Komponen sejajar w₁ adalah (2/3, 2/3, 2/3).",
          "⟨c₂,w₁⟩ = 2/√3\nproj c₂ = (2/3, 2/3, 2/3)",
          [V("c1", w[0], "w₁", 1), V("c2", basis[1], "c₂", 2), V("proj", p2, "proyeksi")],
          { segments: [[basis[1], p2]] },
        ),
        S(
          "Kurangi lalu normalisasi",
          "Sisa u₂ = (−2,1,1)/3 tegak lurus terhadap w₁. Bagi dengan norm √6/3.",
          "w₂ = (−2,1,1) / √6\n⟨w₁,w₂⟩ = (−2+1+1)/√18 = 0",
          [V("c1", w[0], "w₁", 1), V("c2", w[1], "w₂")],
        ),
      ],
    },
    19: {
      title: "Contoh 7: Langkah Ketiga",
      intro: "Vektor ketiga harus tegak lurus terhadap kedua arah yang sudah diperoleh.",
      source: "Contoh 7 • PDF halaman 24–25",
      dimension: 3,
      zoom: 180,
      steps: [
        S(
          "Dua vektor acuan",
          "w₁ dan w₂ membangun bidang. Ditentukan komponen c₃ pada bidang tersebut.",
          "⟨c₃,w₁⟩ = 1/√3\n⟨c₃,w₂⟩ = 1/√6",
          [V("w1", w[0], "w₁", 1), V("w2", w[1], "w₂", 1), V("c3", basis[2], "c₃")],
          {
            plane: [
              M.scale(w[0], -1),
              M.scale(w[1], 1.6),
              M.scale(M.add(w[0], w[1]), 1.6),
              M.scale(w[1], -1),
            ],
          },
        ),
        S(
          "Kurangi kedua proyeksi",
          "Sisa u₃ tegak lurus terhadap w₁ dan w₂.",
          "u₃ = c₃ − ⟨c₃,w₁⟩w₁ − ⟨c₃,w₂⟩w₂\n= (0, −1/2, 1/2)",
          [
            V("w1", w[0], "w₁", 1),
            V("w2", w[1], "w₂", 1),
            V("c3", u3, "u₃"),
            V("p3", p3, "komponen bidang", 2),
          ],
        ),
        S(
          "Tiga arah ortonormal",
          "Setiap vektor memiliki norm 1. Semua pasangan memiliki hasil kali dalam nol.",
          "w₃ = (0,−1,1) / √2\n⟨w₁,w₃⟩ = ⟨w₂,w₃⟩ = 0",
          [V("w1", w[0], "w₁", 1), V("w2", w[1], "w₂", 2), V("c3", w[2], "w₃")],
        ),
      ],
    },
    20: {
      title: "Proyeksi Ortogonal pada Subruang",
      intro:
        "Proyeksi pada bidang adalah bagian vektor yang berada di bidang tersebut. Selisihnya tegak lurus bidang. Ini akan digunakan pada Contoh 8 dan 9.",
      source: "ALIN-6 hlm. 26–38 • gambaran proyeksi pada bidang",
      dimension: 3,
      zoom: 125,
      steps: [
        S(
          "Vektor di luar bidang",
          "Bidang W di sini adalah bidang xy. Vektor x memiliki komponen yang keluar dari W.",
          "x = (1,1,2)\nW = span{(1,0,0), (0,1,0)}",
          [V("x", [1, 1, 2], "x")],
          { plane: unitPlane },
        ),
        S(
          "Proyeksi pada bidang",
          "Komponen di dalam bidang adalah (1,1,0). Garis putus-putus mengikuti arah tegak lurus bidang.",
          "p = projW x = (1,1,0)",
          [V("x", [1, 1, 2], "x", 2), V("p", [1, 1, 0], "p")],
          { plane: unitPlane, segments: [[[1, 1, 2], [1, 1, 0]]] },
        ),
        S(
          "Vektor asal, proyeksi, dan sisa",
          "p berada pada W. Sisa r = x − p tegak lurus terhadap W.",
          "x = p + r\nr = (0,0,2)",
          [V("p", [1, 1, 0], "p"), V("r", [1, 1, 2], "r", 1, [1, 1, 0]), V("x", [1, 1, 2], "x", 2)],
          { plane: unitPlane },
        ),
      ],
    },
    21: {
      title: "Contoh 8: Basis Ortonormal Bidang",
      intro:
        "Contoh 8: W dibangun oleh a = (1,0,1) dan b = (0,1,1). Vektor yang akan diproyeksikan adalah x = (1,1,1).",
      source: "Contoh 8 • PDF halaman 26–30",
      dimension: 3,
      zoom: 145,
      steps: [
        S(
          "Dua vektor yang membentuk bidang",
          "a dan b bebas linear, tetapi belum ortogonal. Keduanya tetap berada pada bidang W.",
          "a = (1,0,1), b = (0,1,1)",
          [V("a", a, "a"), V("b", b, "b", 1)],
          { plane },
        ),
        S(
          "Normalisasi pembangun pertama",
          "Norm a = √2. Arah e₁ sama dengan a.",
          "e₁ = (1,0,1) / √2",
          [V("a", e[0], "e₁"), V("b", b, "b", 1)],
          { plane },
        ),
        S(
          "Ortogonalisasi dan normalisasi b",
          "b′ = b − (1/2)a = (−1/2,1,1/2). Norm b′ = √6/2.",
          "e₂ = (−1,2,1) / √6\n⟨e₁,e₂⟩ = 0",
          [V("a", e[0], "e₁"), V("b", e[1], "e₂", 1)],
          { plane },
        ),
      ],
    },
    22: {
      title: "Contoh 8 dan 9: Proyeksi Ortogonal",
      intro:
        "Gunakan basis ortonormal dari langkah sebelumnya. Setiap hasil kali dalam menjadi koefisien komponen proyeksi.",
      source: "Contoh 8 dan 9 • PDF halaman 31–38",
      dimension: 3,
      zoom: 145,
      steps: [
        S(
          "Vektor semula",
          "x berada di luar bidang W. Akan ditentukan proyeksi ortogonal x pada bidang W.",
          "x = (1,1,1)",
          [V("x", x, "x")],
          { plane },
        ),
        S(
          "Jumlahkan komponen basis",
          "Koefisiennya √2 dan 2/√6. Jumlahkan kedua komponen untuk memperoleh p.",
          "p = √2 e₁ + (2/√6)e₂\n= (2/3,2/3,4/3)",
          [V("x", x, "x", 2), V("p", p, "p")],
          { plane, segments: [[x, p]] },
        ),
        S(
          "Periksa sisa tegak lurus",
          "Sisa r = (1/3,1/3,−1/3). Hasil kali dalam r dengan a maupun b adalah nol.",
          "x = p + r\n⟨r,a⟩ = ⟨r,b⟩ = 0",
          [V("x", x, "x", 2), V("p", p, "p"), V("r", x, "r", 1, p)],
          { plane },
        ),
      ],
    },
  };
  configs[7] = {
    title: "Hasil Kali Dalam Euclides",
    intro:
      "Misalkan u, v ∈ Rⁿ. Hasil kali dalam Euclides diperoleh dengan menjumlahkan hasil kali komponen yang bersesuaian.",
    source: "Contoh 1 • PDF halaman 5. ilustrasi perhitungan di R²",
    zoom: 95,
    steps: [
      S(
        "Vektor pada R²",
        "Sebagai ilustrasi, ditetapkan u = (3,1) dan v = (1,2).",
        "⟨u,v⟩ = u₁v₁ + u₂v₂",
        [V("u", [3, 1, 0], "u", 1), V("v", [1, 2, 0], "v")],
      ),
      S(
        "Hasil kali komponen pertama",
        "Komponen pertama kedua vektor dikalikan.",
        "u₁v₁ = 3 × 1 = 3",
        [V("u", [3, 0, 0], "u₁ = 3", 1), V("v", [1, 0, 0], "v₁ = 1")],
      ),
      S(
        "Hasil kali komponen kedua",
        "Komponen kedua dikalikan, kemudian kedua hasil dijumlahkan.",
        "u₂v₂ = 1 × 2 = 2\n⟨u,v⟩ = 3 + 2 = 5",
        [V("u", [0, 1, 0], "u₂ = 1", 1), V("v", [0, 2, 0], "v₂ = 2")],
      ),
      S(
        "Hasil kali dalam Euclides",
        "Operasi ini memenuhi simetris, aditivitas, homogenitas, dan positivitas.",
        "⟨u,u⟩ = 3² + 1² = 10 ≥ 0",
        [V("u", [3, 1, 0], "u", 1), V("v", [1, 2, 0], "v")],
      ),
    ],
  };
  configs[8] = {
    title: "Hasil Kali Dalam Berbobot",
    intro:
      "Pada R³ didefinisikan ⟨u,v⟩ = 2u₁v₁ + u₂v₂ + 3u₃v₃. Akan ditunjukkan bahwa operasi ini merupakan hasil kali dalam.",
    source: "Contoh 2 • PDF halaman 6–8. Elipsoid: ilustrasi norm satu.",
    dimension: 3,
    zoom: 150,
    steps: [
      S(
        "Simetris",
        "Pertukaran u dan v tidak mengubah hasil karena perkalian bilangan real bersifat komutatif.",
        "2u₁v₁ + u₂v₂ + 3u₃v₃\n= 2v₁u₁ + v₂u₂ + 3v₃u₃",
        [V("x", [1, 0, 0], "x", 1), V("y", [0, 1, 0], "y", 1), V("z", [0, 0, 1], "z")],
        { ellipsoid: [1, 1, 1] },
      ),
      S(
        "Aditivitas",
        "Penjabaran setiap komponen memberikan jumlah dua hasil kali dalam.",
        "⟨u+v,w⟩ = ⟨u,w⟩ + ⟨v,w⟩",
        [],
        { ellipsoid: [1, 1, 1] },
      ),
      S(
        "Homogenitas",
        "Skalar k dapat dikeluarkan dari seluruh suku hasil kali dalam.",
        "⟨ku,v⟩ = k⟨u,v⟩",
        [],
        { ellipsoid: [1, 1, 1] },
      ),
      S(
        "Positivitas",
        "Ketiga bobot positif. Hasilnya nonnegatif dan bernilai nol hanya jika u adalah vektor nol.",
        "⟨u,u⟩ = 2u₁² + u₂² + 3u₃² ≥ 0",
        [],
        { ellipsoid: [1 / Math.sqrt(2), 1, 1 / Math.sqrt(3)] },
      ),
      S(
        "Permukaan norm satu",
        "Persamaan norm satu membentuk elipsoid dalam koordinat Euclides. Bobot mengubah pengukuran panjang.",
        "‖u‖ = 1 ⇔ 2u₁² + u₂² + 3u₃² = 1",
        [
          V("x", [1 / Math.sqrt(2), 0, 0], "1/√2", 1),
          V("y", [0, 1, 0], "1", 1),
          V("z", [0, 0, 1 / Math.sqrt(3)], "1/√3"),
        ],
        { ellipsoid: [1 / Math.sqrt(2), 1, 1 / Math.sqrt(3)] },
      ),
    ],
  };
  configs[13] = {
    title: "Contoh Himpunan Ortogonal dan Ortonormal",
    intro: "Pemeriksaan berikut menggunakan hasil kali dalam Euclides pada R².",
    source: "Contoh 5 • PDF halaman 12",
    zoom: 140,
    steps: [
      S(
        "Himpunan A",
        "Kedua vektor berlawanan arah. Hasil kali dalamnya tidak nol. A bukan himpunan ortogonal.",
        "A = {(1,0), (−1,0)}\n⟨(1,0),(−1,0)⟩ = −1",
        [V("u", [1, 0, 0], "(1,0)", 1), V("v", [-1, 0, 0], "(−1,0)")],
      ),
      S(
        "Himpunan B",
        "Kedua vektor saling tegak lurus dan masing-masing memiliki norm satu. B merupakan himpunan ortonormal.",
        "B = {(1,0), (0,−1)}\n⟨u,v⟩ = 0. ‖u‖ = ‖v‖ = 1",
        [V("u", [1, 0, 0], "(1,0)", 1), V("v", [0, -1, 0], "(0,−1)")],
        { circle: true },
      ),
      S(
        "Himpunan C",
        "Hasil kali kedua vektor adalah nol dan masing-masing normnya satu. Jadi, C merupakan himpunan ortonormal.",
        "C = {(1,1)/√2, (−1,1)/√2}\n⟨u,v⟩ = −1/2 + 1/2 = 0",
        [
          V("u", [1 / Math.sqrt(2), 1 / Math.sqrt(2), 0], "u", 1),
          V("v", [-1 / Math.sqrt(2), 1 / Math.sqrt(2), 0], "v"),
        ],
        { circle: true },
      ),
    ],
  };
  configs[6].steps.pop();
  configs[6].title = "Norm (Panjang Vektor)";
  configs[6].origin = [210, 370];
  for (const step of configs[8].steps) step.ellipsoid = [1 / Math.sqrt(2), 1, 1 / Math.sqrt(3)];
  const NS = "http://www.w3.org/2000/svg";
  globalThis.AlinNarrative?.(configs);
  globalThis.AlinAxioms?.(configs);
  configs[12].title = "Syarat Ortogonal dan Ortonormal";
  configs[12].intro = "Pemeriksaan dilakukan dengan hasil kali dalam dan norm yang digunakan pada ruang tersebut.";
  configs[12].steps = [
    S("Ortogonal", "Setiap pasangan vektor yang berbeda dalam himpunan harus memiliki hasil kali dalam nol.", "⟨uᵢ,uⱼ⟩ = 0 untuk i ≠ j", []),
    S("Ortonormal", "Selain ortogonal, setiap vektor harus memiliki norm satu. Kedua syarat ini diperiksa pada contoh berikutnya.", "⟨uᵢ,uⱼ⟩ = 0 untuk i ≠ j\n‖uᵢ‖ = 1 untuk setiap i", []),
  ];
  configs[17].intro = "Gram–Schmidt mengubah basis yang belum ortonormal menjadi basis ortonormal yang merentang ruang yang sama.";
  configs[17].steps.unshift(S("Syarat awal", "Vektor-vektor awal harus bebas linear. Pada setiap tahap, sisa dinormalisasikan hanya jika normnya bukan nol.", "Basis awal → basis ortonormal\nRuang yang direntang tetap sama", []));
  const firstProjection = configs[17].steps.findIndex(step => step.heading === "Proyeksikan pada arah pertama");
  configs[17].steps.splice(firstProjection, 0, S("Normalisasikan vektor pertama", "Bagi c₁ dengan normnya untuk memperoleh arah pertama yang bernorm satu.", "c₁ = (2,0), ‖c₁‖ = 2\nw₁ = c₁ / ‖c₁‖ = (1,0)", [V("w1", [1,0,0], "w₁")]));
  configs[22].steps.push(S("Periksa hasil proyeksi", "p merupakan kombinasi linear a dan b, sehingga berada di W. Sisa r tegak lurus terhadap kedua vektor basis, sehingga tegak lurus W.", "p = ⅔a + ⅔b = (⅔,⅔,⁴⁄₃) ∈ W\nr = (⅓,⅓,−⅓)\n⟨r,a⟩ = ⅓ + 0 − ⅓ = 0\n⟨r,b⟩ = 0 + ⅓ − ⅓ = 0", [V("x", x, "x", 2), V("p", p, "p"), V("r", x, "r", 1, p)], { plane }));

  configs[6].steps.at(-1).heading = "Hasil";
  configs[6].steps.at(-1).explain = "";
  configs[6].intro = configs[6].intro.replace(/\bu\b(?!\u0304)/g, "ū");
  for (const step of configs[6].steps) {
    for (const key of ["explain", "formula"]) step[key] = step[key].replace(/\bu\b(?!\u0304)/g, "ū");
    if (step.formulaParts) for (let i = 0; i < step.formulaParts.length; i++) {
      const token = step.formulaParts[i];
      if (typeof token === "string") step.formulaParts[i] = token.replace(/\bu\b(?!\u0304)/g, "ū");
      else token.text = token.text.replace(/\bu\b(?!\u0304)/g, "ū");
    }
    for (const vector of step.vectors) vector.label = vector.label.replace(/\bu\b(?!\u0304)/g, "ū");
    step.note = "ū menyatakan vektor. ‖ū‖ menyatakan norm atau panjang vektor.";
  }
  const identityColors = {
    w: "#8551ac",
    sum: "#15804a",
    u: "#c53243",
    v: "#1f4bff",
    a: "#15804a",
    b: "#1f4bff",
    c1: "#c53243",
    c2: "#1f4bff",
    c3: "#8551ac",
    w1: "#c53243",
    w2: "#1f4bff",
    w3: "#8551ac",
    p: "#15804a",
    proj: "#15804a",
    r: "#8551ac",
    x: "#c53243",
    y: "#1f4bff",
    z: "#8551ac",
  };
  for (const config of Object.values(configs)) {
    for (const state of config.steps) {
      for (const v of state.vectors) {
        v.color = identityColors[v.id] || ["#1f4bff", "#c53243", "#15804a"][v.kind];
      }
    }
  }

  function el(tag, attrs, text) {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
    if (text) n.textContent = text;
    return n;
  }
  function draw(svg, config, state, yaw = -.65, pitch = .55) {
    if (config.concept) {
      globalThis.drawAlinConcept(svg, config, state);
      svg.querySelectorAll("text").forEach((n) => {
        if (Number(n.getAttribute("y")) >= 430) n.remove();
      });
      return;
    }
    svg.replaceChildren();
    const z = config.zoom || 120, dim = config.dimension === 3;
    const origin = config.origin || (dim ? [360, 290] : [265, 300]);
    const project = ([x, y, h = 0]) =>
      dim
        ? [
          origin[0] + z * (x * Math.cos(yaw) - y * Math.sin(yaw)),
          origin[1] +
          z * ((x * Math.sin(yaw) + y * Math.cos(yaw)) * Math.sin(pitch) - h * Math.cos(pitch)),
        ]
        : [origin[0] + z * x, origin[1] - z * y];
    const line = (a, b, attrs = {}) => {
      const A = project(a), B = project(b);
      svg.append(el("line", { x1: A[0], y1: A[1], x2: B[0], y2: B[1], ...attrs }));
    };
    const occupied = [];
    const label = (point, text, attrs = {}) => {
      const P = project(point);
      let x = P[0] + 10, y = P[1] - 12;
      if (attrs.class === "vector-label") {
        const width = Math.min(360, text.length * 8.6), height = 22;
        for (
          const [dx, dy] of [[10, -12], [10, 25], [-width - 12, -12], [-width - 12, 25], [10, 52], [
            -width - 12,
            52,
          ]]
        ) {
          const box = {
            x: Math.max(8, Math.min(750 - width, P[0] + dx)),
            y: Math.max(28, Math.min(450, P[1] + dy)),
            w: width,
            h: height,
          };
          if (
            !occupied.some((b) =>
              box.x < b.x + b.w && box.x + box.w > b.x && box.y - height < b.y && box.y > b.y - b.h
            )
          ) {
            x = box.x;
            y = box.y;
            occupied.push(box);
            break;
          }
        }
      }
      svg.append(el("text", { x, y, ...attrs }, text));
    };
    for (let n = -2; n <= 5; n++) {
      line([n, -2, 0], [n, 5, 0], { class: "grid-line" });
      line([-2, n, 0], [5, n, 0], { class: "grid-line" });
    }
    if (state.plane) {
      svg.append(el("polygon", {
        points: state.plane.map(project).map((p) => p.join(",")).join(" "),
        fill: "#1f4bff",
        "fill-opacity": ".09",
        stroke: "#9bb0ff",
        "stroke-width": 1,
      }));
    }
    if (state.ellipsoid) {
      const [rx, ry, rz] = state.ellipsoid;
      for (let lat = -3; lat <= 3; lat++) {
        const v = lat * Math.PI / 8, pts = [];
        for (let j = 0; j <= 80; j++) {
          const a = j * Math.PI / 40;
          pts.push(
            project([
              rx * Math.cos(v) * Math.cos(a),
              ry * Math.cos(v) * Math.sin(a),
              rz * Math.sin(v),
            ]),
          );
        }
        svg.append(
          el("polyline", {
            points: pts.map((p) => p.join(",")).join(" "),
            fill: "none",
            stroke: "#1f4bff",
            "stroke-opacity": ".42",
            "stroke-width": 1.5,
          }),
        );
      }
      for (let mer = 0; mer < 8; mer++) {
        const a = mer * Math.PI / 4, pts = [];
        for (let j = 0; j <= 80; j++) {
          const v = -Math.PI / 2 + j * Math.PI / 80;
          pts.push(
            project([
              rx * Math.cos(v) * Math.cos(a),
              ry * Math.cos(v) * Math.sin(a),
              rz * Math.sin(v),
            ]),
          );
        }
        svg.append(
          el("polyline", {
            points: pts.map((p) => p.join(",")).join(" "),
            fill: "none",
            stroke: "#1f4bff",
            "stroke-opacity": ".42",
            "stroke-width": 1.5,
          }),
        );
      }
    }
    for (const [i, name] of ["x", "y", ...(dim ? ["z"] : [])].entries()) {
      const a = [0, 0, 0], b = [0, 0, 0];
      a[i] = -.7;
      b[i] = dim ? 1.7 : 4.2;
      line(a, b, { class: "axis" });
      label(b, name);
    }
    label(O, "0", { x: origin[0] - 20, y: origin[1] + 24 });
    if (state.circle && !dim) {
      svg.append(
        el("circle", {
          cx: origin[0],
          cy: origin[1],
          r: z,
          fill: "none",
          stroke: "#b5c5fa",
          "stroke-width": 1.5,
          "stroke-dasharray": "5 5",
        }),
      );
    }
    if (state.right) {
      line([.18, 0, 0], [.18, .18, 0], { stroke: "#6f7b91", "stroke-width": 2 });
      line([.18, .18, 0], [0, .18, 0], { stroke: "#6f7b91", "stroke-width": 2 });
    }
    for (const [a, b] of state.segments || []) {
      line(a, b, { stroke: "#8390a6", "stroke-width": 2, "stroke-dasharray": "6 6" });
    }
    if (state.angle) {
      const pts = [];
      for (let t = 0; t <= state.angle; t += 2) {
        pts.push(
          project([.42 * Math.cos(t * Math.PI / 180), .42 * Math.sin(t * Math.PI / 180), 0]),
        );
      }
      svg.append(
        el("polyline", {
          points: pts.map((p) => p.join(",")).join(" "),
          fill: "none",
          stroke: "#1f4bff",
          "stroke-width": 2,
        }),
      );
      label([.6, .3, 0], `${state.angle}°`);
    }
    if (state.measure !== undefined) {
      svg.append(
        el(
          "text",
          { x: 535, y: 100, style: "font-size:25px;fill:#15804a;font-weight:700" },
          `Hasil: ${state.measure}`,
        ),
      );
    }
    if (state.highlight) {
      const horizontal = state.highlight === "x";
      const p1 = project([0, 0, 0]), p2 = project(horizontal ? [3, 0, 0] : [0, 2, 0]);
      svg.append(
        el("line", {
          x1: p1[0],
          y1: p1[1],
          x2: p2[0],
          y2: p2[1],
          stroke: "#15804a",
          "stroke-width": 16,
          opacity: .18,
        }),
      );
    }
    for (const v of state.vectors) {
      if ((v.opacity ?? 1) < 0.01) continue;
      const A = project(v.from),
        B = project(v.to),
        dx = B[0] - A[0],
        dy = B[1] - A[1],
        len = Math.hypot(dx, dy);
      if (len < .1) {
        svg.append(el("circle", { cx: A[0], cy: A[1], r: 5, fill: v.color || "#c53243" }));
        label(v.to, `${v.label} = (0, 0)`);
        continue;
      }
      const color = v.color || ["#1f4bff", "#c53243", "#15804a"][v.kind];
      const opacity = v.opacity ?? 1;
      svg.append(
        el("line", {
          x1: A[0],
          y1: A[1],
          x2: B[0],
          y2: B[1],
          stroke: color,
          "stroke-width": v.kind === 2 ? 2.5 : 4,
          "stroke-dasharray": v.kind === 2 ? "7 5" : "none",
          opacity,
          "stroke-linecap": "round",
        }),
      );
      const ux = dx / len, uy = dy / len, s = 12;
      svg.append(
        el("polygon", {
          points: `${B} ${B[0] - ux * s - uy * 5},${B[1] - uy * s + ux * 5} ${
            B[0] - ux * s + uy * 5
          },${B[1] - uy * s - ux * 5}`,
          fill: color,
          opacity,
        }),
      );
      if (opacity > .5) {
        const coord = v.to.map((x, i) => x - v.from[i]).slice(0, dim ? 3 : 2);
        const name = v.id === "cx"
          ? "u₁"
          : v.id === "cy"
          ? "u₂"
          : v.label.replace(/ · panjang.*$/, "");
        const approximate = coord.some((x) => Math.abs(x * 100 - Math.round(x * 100)) > 1e-6);
        label(
          v.to,
          v.coordinatesText ? `${name} (${v.coordinatesText})` : `${name} ${approximate ? "≈ " : ""}(${
            coord.map((x) => Number(x.toFixed(2))).join(", ")
          })`,
          { class: "vector-label", style: `fill:${color};font-size:17px`, opacity },
        );
        if (config.title?.startsWith("Norm")) {
          const length = Math.sqrt(coord.reduce((a, b) => a + b * b, 0));
          svg.append(
            el(
              "text",
              {
                x: (A[0] + B[0]) / 2 - dy / len * 20,
                y: (A[1] + B[1]) / 2 + dx / len * 20,
                style: `fill:${color};font-size:23px;font-weight:700`,
              },
              v.id === "u" && !state.formula?.includes("= 5")
                ? "?"
                : String(Number(length.toFixed(2))),
            ),
          );
        }
      }
    }
  }
  const lerp = (a, b, t) => a.map((n, i) => n + (b[i] - n) * t);
  function interpolate(a, b, t) {
    if (a.phase !== undefined && b.phase !== undefined) {
      return { ...b, phase: a.phase + (b.phase - a.phase) * t };
    }
    if (a.angle !== undefined && b.angle !== undefined) {
      const angle = a.angle + (b.angle - a.angle) * t;
      return {
        ...b,
        angle: Math.round(angle),
        vectors: [b.vectors[0], {
          ...b.vectors[1],
          to: [2 * Math.cos(angle * Math.PI / 180), 2 * Math.sin(angle * Math.PI / 180), 0],
        }],
      };
    }
    const keys = new Set(b.vectors.map((v) => v.id));
    return {
      ...b,
      ellipsoid: a.ellipsoid && b.ellipsoid ? lerp(a.ellipsoid, b.ellipsoid, t) : b.ellipsoid,
      vectors: [...keys].map((id) => {
        const A = a.vectors.find((v) => v.id === id), B = b.vectors.find((v) => v.id === id);
        const model = B || A;
        return {
          ...model,
          from: lerp(A?.from || model.from, B?.from || model.from, t),
          to: A && B ? lerp(A.to, B.to, t) : model.to,
          opacity: A && B ? 1 : B ? t : 1 - t,
        };
      }),
    };
  }
  const scenes = new Map();
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const originalSlides = [...document.querySelectorAll(".slide")];
  delete configs[4];
  for (const config of globalThis.AlinConcepts || []) {
    const slide = document.createElement("section");
    slide.className = "slide slide--concept";
    slide.dataset.title = config.title;
    slide.innerHTML =
      '<div class="slide__inner"><header class="s-head"><p class="kicker">Pemahaman konsep</p><h2></h2></header></div>';
    originalSlides[config.before - 1].before(slide);
    config.slideElement = slide;
    configs["concept-" + config.concept] = config;
  }
  originalSlides[3].remove();
  [...document.querySelectorAll(".slide")].forEach((slide, i) =>
    slide.dataset.chapter = "Bab VI / " + String(i + 1).padStart(2, "0")
  );
  for (const [num, config] of Object.entries(configs)) {
    const slide = config.slideElement || originalSlides[Number(num) - 1];
    slide.classList.add("slide--lab");
    slide.dataset.scene = num;
    if (!slide.querySelector(".s-head")) {
      const h = document.createElement("header");
      h.className = "s-head";
      h.append(slide.querySelector("h2"));
      slide.querySelector(".slide__inner").prepend(h);
    }
    const heading = slide.querySelector("h2");
    heading.textContent = config.title;
    slide.dataset.title = config.title;
    const inner = slide.querySelector(".slide__inner"), header = slide.querySelector(".s-head");
    inner.replaceChildren(header);
    const lab = document.createElement("div");
    lab.className = `lab ${config.dimension === 3 ? "lab--3d" : ""}`;
    lab.innerHTML =
      `<div class="lab__story"><p class="lab__intro"></p><div class="lab__steps" aria-label="Tahapan penjelasan"></div><p class="lab__eyebrow">Langkah demi langkah</p><h3 class="lab__heading"></h3><p class="lab__explain" aria-live="polite"></p><p class="lab__formula"></p><p class="lab__source"></p></div><div class="lab__view"><svg class="lab__plot" viewBox="0 0 760 465" role="img"></svg><div class="lab__legend"><span>Vektor utama</span><span>Arah acuan</span><span>Pembanding</span></div><div class="lab__controls"><button type="button" data-lab="prev" aria-label="Tahap sebelumnya">←</button><button type="button" class="lab__play" data-lab="play">Putar animasi</button><button type="button" data-lab="next" aria-label="Tahap berikutnya">→</button><button type="button" data-lab="reset">Ulangi</button>${
        config.dimension === 3
          ? '<label class="lab__camera">Sudut <input type="range" min="-170" max="170" value="-37" aria-label="Sudut pandang 3D"><button type="button" data-lab="camera">Reset</button></label>'
          : '<span class="lab__counter"></span>'
      }</div></div>`;
    inner.append(lab);
    lab.querySelector(".lab__intro").textContent = config.intro;
    lab.querySelector(".lab__source").textContent = config.source;
    if (config.concept) {
      lab.querySelector(".lab__eyebrow").textContent = "Gambaran geometri";
      lab.querySelector(".lab__legend").textContent =
        "Gambaran konsep • perhitungan disajikan pada slide contoh.";
    }
    const algebra = document.createElement("div");
    algebra.className = "lab__algebra";
    const demo = document.createElement("div");
    demo.className = "lab__application";
    demo.hidden = true;
    const visual = document.createElement("span");
    visual.className = "application-motion";
    const kind = /cahaya|Lambert/.test(config.application || "")
      ? "light"
      : /pesawat|penerbangan/.test(config.application || "")
      ? "plane"
      : /kamera|koordinat|QR|basis/i.test(config.application || "")
      ? "basis"
      : "projection";
    visual.classList.add("demo-" + kind);
    visual.innerHTML = kind === "light"
      ? '<svg viewBox="0 0 110 65"><path d="M20 50H100" stroke="#25334c" stroke-width="3"/><path d="M60 50V12" stroke="#1f4bff" stroke-width="3"/><circle class="light-surface" cx="60" cy="42" r="12" fill="#15804a"/><g class="moving-light"><path d="M20 8L60 42" stroke="#e5b637" stroke-width="2"/><circle cx="20" cy="8" r="6" fill="#e5b637"/></g></svg>'
      : kind === "plane"
      ? '<svg viewBox="0 0 110 65"><path d="M6 45L104 20" stroke="#b9c9df" stroke-dasharray="4 4"/><g class="moving-plane"><path d="M25 30l24-3 14-17 6 1-7 17 20 4-20 4 7 17-6 1-14-17-24-3z" fill="#1f4bff"/><path d="M52 33h40M52 33V6" stroke="#c53243" stroke-width="2"/></g></svg>'
      : kind === "basis"
      ? '<svg viewBox="0 0 110 65"><g class="moving-basis"><path d="M30 52V10" stroke="#1f4bff" stroke-width="4"/><path d="M30 52H88" stroke="#c53243" stroke-width="4"/><path d="M30 40h12v12" fill="none" stroke="#15804a" stroke-width="2"/></g></svg>'
      : '<svg viewBox="0 0 110 65"><path d="M5 53H105" stroke="#25334c" stroke-width="2"/><circle cx="75" cy="10" r="4" fill="#c53243"/><path class="moving-projection" d="M75 10L75 53" stroke="#15804a" stroke-width="3"/><path d="M75 43h10v10" fill="none" stroke="#15804a"/></svg>';
    visual.setAttribute("aria-hidden", "true");
    const description = document.createElement("span");
    description.textContent = config.application || "Application";
    demo.append(visual, description);
    lab.querySelector(".lab__legend").after(algebra, demo);
    const svg = lab.querySelector("svg");
    const buttons = config.steps.map((step, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "lab__step";
      btn.textContent = String(i + 1).padStart(2, "0");
      btn.setAttribute("aria-label", step.heading);
      lab.querySelector(".lab__steps").append(btn);
      return btn;
    });
    let index = 0,
      frame = 0,
      motion = null,
      playing = false,
      yaw = -.65,
      pitch = .55,
      rendered = config.steps[0],
      clock = 0;
    function render(state = rendered) {
      rendered = state;
      draw(svg, config, state, yaw, pitch);
    }
    function ui() {
      const s = config.steps[index];
      lab.querySelector(".lab__intro").hidden = !config.intro || s.explain === config.intro;
      lab.querySelector(".lab__heading").textContent = s.heading;
      lab.querySelector(".lab__explain").textContent = s.explain;
      const formula = lab.querySelector(".lab__formula");
      formula.replaceChildren();
      const vectorColors = new Map();
      for (const v of s.vectors) {
        const symbol = v.label.match(/^[a-zA-Z][₀-₉₁₂₃]*/)?.[0];
        if (symbol && v.id !== "sum") vectorColors.set(symbol, v.color || ["#1f4bff", "#c53243", "#15804a"][v.kind]);
      }
      if (config.concept?.startsWith("metric")) {
        vectorColors.set("a", "#c53243");
        vectorColors.set("b", "#1f4bff");
      }
      const displayFormula = /^(Perhatikan nama|Bagian yang dihitung)/.test(s.formula)
        ? ""
        : s.formula;
      const parts = displayFormula.split(/([a-zA-Z]+[₀-₉]*|[0-9]+(?:\.[0-9]+)?)/u);
      for (const part of parts) {
        const span = document.createElement("span");
        span.textContent = part;
        const color = vectorColors.get(part) ||
          (/^[a-zA-Z][₀-₉]+$/u.test(part) ? vectorColors.get(part[0]) : undefined);
        if (color) span.style.color = color;
        if (config.title?.startsWith("Norm") && ["3", "4", "5"].includes(part)) {
          span.style.color = part === "5" ? "#c53243" : "#15804a";
        }
        formula.append(span);
      }
      if (s.formulaParts) {
        formula.replaceChildren();
        for (const token of s.formulaParts) {
          const span = document.createElement("span");
          span.textContent = typeof token === "string" ? token : token.text;
          if (typeof token !== "string") span.style.color = token.color;
          formula.append(span);
        }
      }
      let note = lab.querySelector(".lab__notation");
      if (!note) { note = document.createElement("p"); note.className = "lab__notation"; formula.after(note); }
      note.textContent = "";
      note.hidden = true;
      algebra.replaceChildren();
      for (const v of s.vectors.slice(0, 4)) {
        const item = document.createElement("span");
        item.style.color = v.color || ["#1f4bff", "#c53243", "#15804a"][v.kind];
        const coordinates = v.to.map((x, i) => x - v.from[i]).slice(
          0,
          config.dimension === 3 ? 3 : 2,
        );
        const approx = coordinates.some((x) => Math.abs(x - Math.round(x)) > 1e-8);
        item.textContent = `${
          v.id === "cx"
            ? "mendatar"
            : v.id === "cy"
            ? "tegak"
            : v.label.replace(/ · panjang.*$/, "")
        }: (${coordinates.map((x) => Number(x.toFixed(3))).join(", ")})${approx ? " ≈" : ""}`;
        if (v.coordinatesText) item.textContent = `${v.label}: (${v.coordinatesText})`;
        item.title =
          "Komponen vektor = koordinat ujung − koordinat pangkal. Desimal bertanda ≈ adalah pendekatan. rumus eksak ada di kiri.";
        algebra.append(item);
      }
      if (config.concept?.startsWith("metric")) {
        algebra.textContent = "";
        for (
          const [label, color] of [
            ...(s.phase >= 0 ? [[config.concept === "metric-negative" ? "a = (−4,3)" : "a = (4,3)", "#c53243"]] : []),
            ...(s.phase >= 1 ? [["b = (2,0)", "#1f4bff"]] : []),
          ]
        ) {
          const item = document.createElement("span");
          item.textContent = label;
          item.style.color = color;
          algebra.append(item);
        }
      }
      demo.hidden = !config.application || index !== config.steps.length - 1;
      demo.classList.toggle("is-running", !demo.hidden);
      if (!config.concept) {
        lab.querySelector(".lab__legend").textContent =
          "Warna simbol = warna panah. Komponen vektor ditampilkan di bawah.";
      }
      svg.setAttribute("aria-label", `${s.heading}. ${s.explain}`);
      buttons.forEach((b, i) => {
        b.setAttribute("aria-current", i === index ? "step" : "false");
        b.classList.toggle("is-done", i < index);
      });
      lab.querySelector('[data-lab="prev"]').disabled = index === 0;
      lab.querySelector('[data-lab="next"]').disabled = index === config.steps.length - 1;
      lab.querySelector('[data-lab="play"]').textContent = playing
        ? "Jeda"
        : config.concept
        ? "Lihat perubahan"
        : "Putar animasi";
      const counter = lab.querySelector(".lab__counter");
      if (counter) counter.textContent = `${index + 1} / ${config.steps.length}`;
      slide.dataset.sceneStep = String(index);
    }
    function stop() {
      motion = null;
      cancelAnimationFrame(frame);
      frame = 0;
      playing = false;
      ui();
    }
    function move(next, auto = false) {
      cancelAnimationFrame(frame);
      frame = 0;
      motion = null;
      const previous = rendered;
      index = Math.max(0, Math.min(next, config.steps.length - 1));
      const target = config.steps[index];
      playing = auto;
      ui();
      if (reduced.matches) {
        render(target);
        playing = false;
        ui();
        return;
      }
      clock = performance.now();
      const duration = 850;
      motion = { id: crypto.randomUUID(), from: previous, startedAt: Date.now(), duration };
      function tick(now) {
        if (!slide.classList.contains("is-active") || document.hidden) {
          stop();
          return;
        }
        const raw = Math.min(1, (now - clock) / duration), t = raw * raw * (3 - 2 * raw);
        render(interpolate(previous, target, t));
        if (raw < 1) frame = requestAnimationFrame(tick);
        else if (playing && index < config.steps.length - 1) {
          if (now - clock < (config.concept ? 6500 : 2300)) frame = requestAnimationFrame(tick);
          else move(index + 1, true);
        } else {
          playing = false;
          ui();
          frame = 0;
        }
      }
      frame = requestAnimationFrame(tick);
    }
    buttons.forEach((b, i) => b.addEventListener("click", () => move(i)));
    lab.querySelectorAll("[data-lab]").forEach((btn) =>
      btn.addEventListener("click", () => {
        switch (btn.dataset.lab) {
          case "next":
            move(index + 1);
            break;
          case "prev":
            move(index - 1);
            break;
          case "reset":
            move(0);
            break;
          case "play":
            if (playing || frame) stop();
            else {
              if (index === config.steps.length - 1) {
                index = 0;
                render(config.steps[0]);
              }
              move(index + 1, true);
            }
            break;
          case "camera":
            yaw = -.65;
            pitch = .55;
            lab.querySelector("input").value = "-37";
            render();
            break;
        }
      })
    );
    const slider = lab.querySelector("input");
    if (slider) {
      slider.addEventListener("input", () => {
        yaw = Number(slider.value) * Math.PI / 180;
        render();
      });
    }
    let drag = null;
    if (config.dimension === 3) {
      svg.addEventListener("pointerdown", (event) => {
        drag = [event.clientX, event.clientY, yaw, pitch];
        svg.setPointerCapture(event.pointerId);
      });
      svg.addEventListener("pointermove", (event) => {
        if (!drag) return;
        yaw = Math.max(-2.96, Math.min(2.96, drag[2] + (event.clientX - drag[0]) * .008));
        pitch = Math.max(.2, Math.min(1.2, drag[3] + (event.clientY - drag[1]) * .006));
        slider.value = String(yaw * 180 / Math.PI);
        render();
      });
      svg.addEventListener("pointerup", () => drag = null);
      svg.addEventListener("pointercancel", () => drag = null);
    }
    scenes.set(slide, {
      stop,
      get() {
        return { index, yaw, pitch, ...(motion ? { motion } : { visual: rendered }) };
      },
      set(v) {
        if (!v) return;
        const sameMotion = v.motion?.id && v.motion.id === motion?.id;
        yaw = v.yaw;
        pitch = v.pitch;
        if (sameMotion) { render(); return; }
        stop();
        index = Math.max(0, Math.min(v.index, config.steps.length - 1));
        motion = v.motion || null;
        const target = config.steps[index];
        if (motion && !reduced.matches) {
          const currentMotion = motion;
          const start = performance.now() - Math.max(0, Math.min(currentMotion.duration, Date.now() - currentMotion.startedAt));
          const tick = now => {
            if (motion !== currentMotion) return;
            const raw = Math.min(1, (now - start) / currentMotion.duration);
            render(interpolate(currentMotion.from, target, raw * raw * (3 - 2 * raw)));
            frame = raw < 1 ? requestAnimationFrame(tick) : 0;
          };
          tick(performance.now());
        } else render(v.visual || target);
        ui();
        const input = lab.querySelector("input");
        if (input) input.value = String(yaw * 180 / Math.PI);
      },
      reset() {
        stop();
        index = 0;
        yaw = -.65;
        pitch = .55;
        render(config.steps[0]);
        ui();
        const input = lab.querySelector("input");
        if (input) input.value = "-37";
      },
      advance() {
        if (index >= config.steps.length - 1) return false;
        move(index + 1);
        return true;
      },
      retreat() {
        if (index === 0) return false;
        move(index - 1);
        return true;
      },
      finish() {
        stop();
        index = config.steps.length - 1;
        render(config.steps[index]);
        ui();
      },
      render,
    });
    ui();
    render();
  }
  // Diagram sampul menggunakan proyeksi koordinat yang sama.
  const cover = document.createElement("div");
  cover.className = "cover-geometry";
  cover.setAttribute("aria-hidden", "true");
  const coverSvg = el("svg", { viewBox: "0 0 760 465", class: "lab__plot" });
  cover.append(coverSvg);
  document.querySelector(".slide--cover").append(cover);
  draw(coverSvg, { dimension: 3, zoom: 150 }, {
    plane: unitPlane,
    vectors: [
      V("a", [1.6, 0, 0], "x", 1),
      V("b", [0, 1.6, 0], "y", 1),
      V("v", [1, 1, 1.8], "v"),
      V("p", [1, 1, 0], "p", 2),
    ],
    segments: [[[1, 1, 1.8], [1, 1, 0]]],
  });
  window.mathScenes = {
    reset: (slide) => scenes.get(slide)?.reset(),
    get: (slide) => scenes.get(slide)?.get(),
    set: (slide, v) => scenes.get(slide)?.set(v),
    advance: (slide) => scenes.get(slide)?.advance() || false,
    retreat: (slide) => scenes.get(slide)?.retreat() || false,
    finish: (slide) => scenes.get(slide)?.finish(),
    sync: (active) =>
      scenes.forEach((s, slide) => {
        if (slide !== active) s.stop();
      }),
  };
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) scenes.forEach((s) => s.stop());
  });
  reduced.addEventListener("change", () => scenes.forEach((s) => s.stop()));
})();
