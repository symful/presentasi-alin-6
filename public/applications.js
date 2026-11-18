(() => {
  const topics = [
    ["concept-metric-negative", "Untuk Apa Hasil Kali Dalam?", [
      ["light", "Pencahayaan 3D: arah cahaya dibandingkan dengan arah permukaan untuk menentukan terang dan gelap."],
      ["reflect", "Pantulan cahaya: hasil kali dalam membantu menghitung arah pantulan pada permukaan."],
      ["vision", "Musuh dalam game: hasil kali dalam dipakai untuk memeriksa apakah pemain berada di depannya."],
    ]],
    ["6", "Untuk Apa Norm?", [
      ["distance", "Tekstur Blender: jarak dari sebuah titik menentukan perubahan warna pada permukaan."],
      ["speed", "Gerak dalam game: norm vektor kecepatan menentukan seberapa cepat karakter bergerak."],
      ["normalize", "Arah pada shader: vektor dibagi normnya agar panjangnya menjadi satu tanpa mengubah arah."],
    ]],
  ];
  for (const [after, title, examples] of topics) {
    const anchor = document.querySelector(`[data-scene="${after}"]`);
    if (!anchor) continue;
    const section = document.createElement("section");
    section.className = "slide slide--applications";
    section.dataset.title = title;
    const inner = document.createElement("div");
    inner.className = "slide__inner";
    const h = document.createElement("h2");
    h.textContent = title;
    inner.append(h);
    const grid = document.createElement("div");
    grid.className = "application-cards";
    examples.forEach(([name, description]) => {
      const card = document.createElement("figure");
      card.className = `application-card app-${name}`;
      const media = document.createElement("div");
      media.className = "application-image";
      const img = document.createElement("img");
      img.src = `assets/applications/source-${name}.png`;
      img.alt = `Gambar dokumentasi resmi: ${description}`;
      media.append(img);
      const caption = document.createElement("figcaption");
      caption.textContent = description;
      card.append(media, caption);
      grid.append(card);
    });
    inner.append(grid);
    section.append(inner);
    anchor.after(section);
  }
  [...document.querySelectorAll(".slide")].forEach((slide, i) =>
    slide.dataset.chapter = `Bab VI / ${String(i + 1).padStart(2, "0")}`
  );
})();
