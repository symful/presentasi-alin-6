const path = Deno.env.get("ALIN_KV_PATH");
if (!path) throw new Error("ALIN_KV_PATH is required");
async function load(name: string): Promise<Record<string, string>> {
  return JSON.parse(await Deno.readTextFile(new URL(name, import.meta.url)));
}
const guides = await load("./presenter-guides.json");
const scripts = await load("./presenter-scripts.json");
const kv = await Deno.openKv(path);
try {
  for (const [slide, script] of Object.entries(scripts)) {
    const key = ["alin-notes-v1", "slide", slide];
    const marker = ["alin-notes-migrations", "provided-scripts-v4", slide];
    const seeded = ["alin-notes-migrations", "presenter-guides-v1", slide];
    for (;;) {
      const done = await kv.get(marker);
      if (done.value) break;
      const old = await kv.get<string>(key);
      const previous = await kv.get(["alin-notes-migrations", "spoken-scripts-v1", slide]);
      const supplied = await kv.get(["alin-notes-migrations", "provided-scripts-v2", slide]);
      const last = await kv.get(["alin-notes-migrations", "provided-scripts-v3", slide]);
      let extra = previous.value || supplied.value || last.value ? "" : (old.value || "").replace("PANDUAN PRESENTER\n\n" + guides[slide], "").trim();
      if (slide === "concept-metric" && extra === "Ruang vektor yang dilengkapi operasi tersebut disebut ruang hasil kali dalam.") extra = "";
      const tx = kv.atomic().check(done).check(old).set(key, script).set(marker, true).set(seeded, true);
      if (extra) tx.set(["alin-notes-v1", "slide", slide + "::sticky::" + crypto.randomUUID()], extra);
      const result = await tx.set(["alin-notes-v1", "revision"], crypto.randomUUID()).commit();
      if (result.ok) break;
    }
  }
  let verified = 0;
  for (const [slide, script] of Object.entries(scripts)) {
    if ((await kv.get(["alin-notes-v1", "slide", slide])).value === script) verified++;
  }
  if (verified !== Object.keys(scripts).length) throw new Error("Stored notes differ from supplied scripts");
  console.log(verified + "/" + Object.keys(scripts).length + " scripts match.");
} finally {
  kv.close();
}
