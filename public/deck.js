// Navigasi presentasi: papan ketik, tombol, geser, daftar isi, layar penuh.
const slides = Array.from(document.querySelectorAll(".slide"));
const fill = document.querySelector(".hud__fill");
const count = document.querySelector(".hud__count");
const toc = document.querySelector(".toc");
const tocGrid = document.querySelector(".toc__grid");
const deck = document.querySelector("#deck");
const hudRow = document.querySelector(".hud__row");

const PANGGUNG_LEBAR = 1600;
const PANGGUNG_TINGGI = 900;

let current = 0;
let sentuhX = 0;
let sentuhY = 0;

function tampilkan(index) {
  const changed = current !== index;
  current = Math.max(0, Math.min(index, slides.length - 1));

  slides.forEach((slide, i) => {
    const aktif = i === current;
    slide.classList.toggle("is-active", aktif);
    slide.setAttribute("aria-hidden", aktif ? "false" : "true");
    slide.inert = !aktif;
  });

  fill.style.width = `${((current + 1) / slides.length) * 100}%`;
  count.innerHTML = `<b>${String(current + 1).padStart(2, "0")}</b><span>/</span>${String(slides.length).padStart(2, "0")}`;
  document.title = `${slides[current].dataset.title} | Aljabar Linear Pertemuan 6`;

  history.replaceState(null, "", `#${current + 1}`);
  tandaiDaftarIsi();
  slides[current].scrollTop = 0;
  window.mathScenes?.sync(slides[current]);
  if(changed){window.mathScenes?.reset(slides[current]);slides[current].querySelectorAll(".frag").forEach(e=>e.classList.remove("on"));}
  if (new URLSearchParams(location.search).has("all")) tampilSemua(slides[current]);
}

function belumTampil(slide) {
  return Array.from(slide.querySelectorAll(".frag:not(.on)"));
}

function tampilSemua(slide) {
  slide.querySelectorAll(".frag").forEach((el) => el.classList.add("on"));
  window.mathScenes?.finish(slide);
}

function maju() {
  if (window.mathScenes?.advance(slides[current])) return;
  const sisa = belumTampil(slides[current]);
  if (sisa.length) {
    sisa[0].classList.add("on");
    return;
  }
  if (current < slides.length - 1) tampilkan(current + 1);
}

function mundur() {
  if (window.mathScenes?.retreat(slides[current])) return;
  const aktif = Array.from(slides[current].querySelectorAll(".frag.on"));
  if (aktif.length) {
    aktif[aktif.length - 1].classList.remove("on");
    return;
  }
  if (current > 0) {
    tampilkan(current - 1);
  }
}

function bukaDaftarIsi() {
  toc.hidden = false;
  tandaiDaftarIsi();
}

function tutupDaftarIsi() {
  toc.hidden = true;
}

function tandaiDaftarIsi() {
  tocGrid.querySelectorAll(".toc__item").forEach((item, i) => {
    item.classList.toggle("is-current", i === current);
  });
}

function ukurPanggung() {
  const tinggiTersedia = window.innerHeight - hudRow.offsetHeight;
  const skala = Math.min(
    window.innerWidth / PANGGUNG_LEBAR,
    tinggiTersedia / PANGGUNG_TINGGI,
  );
  deck.style.top = `${tinggiTersedia / 2}px`;
  deck.style.setProperty("--scale", String(skala));
}

async function alihkanLayarPenuh() {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  } catch {
    // Browser menolak mode layar penuh; tidak ada yang perlu dilakukan.
  }
}

slides.forEach((slide, i) => {
  const tombol = document.createElement("button");
  tombol.className = "toc__item";
  tombol.type = "button";
  tombol.innerHTML = `<span class="toc__no">${String(i + 1).padStart(2, "0")}</span>${
    slide.dataset.title ?? "Slide"
  }`;
  tombol.addEventListener("click", () => {
    tampilkan(i);
    tutupDaftarIsi();
  });
  tocGrid.appendChild(tombol);
});

document.addEventListener("keydown", (event) => {
  if (event.target.closest("input, textarea, select, [contenteditable]")) return;
  const k = event.key;
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.target.closest("button") && [" ", "Enter"].includes(k)) return;

  if (k === "Escape") {
    if (!toc.hidden) tutupDaftarIsi();
    return;
  }
  if (!toc.hidden && !["t", "T", "o", "O"].includes(k)) return;
  if (k === "t" || k === "T" || k === "o" || k === "O") {
    event.preventDefault();
    toc.hidden ? bukaDaftarIsi() : tutupDaftarIsi();
    return;
  }
  if (k === "f" || k === "F") {
    event.preventDefault();
    alihkanLayarPenuh();
    return;
  }

  if (["ArrowRight", "ArrowDown", "PageDown", " ", "Enter", "n", "d", "D"].includes(k)) {
    event.preventDefault();
    maju();
  } else if (["ArrowLeft", "ArrowUp", "PageUp", "Backspace", "p", "a", "A"].includes(k)) {
    event.preventDefault();
    mundur();
  } else if (k === "Home") {
    event.preventDefault();
    tampilkan(0);
  } else if (k === "End") {
    event.preventDefault();
    tampilkan(slides.length - 1);
    tampilSemua(slides[current]);
  }
});

document.querySelectorAll("[data-act]").forEach((tombol) => {
  tombol.addEventListener("click", () => {
    const aksi = tombol.dataset.act;
    if (aksi === "next") maju();
    if (aksi === "prev") mundur();
    if (aksi === "toc") (toc.hidden ? bukaDaftarIsi() : tutupDaftarIsi());
    if (aksi === "fullscreen") alihkanLayarPenuh();
  });
});

toc.addEventListener("click", (event) => {
  if (event.target === toc) tutupDaftarIsi();
});

document.addEventListener("touchstart", (event) => {
  if (event.target.closest(".lab, .toc, .hud")) { sentuhX = NaN; return; }
  sentuhX = event.changedTouches[0].clientX;
  sentuhY = event.changedTouches[0].clientY;
}, { passive: true });

document.addEventListener("touchend", (event) => {
  if (!Number.isFinite(sentuhX)) return;
  const selisihX = event.changedTouches[0].clientX - sentuhX;
  const selisihY = event.changedTouches[0].clientY - sentuhY;
  if (Math.abs(selisihX) < 60 || Math.abs(selisihX) < Math.abs(selisihY)) return;
  selisihX < 0 ? maju() : mundur();
}, { passive: true });

window.addEventListener("hashchange", () => {
  const nomor = Number(location.hash.replace("#", ""));
  if (nomor >= 1 && nomor <= slides.length && nomor - 1 !== current) tampilkan(nomor - 1);
});

ukurPanggung();
window.addEventListener("resize", ukurPanggung);
window.addEventListener("fullscreenchange", ukurPanggung);

const awal = Number(location.hash.replace("#", ""));
tampilkan(Number.isFinite(awal) && awal > 0 ? awal - 1 : 0);

if (new URLSearchParams(location.search).has("all")) tampilSemua(slides[current]);

window.deckAPI={get(){return {slide:current,scene:window.mathScenes?.get(slides[current]),revealed:slides[current].querySelectorAll('.frag.on').length};},set(v){if(current!==v.slide)tampilkan(v.slide);window.mathScenes?.set(slides[current],v.scene);slides[current].querySelectorAll('.frag').forEach((e,i)=>e.classList.toggle('on',i<v.revealed));}};
