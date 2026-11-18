import test from "node:test";
import assert from "node:assert/strict";
import { protocols } from "./auth-helper.mjs";
const base = process.env.ALIN_URL || "http://localhost:8017";
const wait = async fn => { const end = Date.now()+5000; while(!fn()) { if(Date.now()>end)throw Error("timeout"); await new Promise(r=>setTimeout(r,20)); } };
test("password protects control roles and guest cannot mutate shared state or read notes", async () => {
  assert.equal((await fetch(base+"/api/session?role=host", {method:"POST",body:JSON.stringify({password:"wrong"})})).status,401);
  const url = role => base.replace(/^http/,"ws")+"/api/session?role="+role;
  const denied = new WebSocket(url("presenter"));
  await new Promise((resolve,reject)=>{denied.onerror=resolve;denied.onopen=()=>reject(Error("unauthenticated socket accepted"));});
  const hostProtocols = await protocols(base,"host");
  const crossRole = new WebSocket(url("presenter"),hostProtocols);
  await new Promise((resolve,reject)=>{crossRole.onerror=resolve;crossRole.onopen=()=>reject(Error("wrong role token accepted"));});
  const p = new WebSocket(url("presenter"),await protocols(base,"presenter")), g = new WebSocket(url("guest"));
  const messages=[];g.onmessage=e=>messages.push(JSON.parse(e.data));
  try {
    await Promise.all([p,g].map(ws=>new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject})));
    await wait(()=>messages.some(m=>m.type==="state"));
    const id=crypto.randomUUID();
    const stroke={id,color:"#123456",width:4,slide:198,points:[[1,1],[2,2]]};
    g.send(JSON.stringify({type:"stroke",stroke}));
    g.send(JSON.stringify({type:"view",view:{slide:190,revealed:0}}));
    g.send(JSON.stringify({type:"note",key:"unauthorized",text:"guest",editId:"bad"}));
    p.send(JSON.stringify({type:"note",key:"guest-secret-test",text:"private",editId:"ok"}));
    g.send(JSON.stringify({type:"ping"}));await wait(()=>messages.some(m=>m.type==="pong"));
    await new Promise(r=>setTimeout(r,300));
    assert(!messages.some(m=>m.type==="notes"));
    assert(!messages.some(m=>m.type==="state"&&(m.view.slide===190||m.ink.some(s=>s.id===id))));
    p.send(JSON.stringify({type:"stroke",stroke}));
    await wait(()=>messages.some(m=>m.type==="state"&&m.ink.some(s=>s.id===id)));
  } finally {p.close();g.close();}
});
