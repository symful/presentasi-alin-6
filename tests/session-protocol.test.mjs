import { protocols } from "./auth-helper.mjs";
import test from "node:test";
import assert from "node:assert/strict";
const base = process.env.ALIN_URL || "http://localhost:8016";
test("one shared session: multiple hosts, presenters and undo/redo", async () => {
  assert.equal((await fetch(base + "/api/session?role=wrong")).status, 400);
  const peers = [];
  const connect = async (role, origin = base) => {
    const url = new URL("/api/session", origin);
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    url.searchParams.set("role", role);
    const ws = new WebSocket(url, await protocols(base, role));
    const peer = { ws, state: null };
    peers.push(peer);
    ws.addEventListener("message", (e) => {
      const m = JSON.parse(e.data);
      if (m.type === "state") peer.state = m;
    });
    await new Promise((res, rej) => {
      ws.addEventListener("open", res, { once: true });
      ws.addEventListener("error", rej, { once: true });
    });
    return peer;
  };
  const wait = async (fn) => {
    const until = Date.now() + 5000;
    while (!fn()) {
      if (Date.now() > until) throw Error("state timeout");
      await new Promise((r) => setTimeout(r, 20));
    }
  };
  try {
    const h = await connect("host"), p = await connect("presenter"), q = await connect("presenter");
    const h2 = await connect("host", process.env.ALIN_SECOND_URL || base);
    await wait(() => h.state?.presenters >= 2 && h.state?.hosts >= 2);
    p.ws.send(JSON.stringify({ type: "view", view: { slide: 3, revealed: 0 }, sender: "test" }));
    await wait(() => h.state?.view.slide === 3 && q.state?.view.slide === 3 && h2.state?.view.slide === 3);
    h.ws.send(JSON.stringify({ type: "view", view: { slide: 9, revealed: 0 } }));
    await new Promise((r) => setTimeout(r, 100));
    await wait(() => h.state.view.slide === 9 && q.state.view.slide === 9);
    h.ws.send(JSON.stringify({ type: "view", view: { slide: 3, revealed: 0 } }));
    await wait(() => h.state.view.slide === 3);
    p.ws.send('{"type":"clear"}');
    await wait(() => h.state.ink.filter(s => s.slide === 3).length === 0);
    p.ws.send(
      JSON.stringify({
        type: "stroke",
        stroke: {
          id: crypto.randomUUID(),
          color: "#15804a",
          width: 4,
          slide: 3,
          points: [[10, 20], [30, 40]],
        },
      }),
    );
    await wait(() => h.state.ink.filter(s => s.slide === 3).length === 1 && h2.state.ink.filter(s => s.slide === 3).length === 1);
    q.ws.send('{"type":"undo"}');
    await wait(() => h.state.ink.filter(s => s.slide === 3).length === 0);
    p.ws.send('{"type":"redo"}');
    await wait(() => h.state.ink.filter(s => s.slide === 3).length === 1 && h2.state.ink.filter(s => s.slide === 3).length === 1);
  } finally {
    peers.forEach((p) => p.ws.close());
  }
});
