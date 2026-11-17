// One shared presentation per deployment; KV coordinates all server instances.
export type View = {
  slide: number;
  scene?: { index: number; yaw: number; pitch: number };
  revealed: number;
};
type Stroke = { id: string; color: string; width: number; points: number[][]; slide: number };
type Shared = { view: View; ink: Stroke[]; redo: Stroke[]; revision: number; sender?: string };
const deployed = Boolean(Deno.env.get("DENO_DEPLOY") || Deno.env.get("DENO_DEPLOYMENT_ID"));
if (!deployed) await Deno.mkdir(".runtime", { recursive: true });
const kv = await Deno.openKv(
  Deno.env.get("ALIN_KV_PATH") || (deployed ? undefined : ".runtime/shared-v2.sqlite"),
);
const rootKey = ["alin-live-v3", "state"];
const partKey = (i: number) => ["alin-live-v3", "part", i];
const presenceKey = (id: string) => ["alin-live-v3", "presence", id];
const previewKey = ["alin-live-v3", "preview"];
const clients = new Map<WebSocket, { id: string; role: string }>();
const initial = (): Shared => ({ view: { slide: 0, revealed: 0 }, ink: [], redo: [], revision: 0 });
const json = (value: unknown, status = 200) =>
  Response.json(value, { status, headers: { "Cache-Control": "no-store" } });
