(() => {
  let ownsControl = false;
  let lastSeen = Date.now();
  for (const name of ["keydown", "pointerdown", "input", "click"]) {
    document.addEventListener(name, (e) => {
      if (e.isTrusted && !e.target.closest("#session-panel,#session-badge,#role-picker")) {
        ownsControl = true;
      }
    }, true);
  }
  const sender = crypto.randomUUID();
  let role = "local",
    socket = null,
    online = false,
    applying = false,
    last = "",
    revision = -1,
    ink = [],
    redo = [],
    stroke = null,
    mode = "off",
    color = "#c53243",
    width = 4,
    retry = 0;
  const panel = document.createElement("dialog");
  panel.id = "session-panel";
  panel.innerHTML =
    `<header><h2>Sesi & Whiteboard</h2><button id="settings-close">Tutup · S</button></header><p id="session-status" role="status">Mode lokal</p><p id="session-members"></p><button id="change-role">Ganti peran</button><label>Alamat presentasi<input id="shared-link" readonly></label><button data-copy="shared-link">Salin alamat</button><p id="network-note"></p><hr><h3>Whiteboard</h3><div class="settings-tools"><button data-mode="off">Navigasi</button><button data-mode="pen">Pena</button><button data-mode="eraser">Penghapus</button><label>Warna <input id="ink-color" type="color" value="#c53243"></label><label>Ketebalan <input id="ink-width" type="range" min="1" max="20" value="4"></label></div><div class="settings-tools"><button data-ink="undo">Undo · Ctrl+Z</button><button data-ink="redo">Redo · Ctrl+Y</button><button data-ink="clear">Hapus coretan slide</button></div><p>Tekan S untuk menutup panel. Coretan disimpan per slide selama sesi aktif.</p>`;
  document.body.append(panel);
  const board = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  board.id = "whiteboard";
  board.setAttribute("viewBox", "0 0 1600 900");
  board.setAttribute("aria-label", "Whiteboard presentasi");
  document.querySelector("#deck").append(board);
  const badge = document.createElement("button");
  badge.id = "session-badge";
  badge.textContent = "S · Pengaturan";
  badge.title = "Pengaturan sesi dan whiteboard";
  document.body.append(badge);
  const status = panel.querySelector("#session-status"),
    members = panel.querySelector("#session-members");
  function toggle() {
    if (picker.open) return;
    panel.open ? panel.close() : panel.showModal();
  }
  badge.onclick = toggle;
  panel.querySelector("#settings-close").onclick = () => panel.close();
  function setStatus(text) {
    status.textContent = text;
    badge.textContent = role === "local"
      ? "S · Pengaturan"
      : `${online ? "●" : "○"} ${role === "host" ? "Host" : "Presenter"} · S`;
    badge.dataset.offline = String(!online && role !== "local");
  }
  function send(data) {
    if (role === "local") {
      localInk(data);
      return;
    }
    if (online && role !== "local") socket.send(JSON.stringify({ ...data, sender }));
  }
  function draw(preview) {
    board.replaceChildren();
    const slide = window.deckAPI.get().slide;
    for (const s of [...ink, ...(preview ? [preview] : [])]) {
      if (s.slide !== slide) continue;
      const path = document.createElementNS(board.namespaceURI, "polyline");
      path.setAttribute("points", s.points.map((p) => p.join(",")).join(" "));
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", s.color);
      path.setAttribute("stroke-width", s.width);
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-linejoin", "round");
      path.dataset.id = s.id;
      board.append(path);
    }
  }
  function localInk(m) {
    const slide = window.deckAPI.get().slide;
    if (m.type === "stroke") {
      ink.push(m.stroke);
      redo = [];
    }
    if (m.type === "undo") {
      const i = ink.findLastIndex((s) => s.slide === slide);
      if (i >= 0) redo.push(...ink.splice(i, 1));
    }
    if (m.type === "redo") {
      const i = redo.findLastIndex((s) => s.slide === slide);
      if (i >= 0) ink.push(...redo.splice(i, 1));
    }
    if (m.type === "erase") {
      const i = ink.findIndex((s) => s.id === m.id);
      if (i >= 0) redo.push(...ink.splice(i, 1));
    }
    if (m.type === "clear") {
      redo.push(...ink.filter((s) => s.slide === slide));
      ink = ink.filter((s) => s.slide !== slide);
    }
    draw();
  }
  async function connect() {
    if (role === "local") return;
    clearTimeout(retry);
    setStatus("Menghubungkan…");
    const u = new URL("/api/session", location.href);
    u.protocol = location.protocol === "https:" ? "wss:" : "ws:";
    u.searchParams.set("role", role);
    try {
      const endpoint = new URL(u);
      endpoint.protocol = location.protocol;
      const response = await fetch(endpoint);
      if (response.ok) {
        const info = await response.json();
        role = info.role;

      } else {
        setStatus("Server sesi belum tersedia. Pastikan server Deno dan database KV telah diaktifkan.");
        return;
      }
    } catch {
      setStatus("Server tidak dapat dijangkau; mencoba lagi…");
      retry = setTimeout(connect, 2500);
      return;
    }
    socket = new WebSocket(u);
    socket.onopen = () => {
      online = true;
      revision = -1;
      lastSeen = Date.now();
      setStatus(`Terhubung sebagai ${role}.`);
    };
    socket.onmessage = (e) => {
      lastSeen = Date.now();
      const m = JSON.parse(e.data);
      if (m.type === "pong") return;
      if (m.type === "error") { setStatus(m.message); return; }
      if (m.type === "preview") {
        if (m.sender !== sender) draw(m.stroke);
        return;
      }
      if (m.type !== "state") return;
      if (m.revision < revision) return;
      const sameRevision = m.revision === revision;
      revision = m.revision;
      members.textContent = `Terhubung: ${m.hosts} host · ${m.presenters} presenter`;
      if (sameRevision) return;
      ink = m.ink;
      applying = true;
      if (m.sender !== sender) {
        ownsControl = false;
        window.deckAPI.set(m.view);
      }
      last = JSON.stringify(window.deckAPI.get());
      draw();
      applying = false;
    };
    socket.onclose = () => {
      online = false;
      window.mathScenes?.sync(null);
      setStatus("Terputus — mencoba menyambung ulang. Kontrol sesi dinonaktifkan.");
      retry = setTimeout(connect, 2500);
    };
    socket.onerror = () => setStatus("Koneksi gagal. Pastikan server sesi masih berjalan.");
  }
  const sharedUrl = new URL(location.href);
  sharedUrl.search = "";
  sharedUrl.hash = "";
  panel.querySelector("#shared-link").value = sharedUrl.href;
  const picker = document.createElement("dialog");
  picker.id = "role-picker";
  picker.setAttribute("aria-labelledby", "role-title");
  picker.innerHTML = `<p class="role-kicker">ALJABAR LINEAR · D4 2B</p><h1 id="role-title">Bergabung ke presentasi</h1><p>Satu presentasi bersama. Pilih peran untuk perangkat ini.</p><div class="role-options"><button data-role="host"><strong>Host</strong><span>Bagikan layar dan kendalikan slide, animasi, serta whiteboard.</span></button><button data-role="presenter"><strong>Presenter</strong><span>Kendalikan slide, animasi, dan whiteboard bersama presenter lain.</span></button></div><p class="role-note">Host dan presenter memiliki kontrol yang sama dalam satu sesi.</p><button id="local-preview">Pratinjau sendiri tanpa sinkronisasi</button>`;
  document.body.append(picker);
  picker.addEventListener("cancel", e => e.preventDefault());
  function disconnect() {
    clearTimeout(retry); online = false; ownsControl = false; mode = "off";
    board.style.pointerEvents = "none";
    if (socket) { socket.onclose = null; socket.close(); socket = null; }
    window.mathScenes?.sync(null);
  }
  picker.querySelectorAll("[data-role]").forEach(b => b.onclick = () => {
    disconnect(); role = b.dataset.role; revision = -1; picker.close();
    panel.querySelectorAll("[data-mode],[data-ink],#ink-color,#ink-width").forEach(x => x.disabled = false);
    connect();
  });
  picker.querySelector("#local-preview").onclick = () => {
    disconnect(); role = "local"; picker.close(); setStatus("Pratinjau sendiri — tidak terhubung ke sesi bersama.");
    panel.querySelectorAll("[data-mode],[data-ink],#ink-color,#ink-width").forEach(x => x.disabled = false);
  };
  panel.querySelector("#change-role").onclick = () => { disconnect(); panel.close(); picker.showModal(); };
  panel.querySelectorAll("[data-copy]").forEach((b) =>
    b.onclick = async () => {
      const input = panel.querySelector("#" + b.dataset.copy);
      try {
        await navigator.clipboard.writeText(input.value);
        b.textContent = "Tersalin";
      } catch {
        input.select();
        setStatus("Salin teks tautan yang dipilih.");
      }
    }
  );
  panel.querySelector("#network-note").textContent =
    ["localhost", "127.0.0.1"].includes(location.hostname)
      ? "Alamat ini hanya untuk komputer ini. Untuk perangkat teman, buka aplikasi melalui alamat server publik terlebih dahulu, lalu pilih peran."
      : "Bagikan alamat yang sama kepada semua peserta. Tidak perlu membuat ruang atau tautan khusus.";
  panel.querySelectorAll("[data-mode]").forEach((b) =>
    b.onclick = () => {
      mode = b.dataset.mode;
      board.style.pointerEvents = mode === "off" ? "none" : "auto";
      board.style.cursor = "crosshair";
      panel.querySelectorAll("[data-mode]").forEach((x) =>
        x.setAttribute("aria-pressed", String(x === b))
      );
    }
  );
  panel.querySelector("#ink-color").oninput = (e) => color = e.target.value;
  panel.querySelector("#ink-width").oninput = (e) => width = Number(e.target.value);
  panel.querySelectorAll("[data-ink]").forEach((b) =>
    b.onclick = () => send({ type: b.dataset.ink })
  );
  const point = (e) => {
    const r = board.getBoundingClientRect();
    return [
      Math.max(0, Math.min(1600, (e.clientX - r.left) * 1600 / r.width)),
      Math.max(0, Math.min(900, (e.clientY - r.top) * 900 / r.height)),
    ];
  };
  board.onpointerdown = (e) => {
    if (role !== "local" && !online) return;
    const p = point(e);
    if (mode === "eraser") {
      const slide = window.deckAPI.get().slide;
      const hit = ink.findLast((s) =>
        s.slide === slide && s.points.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < 25)
      );
      if (hit) send({ type: "erase", id: hit.id });
      return;
    }
    if (mode !== "pen") return;
    board.setPointerCapture(e.pointerId);
    stroke = {
      id: crypto.randomUUID(),
      color,
      width,
      slide: window.deckAPI.get().slide,
      points: [p],
    };
    draw(stroke);
  };
  let previewAt = 0;
  board.onpointermove = (e) => {
    if (!stroke) return;
    if (stroke.points.length < 1999) stroke.points.push(point(e));
    draw(stroke);
    if (role !== "local" && online && Date.now() - previewAt > 80) {
      previewAt = Date.now();
      send({ type: "preview", stroke });
    }
  };
  board.onpointerup = () => {
    if (!stroke) return;
    if (stroke.points.length === 1) {
      stroke.points.push([stroke.points[0][0] + .1, stroke.points[0][1]]);
    }
    send({ type: "stroke", stroke });
    stroke = null;
  };
  board.onpointercancel = () => {
    stroke = null;
    draw();
  };
  document.addEventListener("keydown", (e) => {
    if (
      e.target.closest("textarea,select,input:not([type=color]):not([type=range]):not([readonly])")
    ) return;
    if (e.key.toLowerCase() === "s" && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      e.stopImmediatePropagation();
      toggle();
      return;
    }
    if (panel.open || picker.open) {
      e.stopImmediatePropagation();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && ["z", "y"].includes(e.key.toLowerCase())) {
      e.preventDefault();
      e.stopImmediatePropagation();
      send({ type: e.key.toLowerCase() === "y" || e.shiftKey ? "redo" : "undo" });
      return;
    }
    if (
      (role !== "local" && !online) && !["f", "F", "Escape"].includes(e.key)
    ) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);
  document.addEventListener("pointerdown", (e) => {
    if (
      (role !== "local" && !online) && !panel.contains(e.target) && !picker.contains(e.target) &&
      e.target !== badge && !e.target.closest('[data-act="fullscreen"]')
    ) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);
  document.addEventListener("click", (e) => {
    if (
      (role !== "local" && !online) && !panel.contains(e.target) && !picker.contains(e.target) &&
      e.target !== badge && !e.target.closest('[data-act="fullscreen"]')
    ) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  }, true);
  setInterval(() => {
    const v = JSON.stringify(window.deckAPI.get());
    if (v !== last) {
      last = v;
      draw(stroke);
      if (!applying && ownsControl && role !== "local" && online) {
        send({ type: "view", view: JSON.parse(v) });
      }
    }
  }, 80);
  setInterval(() => {
    if (online) {
      if (Date.now() - lastSeen > 45000) {
        socket.close();
        return;
      }
      socket.send('{"type":"ping"}');
    }
  }, 15000);
  setStatus("Pilih peran untuk bergabung.");
  if (!new URLSearchParams(location.search).has("all")) picker.showModal();
})();
