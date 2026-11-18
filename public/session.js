(() => {
  let ownsControl = false;
  let lastSeen = Date.now();
  for (const name of ["keydown", "pointerdown", "input", "click"]) {
    document.addEventListener(name, (e) => {
      if (e.isTrusted && !e.target.closest("#session-panel,#session-badge,#role-picker,#presenter-notes")) {
        ownsControl = true;
      }
    }, true);
  }
  const sender = crypto.randomUUID();
  let authToken = "";
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
    color2 = "#1f4bff",
    width = 4,
    retry = 0;
  const panel = document.createElement("dialog");
  panel.id = "session-panel";
  panel.innerHTML =
    `<header><h2>Sesi & Whiteboard</h2><button id="settings-close">Tutup · S</button></header><p id="session-status" role="status">Mode lokal</p><p id="session-members"></p><button id="change-role">Ganti peran</button><label>Alamat presentasi<input id="shared-link" readonly></label><button data-copy="shared-link">Salin alamat</button><p id="network-note"></p><hr><h3>Whiteboard</h3><div class="settings-tools"><button data-mode="off">Navigasi</button><button data-mode="pen">Pena</button><button data-mode="eraser">Penghapus</button><label>Pena 1 · drag kiri <input id="ink-color" type="color" value="#c53243"></label><label>Pena 2 · Ctrl + drag kiri <input id="ink-color-2" type="color" value="#1f4bff"></label><label>Ketebalan <input id="ink-width" type="range" min="1" max="20" value="4"></label></div><div class="settings-tools"><button data-ink="undo">Undo · Ctrl+Z</button><button data-ink="redo">Redo · Ctrl+Y</button><button data-ink="clear">Hapus coretan slide</button></div><p>Tekan S untuk menutup panel. Coretan disimpan per slide selama sesi aktif.</p>`;
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
      : `${online ? "●" : "○"} ${role === "host" ? "Host" : role === "guest" ? "Guest" : "Presenter"} · S`;
    badge.dataset.offline = String(!online && role !== "local");
  }
  function send(data) {
    if (role === "guest") return;
    if (role === "local") {
      localInk(data);
      return;
    }
    if (online && role !== "local") socket.send(JSON.stringify({ ...data, sender }));
  }
  function draw(preview) {
    const existing = new Map([...board.children].map(path => [path.dataset.id, path]));
    const keep = new Set();
    const slide = window.deckAPI.get().slide;
    for (const s of [...ink, ...(preview && !ink.some(s => s.id === preview.id) ? [preview] : [])]) {
      if (s.slide !== slide) continue;
      keep.add(s.id);
      const path = existing.get(s.id) || document.createElementNS(board.namespaceURI, "polyline");
      path.setAttribute("points", s.points.map((p) => p.join(",")).join(" "));
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", s.color);
      path.setAttribute("stroke-width", s.width);
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-linejoin", "round");
      path.dataset.id = s.id;
      if (!path.parentNode) board.append(path);
    }
    for (const [id, path] of existing) if (!keep.has(id)) path.remove();
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
    socket = role === "guest" ? new WebSocket(u) : new WebSocket(u, ["alin-session", "token." + authToken]);
    socket.onopen = () => {
      online = true;
      revision = -1;
      lastSeen = Date.now();
      setStatus(`Terhubung sebagai ${role}.`);
      if (role === "presenter") for (const [key, edit] of pendingNotes) send({ type: "note", key, ...edit });
    };
    socket.onmessage = (e) => {
      lastSeen = Date.now();
      const m = JSON.parse(e.data);
      if (m.type === "pong") return;
      if (m.type === "notes" && role === "presenter") {
        if ((m.version || "") < notesVersion) return;
        notesVersion = m.version || ""; sharedNotes = m.notes; notesReady = true; loadNote(true); return;
      }
      if (m.type === "note-saved" && role === "presenter") {
        if (pendingNotes.get(m.key)?.editId === m.editId) {
          const saved = pendingNotes.get(m.key); sharedNotes[m.key] = saved.text;
          if (m.version > notesVersion) notesVersion = m.version;
          pendingNotes.delete(m.key); loadNote(true);
        }
        return;
      }
      if (m.type === "error") { setStatus(m.message); return; }
      if (m.type === "preview") {
        if (m.sender !== sender) draw(m.stroke);
        return;
      }
      if (m.type !== "state") return;
      if (m.revision < revision) return;
      const sameRevision = m.revision === revision;
      revision = m.revision;
      members.textContent = `Terhubung: ${m.hosts} host · ${m.presenters} presenter · ${m.guests || 0} guest`;
      if (sameRevision) return;
      ink = m.ink;
      applying = true;
      if (m.sender !== sender && role !== "guest") {
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
  picker.innerHTML = `<p class="role-kicker">ALJABAR LINEAR · D4 2B</p><h1 id="role-title">Bergabung ke presentasi</h1><p>Satu presentasi bersama. Pilih peran untuk perangkat ini.</p><div class="role-options"><button data-role="host"><strong>Host</strong><span>Bagikan layar dan kendalikan slide, animasi, serta whiteboard.</span></button><button data-role="presenter"><strong>Presenter</strong><span>Kendalikan slide, animasi, dan whiteboard bersama presenter lain.</span></button><button data-role="guest"><strong>Guest</strong><span>Jelajahi slide sendiri dan lihat coretan. Tidak mengendalikan sesi bersama.</span></button></div><label class="role-password">Password host / presenter<input id="role-password" type="password" autocomplete="current-password"></label><p id="role-error" role="alert"></p><p class="role-note">Host dan presenter memiliki kontrol yang sama dalam satu sesi.</p><button id="local-preview">Pratinjau sendiri tanpa sinkronisasi</button>`;
  document.body.append(picker);
  picker.addEventListener("cancel", e => e.preventDefault());
  const preparation = document.createElement("p");
  preparation.setAttribute("role", "status");
  preparation.textContent = "Menyiapkan gambar dan font…";
  picker.append(preparation);
  const roleButtons = [...picker.querySelectorAll("button")];
  roleButtons.forEach(b => b.disabled = true);
  Promise.allSettled([...document.images].map(img => img.decode()).concat([document.fonts.ready])).then(results => {
    preparation.textContent = results.some(r => r.status === "rejected")
      ? "Sebagian gambar gagal dimuat. Muat ulang halaman untuk mencoba kembali."
      : "Gambar dan font siap. Pilih peran untuk mulai.";
    roleButtons.forEach(b => b.disabled = false);
  });
  let notePanel = null, noteKey = "", sharedNotes = {}, notesReady = false, notesVersion = "";
  const pendingNotes = new Map(), noteCards = new Map();
  const noteValue = key => pendingNotes.get(key)?.text ?? sharedNotes[key] ?? "";
  function saveNote(key, text) {
    if (!online || !notesReady || role !== "presenter") return;
    const edit = { text, editId: crypto.randomUUID() };
    pendingNotes.set(key, edit);
    send({ type: "note", key, ...edit });
  }
  function closeNotes() {
    notePanel?.remove(); notePanel = null; noteKey = ""; noteCards.clear();
  }
  function noteSlide() {
    const slide = document.querySelector(".slide.is-active");
    return { key: slide.dataset.scene || slide.dataset.title, title: slide.querySelector("h2")?.textContent || slide.dataset.title };
  }
  function positionCard(card, geometry) {
    const width = Math.min(window.innerWidth, Math.max(260, geometry.width || 420));
    const height = Math.min(window.innerHeight, Math.max(220, geometry.height || 470));
    const x = Math.max(0, Math.min(geometry.x || 0, window.innerWidth - width));
    const y = Math.max(0, Math.min(geometry.y || 0, window.innerHeight - height));
    Object.assign(card.style, {left: x+'px', top: y+'px', width: width+'px', height: height+'px'});
  }
  function makeNoteCard(key, index, title) {
    const card = document.createElement("aside"); card.className = "presenter-sticky"; card.dataset.key = key;
    card.innerHTML = `<header><strong>Notes · W</strong><button data-add aria-label="Tambahkan sticky note">+</button><button data-close aria-label="Tutup semua notes">×</button></header><h3></h3><textarea maxlength="12000" aria-label="Catatan untuk slide ini" placeholder="Tulis catatan di sini…"></textarea><p role="status"></p><button class="note-resize" aria-label="Seret untuk mengubah ukuran">◢</button>`;
    card.querySelector('h3').textContent = title + (index ? ' · Catatan '+(index+1) : '');
    notePanel.append(card);
    const entry = {card, editor:card.querySelector('textarea'), manipulating:false, layout:""};
    noteCards.set(key, entry);
    positionCard(card, {x:window.innerWidth-450-index*35,y:45+index*35,width:420,height:470});
    card.querySelector('[data-close]').onclick = closeNotes;
    card.querySelector('[data-add]').onclick = () => {
      const newKey = noteKey+'::sticky::'+crypto.randomUUID();
      saveNote(newKey, ' '); loadNote(true);
      noteCards.get(newKey)?.editor.focus();
    };
    entry.editor.oninput = () => saveNote(key, entry.editor.value || (key.includes('::sticky::') ? ' ' : ''));
    entry.editor.addEventListener('keydown', e => {if(e.key==='Escape'){e.stopPropagation();closeNotes();}});
    function gesture(handle, resizing) {
      let drag = null;
      handle.addEventListener('pointerdown', e => {
        if(e.button!==0 || !e.isPrimary || (!resizing && e.target.closest('button')) || !online || !notesReady) return;
        const r=card.getBoundingClientRect(); drag={id:e.pointerId,x:e.clientX,y:e.clientY,left:r.left,top:r.top,width:r.width,height:r.height};
        entry.manipulating=true; handle.setPointerCapture(e.pointerId); e.preventDefault();
      });
      handle.addEventListener('pointermove', e => {
        if(drag?.id!==e.pointerId)return;
        const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
        positionCard(card,{x:drag.left+(resizing?0:dx),y:drag.top+(resizing?0:dy),width:drag.width+(resizing?dx:0),height:drag.height+(resizing?dy:0)});
      });
      const end=e=>{
        if(drag?.id!==e.pointerId)return;
        drag=null; entry.manipulating=false;
        const r=card.getBoundingClientRect();
        saveNote(key+'::layout',JSON.stringify({x:r.left,y:r.top,width:r.width,height:r.height}));
        if(handle.hasPointerCapture(e.pointerId))handle.releasePointerCapture(e.pointerId);
      };
      handle.addEventListener('pointerup',end);handle.addEventListener('pointercancel',end);handle.addEventListener('lostpointercapture',end);
    }
    gesture(card.querySelector('header'),false);gesture(card.querySelector('.note-resize'),true);
    return entry;
  }
  function loadNote(force = false) {
    if (!notePanel || role !== 'presenter') return;
    const current=noteSlide();
    if(current.key!==noteKey){notePanel.replaceChildren();noteCards.clear();noteKey=current.key;}
    const prefix=noteKey+'::sticky::';
    const extra=[...new Set([...Object.keys(sharedNotes),...pendingNotes.keys()])].filter(k=>k.startsWith(prefix)&&!k.endsWith('::layout')&&noteValue(k)!=='').sort();
    const keys=[noteKey,...extra];
    for(const [key,entry] of noteCards)if(!keys.includes(key)){entry.card.remove();noteCards.delete(key);}
    keys.forEach((key,index)=>{
      const entry=noteCards.get(key)||makeNoteCard(key,index,current.title);
      const text=noteValue(key);
      if(entry.editor.value!==text)entry.editor.value=text;
      entry.editor.disabled=!online||!notesReady;
      entry.card.querySelector('[data-add]').disabled=!online||!notesReady;
      const layout=noteValue(key+'::layout');
      if(layout && layout!==entry.layout && !entry.manipulating){
        try {const g=JSON.parse(layout);if(['x','y','width','height'].every(k=>Number.isFinite(g[k])))positionCard(entry.card,g);entry.layout=layout;}catch{}
      }
      entry.card.querySelector('[role=status]').textContent=!online?'Terputus — menunggu koneksi':!notesReady?'Memuat notes…':pendingNotes.has(key)||pendingNotes.has(key+'::layout')?'Menyimpan…':'Tersimpan · dibagikan hanya ke presenter';
    });
  }
  window.addEventListener('resize',()=>{for(const {card} of noteCards.values()){const r=card.getBoundingClientRect();positionCard(card,{x:r.left,y:r.top,width:r.width,height:r.height});}});
  function toggleNotes() {
    if(role!=='presenter'||picker.open)return;
    if(notePanel){closeNotes();return;}
    notePanel=document.createElement('div');notePanel.id='presenter-notes';notePanel.setAttribute('aria-label','Catatan bersama presenter');document.body.append(notePanel);loadNote(true);
  }
  setInterval(() => {
    if (role !== "presenter") closeNotes();
    else loadNote();
  }, 100);
  function disconnect() {
    closeNotes(); sharedNotes = {}; notesReady = false; notesVersion = ""; pendingNotes.clear();
    clearTimeout(retry); online = false; ownsControl = false; mode = "off";
    board.style.pointerEvents = "none";
    if (socket) { socket.onclose = null; socket.close(); socket = null; }
    window.mathScenes?.sync(null);
  }
  picker.querySelectorAll("[data-role]").forEach(b => b.onclick = async () => {
    const selected = b.dataset.role;
    const error = picker.querySelector("#role-error");
    error.textContent = "";
    let token = "";
    if (selected !== "guest") {
      roleButtons.forEach(button => button.disabled = true);
      try {
        const response = await fetch(`/api/session?role=${selected}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: picker.querySelector("#role-password").value }) });
        const result = await response.json();
        if (!response.ok) { error.textContent = result.error || "Tidak dapat masuk."; return; }
        token = result.token;
      } catch { error.textContent = "Server tidak dapat dijangkau."; return; }
      finally { roleButtons.forEach(button => button.disabled = false); }
    }
    disconnect(); authToken = token; role = selected; revision = -1;
    picker.querySelector("#role-password").value = "";
    picker.close();
    panel.querySelectorAll("[data-mode],[data-ink],#ink-color,#ink-color-2,#ink-width").forEach(x => x.disabled = role === "guest");
    connect();
  });
  picker.querySelector("#local-preview").onclick = () => {
    disconnect(); role = "local"; picker.close(); setStatus("Pratinjau sendiri — tidak terhubung ke sesi bersama.");
    panel.querySelectorAll("[data-mode],[data-ink],#ink-color,#ink-color-2,#ink-width").forEach(x => x.disabled = false);
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
  panel.querySelector("#ink-color-2").oninput = (e) => color2 = e.target.value;
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
    if (e.button !== 0 || role === "guest") return;
    if (role !== "local" && role !== "guest" && !online) return;
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
      color: e.ctrlKey ? color2 : color,
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
    if (e.key.toLowerCase() === "w" && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault(); e.stopImmediatePropagation(); toggleNotes(); return;
    }
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
      (role !== "local" && role !== "guest" && !online) && !["f", "F", "Escape"].includes(e.key)
    ) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);
  document.addEventListener("pointerdown", (e) => {
    if (
      (role !== "local" && role !== "guest" && !online) && !panel.contains(e.target) && !picker.contains(e.target) && !e.target.closest("#presenter-notes") &&
      e.target !== badge && !e.target.closest('[data-act="fullscreen"]')
    ) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);
  document.addEventListener("click", (e) => {
    if (
      (role !== "local" && role !== "guest" && !online) && !panel.contains(e.target) && !picker.contains(e.target) && !e.target.closest("#presenter-notes") &&
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
      if (!applying && ownsControl && role !== "local" && role !== "guest" && online) {
        send({ type: "view", view: JSON.parse(v) });
      }
    }
  }, 16);
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
