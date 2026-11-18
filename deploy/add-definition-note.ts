const path = Deno.env.get("ALIN_KV_PATH");
if (!path) throw new Error("ALIN_KV_PATH must point to the existing database");
const kv = await Deno.openKv(path);
const key = ["alin-notes-v1", "slide", "concept-metric"];
const marker = ["alin-notes-migrations", "rhd-definition-20261117"];
const sentence = "Ruang vektor yang dilengkapi operasi tersebut disebut ruang hasil kali dalam.";
for (;;) {
  const done = await kv.get(marker);
  if (done.value) break;
  const old = await kv.get<string>(key);
  const text = old.value || "";
  const updated = text.includes(sentence) ? text : text + (text ? "\n\n" : "") + sentence;
  const result = await kv.atomic().check(done).check(old)
    .set(key, updated).set(marker, true)
    .set(["alin-notes-v1", "revision"], crypto.randomUUID()).commit();
  if (result.ok) break;
}
kv.close();
console.log("Presenter note preserved and definition added.");