async function load() {
  for (;;) {
    const root = await kv.get<{ parts: number }>(rootKey);
    if (!root.value) return { root, data: initial() };
    const pieces = await Promise.all(
      Array.from({ length: root.value.parts }, (_, i) => kv.get<string>(partKey(i))),
    );
    if ((await kv.get(rootKey)).versionstamp !== root.versionstamp) continue;
    return { root, data: JSON.parse(pieces.map((p) => p.value).join("")) as Shared };
  }
}
async function change(m: Record<string, unknown>) {
  for (let attempt = 0; attempt < 30; attempt++) {
    const { root, data: r } = await load();
    if (!mutate(r, m)) return;
    r.revision++;
    r.sender = typeof m.sender === "string" ? m.sender : undefined;
    const serialized = JSON.stringify(r);
    if (new TextEncoder().encode(serialized).length > 700000) {
      throw Error("Whiteboard penuh. Hapus coretan yang tidak diperlukan.");
    }
    const parts = serialized.match(/[\s\S]{1,12000}/g) || [];
    let tx = kv.atomic().check(root).set(rootKey, { parts: parts.length });
    for (let i = 0; i < parts.length; i++) tx = tx.set(partKey(i), parts[i]);
    for (let i = parts.length; i < (root.value?.parts || 0); i++) tx = tx.delete(partKey(i));
    if ((await tx.commit()).ok) return r;
  }
  throw Error("Kontrol sedang sibuk; coba kembali.");
}
let presence = { hosts: 0, presenters: 0 };
async function broadcast(updated?: Shared) {
  if (!clients.size) return;
  const data = updated || (await load()).data;
  if (updated) {
    const message = JSON.stringify({ type: "state", ...data, ...presence });
    for (const s of clients.keys()) if (s.readyState === 1) s.send(message);
    return;
  }
  let hosts = 0, presenters = 0;
  for await (
    const entry of kv.list<{ role: string; time: number }>({ prefix: ["alin-live-v3", "presence"] })
  ) {
    if (Date.now() - entry.value.time > 45000) continue;
    if (entry.value.role === "host") hosts++;
    else presenters++;
  }
  presence = { hosts, presenters };
  const message = JSON.stringify({ type: "state", ...data, hosts, presenters });
  for (const s of clients.keys()) if (s.readyState === 1) s.send(message);
}
const notesRoot = ["alin-notes-v1", "revision"];
async function broadcastNotes(target?: WebSocket) {
  let notes: Record<string, string> = {}, version: string | null = null;
  for (;;) {
    const before = await kv.get(notesRoot);
    notes = {};
    for await (const entry of kv.list<string>({ prefix: ["alin-notes-v1", "slide"] })) {
      notes[String(entry.key[2])] = entry.value;
    }
    const after = await kv.get(notesRoot);
    if (before.versionstamp === after.versionstamp) {
      version = after.versionstamp;
      break;
    }
  }
  const message = JSON.stringify({ type: "notes", notes, version });
  for (const [socket, client] of clients) {
    if (client.role === "presenter" && socket.readyState === 1 && (!target || socket === target)) {
      socket.send(message);
    }
  }
}
(async () => {
  for await (const _ of kv.watch([notesRoot])) await broadcastNotes();
})().catch(console.error);
let notesVersion: string | null = null;
setInterval(async () => {
  if (![...clients.values()].some((c) => c.role === "presenter")) return;
  try {
    const entry = await kv.get(notesRoot);
    if (entry.versionstamp !== notesVersion) {
      notesVersion = entry.versionstamp;
      await broadcastNotes();
    }
  } catch (e) {
    console.error("Notes refresh failed", e);
  }
}, 500);
async function watch() {
  let previousRoot: string | null = null;
  for await (const entries of kv.watch([rootKey, previewKey])) {
    if (entries[0].versionstamp !== previousRoot) {
      previousRoot = entries[0].versionstamp;
      await broadcast();
    }
    const preview = entries[1].value as { at?: number } | null;
    if (preview && Date.now() - (preview.at || 0) < 1000) {
      for (const s of clients.keys()) if (s.readyState === 1) s.send(JSON.stringify(preview));
    }
  }
}
watch().catch((e) => {
  console.error("Session watch failed", e);
  for (const s of clients.keys()) s.close(1011, "Reconnect");
});
setInterval(() => broadcast().catch(console.error), 5000);
// Local SQLite watchers may not notify a second process. Also recovers missed watch events.
let observedVersion: string | null = null;
setInterval(async () => {
  if (!clients.size) return;
  try {
    const entry = await kv.get(rootKey);
    if (entry.versionstamp !== observedVersion) {
      observedVersion = entry.versionstamp;
      await broadcast();
    }
  } catch (e) {
    console.error("Session refresh failed", e);
  }
}, 250);
function validMotion(scene: unknown) {
  const m = (scene as {
    motion?: { id: string; startedAt: number; duration: number; from: { vectors: unknown[] } };
  })?.motion;
  return !m || (typeof m.id === "string" && m.id.length <= 80 && Number.isFinite(m.startedAt) &&
    m.duration === 850 && Array.isArray(m.from?.vectors) && JSON.stringify(m).length < 30000);
}
function validView(v: View) {
  return v && validMotion(v.scene) && Number.isInteger(v.slide) && v.slide >= 0 && v.slide < 200 &&
    Number.isInteger(v.revealed) && v.revealed >= 0 && v.revealed < 200 &&
    (!v.scene ||
      (Number.isInteger(v.scene.index) && v.scene.index >= 0 && v.scene.index < 100 &&
        Number.isFinite(v.scene.yaw) && Math.abs(v.scene.yaw) <= 3.2 &&
        Number.isFinite(v.scene.pitch) && v.scene.pitch >= .1 && v.scene.pitch <= 1.5 &&
        (!((v.scene as unknown as { visual?: unknown }).visual) ||
          JSON.stringify((v.scene as unknown as { visual?: unknown }).visual).length < 30000)));
}

