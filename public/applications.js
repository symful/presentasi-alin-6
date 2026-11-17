(() => {
  const topics = [
    ["concept-metric-negative", "Untuk Apa Hasil Kali Dalam?", [
      "Grafika 3D: arah cahaya dan normal permukaan menentukan terang permukaan.",
      "Simulator penerbangan: proyeksi ke arah depan menghitung kecepatan maju.",
      "Navigasi robot: proyeksi posisi ke jalur mengukur penyimpangan dari lintasan.",
    ]],
  ];
  for (const [after, title, descriptions] of topics) {
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
    ["render", "flight", "robot"].forEach((name, i) => {
      const card = document.createElement("figure");
      card.className = `application-card app-${name}`;
      const media = document.createElement("div");
      media.className = "application-image";
      const img = document.createElement("img");
      img.src = `assets/applications/${name}.png`;
      img.alt = [
        "Ilustrasi perangkat lunak grafika 3D",
        "Ilustrasi simulator penerbangan",
        "Ilustrasi perangkat lunak robotika",
      ][i];
      const movement = document.createElement("span");
      movement.className = "application-overlay";
      media.append(img, movement);
      const caption = document.createElement("figcaption");
      caption.textContent = descriptions[i];
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
