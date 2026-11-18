import { protocols } from "./auth-helper.mjs";
import test from "node:test";
import assert from "node:assert/strict";
const base = process.env.ALIN_URL || "http://localhost:8017";
const wait = async (fn) => { const end=Date.now()+7000; while(!fn()) { if(Date.now()>end) throw Error("notes timeout"); await new Promise(r=>setTimeout(r,25)); } };
test("shared notes persist across reconnect and are never delivered to hosts", async()=>{
 const peers=[];
 const connect=async(role)=>{const u=new URL('/api/session?role='+role,base);u.protocol=u.protocol==='https:'?'wss:':'ws:';const ws=new WebSocket(u, await protocols(base, role)),p={ws,messages:[]};peers.push(p);ws.onmessage=e=>p.messages.push(JSON.parse(e.data));await new Promise((res,rej)=>{ws.onopen=res;ws.onerror=rej});return p};
 const key='test-notes-'+crypto.randomUUID(),secret='Catatan bersama '+crypto.randomUUID();
 try {
 const p=await connect('presenter'),q=await connect('presenter'),h=await connect('host');
 p.ws.send(JSON.stringify({type:'note',key,text:secret,editId:'1'}));
 await wait(()=>q.messages.some(m=>m.type==='notes'&&m.notes[key]===secret));
 assert(!h.messages.some(m=>m.type==='notes'||JSON.stringify(m).includes(secret)));
 h.ws.send(JSON.stringify({type:'note',key,text:'host overwrite',editId:'2'}));
 const r=await connect('presenter');await wait(()=>r.messages.some(m=>m.type==='notes'&&m.notes[key]===secret));
 q.ws.send(JSON.stringify({type:'note',key,text:secret+' revisi',editId:'3'}));await wait(()=>p.messages.some(m=>m.type==='notes'&&m.notes[key]===secret+' revisi'));
 p.ws.send(JSON.stringify({type:'note',key:key+'-other',text:'slide lain',editId:'4'}));await wait(()=>q.messages.some(m=>m.type==='notes'&&m.notes[key+'-other']==='slide lain'&&m.notes[key]===secret+' revisi'));
 assert(!h.messages.some(m=>m.type==='notes'));
 } finally { for(const p of peers)p.ws.close(); }
});