function mutate(r: Shared, m: Record<string, unknown>) {
  if (m.type === "view" && validView(m.view as View)) r.view = m.view as View;
  else if (m.type === "stroke") {
    const s = m.stroke as Stroke;
    if (
      !s || typeof s.id !== "string" || s.id.length > 80 || !/^#[0-9a-f]{6}$/i.test(s.color) ||
      !Number.isFinite(s.width) || s.width < 1 || s.width > 30 || !Number.isInteger(s.slide) ||
      s.slide < 0 || s.slide >= 200 || !Array.isArray(s.points) || s.points.length < 1 ||
      s.points.length > 2000 || !s.points.every((p) =>
        Array.isArray(p) && p.length === 2 && p.every((x) =>
          Number.isFinite(x) && x >= 0 && x <= 1600
        )
      )
    ) return false;
    if (r.ink.length >= 2000) return false;
    if (!r.ink.some((x) => x.id === s.id)) {
      r.ink.push(s);
      r.redo = [];
    }
  } else if (m.type === "undo") {
    const i = r.ink.findLastIndex((s) => s.slide === r.view.slide);
    if (i >= 0) r.redo.push(...r.ink.splice(i, 1));
  } else if (m.type === "redo") {
    const i = r.redo.findLastIndex((s) => s.slide === r.view.slide);
    if (i >= 0) r.ink.push(...r.redo.splice(i, 1));
  } else if (m.type === "erase") {
    const i = r.ink.findIndex((s) => s.id === m.id && s.slide === r.view.slide);
    if (i >= 0) r.redo.push(...r.ink.splice(i, 1));
  } else if (m.type === "clear") {
    r.redo.push(...r.ink.filter((s) => s.slide === r.view.slide));
    r.ink = r.ink.filter((s) => s.slide !== r.view.slide);
  } else return false;

  return true;
}
export function sessionRoute(request: Request): Response | undefined {
  const url = new URL(request.url);
  if (url.pathname === "/api/health") {
    return json({ ok: true, service: "alin-session", version: 2, session: "shared" });
  }
  if (!url.pathname.startsWith("/api/")) return;
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== url.host && origin !== Deno.env.get("PUBLIC_URL")) {
    return json({ error: "Origin mismatch" }, 403);
  }
  if (url.pathname !== "/api/session") {
    return json({ error: "Gunakan satu alamat presentasi dan pilih peran." }, 404);
  }
  const role = url.searchParams.get("role");
  if (role !== "host" && role !== "presenter") {
    return json({ error: "Pilih Host atau Presenter." }, 400);
  }
  if (request.headers.get("upgrade")?.toLowerCase() !== "websocket") {
    return json({ role, session: "shared" });
  }
  const { socket, response } = Deno.upgradeWebSocket(request);
  const id = crypto.randomUUID();
  const heartbeat = () => kv.set(presenceKey(id), { role, time: Date.now() }, { expireIn: 60000 });
  socket.onopen = async () => {
    clients.set(socket, { id, role });
    await heartbeat();
    await broadcast();
    if (role === "presenter") await broadcastNotes(socket);
  };
  socket.onclose = async () => {
    clients.delete(socket);
    await kv.delete(presenceKey(id));
    await broadcast();
  };
  socket.onerror = () => {
    try {
      socket.close();
    } catch { /* closed */ }
  };
  let queue = Promise.resolve();
  socket.onmessage = (event) => {
    if (typeof event.data !== "string" || event.data.length > 500000) {
      socket.close(1009);
      return;
    }
    queue = queue.then(async () => {
      const m = JSON.parse(event.data);
      if (m.type === "ping") {
        await heartbeat();
        if (socket.readyState === 1) socket.send('{"type":"pong"}');
        return;
      }
      if (m.type === "note") {
        if (role !== "presenter") return;
        if (
          typeof m.key !== "string" || !m.key.length || m.key.length > 200 ||
          typeof m.text !== "string" || new TextEncoder().encode(m.text).length > 50000 ||
          typeof m.editId !== "string" || m.editId.length > 80
        ) throw Error("Catatan tidak sah atau terlalu panjang.");
        const committed = await kv.atomic().set(["alin-notes-v1", "slide", m.key], m.text).set(
          notesRoot,
          crypto.randomUUID(),
        ).commit();
        if (!committed.ok) throw Error("Catatan belum tersimpan; coba kembali.");
        if (socket.readyState === 1) {
          socket.send(
            JSON.stringify({
              type: "note-saved",
              key: m.key,
              editId: m.editId,
              version: committed.versionstamp,
            }),
          );
        }
        await broadcastNotes();
        return;
      }
      if (m.type === "preview") {
        // Use the same stroke validator; previews are transient, final strokes durable.
        if (mutate(initial(), { ...m, type: "stroke" })) {
          for (const peer of clients.keys()) {
            if (peer !== socket && peer.readyState === 1) {
              peer.send(JSON.stringify({ ...m, at: Date.now() }));
            }
          }
          await kv.set(previewKey, {
            type: "preview",
            stroke: m.stroke,
            sender: m.sender,
            at: Date.now(),
          }, { expireIn: 2000 });
        }
      } else {
        const updated = await change(m);
        if (updated) await broadcast(updated);
      }
    }).catch((e) => {
      if (socket.readyState === 1) {
        socket.send(JSON.stringify({ type: "error", message: e.message }));
      }
    });
  };
  return response;
}
