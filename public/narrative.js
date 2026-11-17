/* Alur penjelasan mengikuti contoh ALIN-6; ilustrasi aplikasi bukan soal tambahan. */
(() => {
  const entries = {
    6: [
      "Diketahui vektor u = (3,4).",
      "Berapa panjang u dari titik asal sampai ujung panah?",
      "Norm u adalah 5. Nilai ini berasal dari komponen mendatar 3 dan komponen tegak 4.",
      "Dalam perangkat lunak navigasi, norm selisih posisi dipakai untuk mengukur jarak ke tujuan.",
    ],
    7: [
      "Diketahui u = (3,1) dan v = (1,2).",
      "Berapa nilai hasil kali dalam Euclides ⟨u,v⟩ untuk pasangan ini?",
      "Hasilnya 5: komponen pertama menyumbang 3, komponen kedua menyumbang 2. Hasil kali dalam ini berupa bilangan, bukan panah baru.",
      "Dalam grafika 3D, dot product antara arah cahaya dan normal permukaan dipakai dalam model pencahayaan Lambert.",
    ],
    8: [
      "Diberikan operasi ⟨u,v⟩ = 2u₁v₁ + u₂v₂ + 3u₃v₃.",
      "Apakah operasi berbobot ini memenuhi keempat aksioma hasil kali dalam?",
      "Keempat aksioma terpenuhi. Normnya adalah √(2u₁²+u₂²+3u₃²); permukaan norm satu berbentuk elipsoid.",
      "Dalam pemodelan galat pengukuran, bobot positif memberi pengaruh berbeda pada setiap komponen galat.",
    ],
    12: [
      "Perhatikan dua vektor u dan v pada bidang Euclides.",
      "Apa bedanya pasangan ortogonal dan pasangan ortonormal?",
      "Hasil kali dalam nol berarti ortogonal. Jika norm masing-masing juga satu, pasangan tersebut ortonormal.",
      "Dalam kamera 3D, arah kanan, atas, dan pandang dapat memakai basis ortonormal.",
    ],
    13: [
      "Dosen memberikan tiga himpunan vektor: A, B, dan C.",
      "Untuk setiap himpunan, apakah vektornya tegak lurus dan bernorm satu?",
      "A tidak ortogonal karena hasil kali dalamnya −1. B dan C ortonormal karena hasil kali dalam pasangan nol dan setiap norm satu.",
      "Basis kamera dapat dimiringkan tanpa kehilangan sifat ortonormal, asalkan arah-arahnya tetap tegak lurus dan bernorm satu.",
    ],
    15: [
      "Diketahui a = (1,2) dan basis ortonormal u, v pada gambar.",
      "Berapa bagian a pada arah u dan pada arah v?",
      "Dua komponennya adalah (3/2,3/2) dan (−1/2,1/2). Penjumlahannya kembali menjadi a = (1,2).",
      "Dalam perangkat lunak simulasi penerbangan, vektor gerak dapat dinyatakan menurut arah depan, samping, dan atas pesawat.",
    ],
    17: [
      "Diketahui dua vektor basis yang belum saling tegak lurus.",
      "Bagaimana membuat basis ortonormal tanpa mengubah ruang yang dibangun?",
      "Proyeksi dibuang agar vektor kedua tegak lurus terhadap yang pertama. Normalisasi kemudian membuat setiap norm menjadi satu.",
      "Gram–Schmidt dapat digunakan untuk menyusun basis ortonormal dalam algoritma faktorisasi QR.",
    ],
    18: [
      "Contoh 7 dimulai dari c₁=(1,1,1), c₂=(0,1,1), dan c₃=(0,0,1).",
      "Bagaimana memperoleh w₁ dan w₂ yang saling tegak lurus dan bernorm satu?",
      "w₁=(1,1,1)/√3 dan w₂=(−2,1,1)/√6. Vektor ketiga belum selesai; pembentukannya dilanjutkan pada slide berikutnya.",
      "Dua arah pertama ini menjadi acuan untuk menghilangkan komponen sejajar dari vektor ketiga.",
    ],
    19: [
      "w₁ dan w₂ sudah diperoleh pada slide sebelumnya. Sekarang gunakan c₃=(0,0,1).",
      "Bagian mana dari c₃ yang masih sejajar w₁ dan w₂?",
      "Setelah kedua proyeksi dikurangi dan sisanya dinormalisasi, diperoleh w₃=(0,−1,1)/√2. Ketiga vektor membentuk basis ortonormal.",
      "Basis ortonormal tiga dimensi dapat menjadi kerangka koordinat dalam simulasi gerak benda.",
    ],
    20: [
      "Vektor x berada di luar bidang W pada gambar.",
      "Bagian mana dari x yang terletak pada bidang W?",
      "Proyeksi p berada di bidang. Sisa r tegak lurus bidang, dan p+r kembali menghasilkan x.",
      "Dalam pemodelan galat, proyeksi memisahkan hasil pendekatan pada subruang dari sisa galatnya.",
    ],
    21: [
      "Pada Contoh 8, bidang W dibangun oleh a=(1,0,1) dan b=(0,1,1).",
      "Basis ortonormal mana yang dapat dipakai untuk menghitung proyeksi pada W?",
      "Diperoleh e₁=(1,0,1)/√2 dan e₂=(−1,2,1)/√6. Keduanya tetap berada di W, saling tegak lurus, dan bernorm satu.",
      "Basis ini memudahkan perangkat lunak menghitung komponen vektor pada sebuah bidang.",
    ],
    22: [
      "Gunakan basis ortonormal bidang W yang baru diperoleh dan x=(1,1,1).",
      "Di manakah proyeksi x pada bidang tersebut?",
      "Proyeksi p=(2/3,2/3,4/3). Sisa r=(1/3,1/3,−1/3) tegak lurus bidang; penjumlahan p+r sama dengan x.",
      "Prinsip ini dipakai dalam pendekatan kuadrat terkecil: memilih hasil pendekatan di subruang dengan galat terkecil.",
    ],
  };
  globalThis.AlinNarrative = (configs) => {
    for (const [key, meta] of Object.entries(entries)) {
      const c = configs[key];
      if (!c) continue;
      const first = c.steps[0], last = c.steps.at(-1);
      c.application = meta[3];
      c.intro = meta[0];
      const given = {
        ...first,
        heading: "Diketahui",
        explain: meta[0],
        formula: key === "8"
          ? "⟨u,v⟩ = 2u₁v₁ + u₂v₂ + 3u₃v₃"
          : "Perhatikan nama dan arah setiap vektor pada gambar.",
      };
      const question = {
        ...first,
        heading: "Yang akan dicari",
        explain: meta[1],
        formula: "Bagian yang dihitung akan ditunjukkan pada tahap berikutnya.",
      };
      const end = {
        ...last,
        heading: "Hasil dan artinya",
        explain: meta[2],
        formula: last.formula,
        conclusion: true,
      };
      c.steps = [given, question, ...c.steps, end];
    }
    const insertBefore = (key, title, items) => {
      const c = configs[key], i = c.steps.findIndex((s) => s.heading === title);
      if (i < 0) throw new Error("Missing narrative anchor: " + title);
      const base = c.steps[Math.max(0, i - 1)];
      c.steps.splice(
        i,
        0,
        ...items.map(([heading, explain, formula, vectors]) => ({
          ...base,
          heading,
          explain,
          formula,
          vectors: vectors || base.vectors,
        })),
      );
    };
    const V = (id, to, label, kind = 0, from = [0, 0, 0]) => ({ id, to, label, kind, from });
    insertBefore(18, "Normalisasi vektor pertama", [
      [
        "Hitung norm c₁",
        "Ketiga komponen c₁ masing-masing satu. Kuadratkan, jumlahkan, kemudian ambil akarnya.",
        "‖c₁‖ = √(1² + 1² + 1²) = √3",
      ],
    ]);
    insertBefore(18, "Tentukan proyeksi c₂", [
      [
        "Hitung koefisien pada w₁",
        "Komponen c₂ dikalikan dengan komponen w₁ yang bersesuaian. Jumlahnya menentukan bagian c₂ pada arah w₁.",
        "⟨c₂,w₁⟩ = (0×1 + 1×1 + 1×1)/√3\n= 2/√3",
      ],
    ]);
    insertBefore(18, "Kurangi lalu normalisasi", [
      [
        "Kurangi proyeksi dari c₂",
        "Kurangi ketiga komponen secara berurutan. Sisa ini sudah tegak lurus w₁, tetapi normnya belum satu.",
        "u₂ = (0,1,1) − (2/3,2/3,2/3)\n= (−2/3,1/3,1/3)",
        [
          V("c1", [1 / Math.sqrt(3), 1 / Math.sqrt(3), 1 / Math.sqrt(3)], "w₁"),
          V("c2", [-2 / 3, 1 / 3, 1 / 3], "u₂"),
        ],
      ],
      [
        "Hitung norm sisa",
        "Norm u₂ akan menjadi pembagi saat normalisasi.",
        "‖u₂‖ = √(4/9 + 1/9 + 1/9)\n= √6/3",
        [V("c2", [-2 / 3, 1 / 3, 1 / 3], "u₂")],
      ],
    ]);
    insertBefore(19, "Kurangi kedua proyeksi", [
      [
        "Koefisien c₃ pada dua arah",
        "Karena c₃=(0,0,1), hanya komponen ketiga dari masing-masing basis yang menyumbang pada hasil kali dalam.",
        "⟨c₃,w₁⟩ = 1/√3\n⟨c₃,w₂⟩ = 1/√6",
      ],
      [
        "Jumlahkan dua proyeksinya",
        "Kalikan tiap koefisien dengan vektor basisnya, lalu jumlahkan. Inilah bagian c₃ yang berada pada bidang dua basis pertama.",
        "p₃ = (1/3,1/3,1/3) + (−1/3,1/6,1/6)\n= (0,1/2,1/2)",
      ],
    ]);
    insertBefore(19, "Tiga arah ortonormal", [
      [
        "Norm sisa untuk normalisasi",
        "Setelah proyeksi dikurangi, u₃=(0,−1/2,1/2). Norm inilah yang dipakai untuk memperoleh w₃.",
        "‖u₃‖ = √(0 + 1/4 + 1/4) = 1/√2",
      ],
    ]);
    insertBefore(21, "Ortogonalisasi dan normalisasi b", [
      [
        "Hitung bagian b pada e₁",
        "Kalikan komponen b=(0,1,1) dengan e₁=(1,0,1)/√2.",
        "⟨b,e₁⟩ = (0×1 + 1×0 + 1×1)/√2\n= 1/√2",
      ],
      [
        "Kurangi bagian sejajar",
        "Proyeksi b adalah (1/2,0,1/2). Setelah dikurangi, sisa b′ tegak lurus e₁.",
        "b′ = (0,1,1) − (1/2,0,1/2)\n= (−1/2,1,1/2)",
        [V("a", [1 / Math.sqrt(2), 0, 1 / Math.sqrt(2)], "e₁"), V("b", [-.5, 1, .5], "b′")],
      ],
      [
        "Hitung norm b′",
        "Norm b′ diperoleh dari jumlah kuadrat ketiga komponennya.",
        "‖b′‖ = √(1/4 + 1 + 1/4) = √6/2",
        [V("b", [-.5, 1, .5], "b′")],
      ],
    ]);
    insertBefore(22, "Jumlahkan komponen basis", [
      [
        "Koefisien pada e₁",
        "Gunakan x=(1,1,1) dan e₁=(1,0,1)/√2.",
        "⟨x,e₁⟩ = (1×1 + 1×0 + 1×1)/√2\n= 2/√2 = √2",
      ],
      [
        "Koefisien pada e₂",
        "Gunakan e₂=(−1,2,1)/√6. Setiap komponen x dikalikan dengan komponen e₂.",
        "⟨x,e₂⟩ = (−1 + 2 + 1)/√6\n= 2/√6",
      ],
      [
        "Bentuk kedua komponen proyeksi",
        "Koefisien adalah bilangan. Kalikan dengan basis untuk memperoleh vektor komponen.",
        "√2 e₁ = (1,0,1)\n(2/√6)e₂ = (−1/3,2/3,1/3)",
        [
          V("x", [1, 1, 1], "x"),
          V("part1", [1, 0, 1], "komponen 1", 1),
          V("part2", [-1 / 3, 2 / 3, 1 / 3], "komponen 2", 2),
        ],
      ],
    ]);
    const norm = configs[6];
    norm.steps[0].vectors = norm.steps[1].vectors = [{
      id: "u",
      from: [0, 0, 0],
      to: [3, 4, 0],
      label: "u",
      kind: 1,
    }];
    norm.steps[0].formula = "u = (3,4)";
    norm.steps[1].formula = "‖u‖ = √⟨u,u⟩";
    const c = configs[7], vecs = c.steps[0].vectors;
    c.steps = [
      { ...c.steps[0], formula: "u = (3,1)\nv = (1,2)" },
      { ...c.steps[1], formula: "⟨u,v⟩ = u₁v₁ + u₂v₂" },
      {
        heading: "Pisahkan komponen mendatar",
        explain:
          "Garis putus-putus menunjukkan komponen mendatar. Komponen u adalah 3, sedangkan komponen v adalah 1. Kalikan kedua komponen yang searah ini.",
        formula: "u₁v₁ = 3 × 1 = 3",
        vectors: vecs,
        segments: [[[3, 1, 0], [3, 0, 0]], [[1, 2, 0], [1, 0, 0]]],
        highlight: "x",
      },
      {
        heading: "Pisahkan komponen tegak",
        explain:
          "Sekarang perhatikan komponen tegak: u mempunyai komponen 1 dan v mempunyai komponen 2. Hasil kalinya adalah 2.",
        formula: "u₂v₂ = 1 × 2 = 2",
        vectors: vecs,
        segments: [[[3, 1, 0], [0, 1, 0]], [[1, 2, 0], [0, 2, 0]]],
        highlight: "y",
      },
      {
        heading: "Jumlahkan kedua hasil",
        explain:
          "Kontribusi mendatar adalah 3 dan kontribusi tegak adalah 2. Jumlah keduanya merupakan hasil kali dalam Euclides.",
        formula: "⟨u,v⟩ = (3 × 1) + (1 × 2)\n= 3 + 2 = 5",
        vectors: vecs,
      },
      {
        ...c.steps.at(-1),
        vectors: vecs,
        formula: "⟨u,v⟩ = 5\nHasilnya bilangan real, bukan vektor.",
      },
    ];
  };
})();
