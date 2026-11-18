import { dirname } from "@std/path";

const path = Deno.args[0] || Deno.env.get("ALIN_KV_PATH");
if (!path) throw new Error("ALIN_KV_PATH is required, or pass the KV path as the first argument");
await Deno.mkdir(dirname(path), { recursive: true });
const guides: Record<string, string> = JSON.parse(
  await Deno.readTextFile(new URL("./presenter-guides.json", import.meta.url)),
);
const kv = await Deno.openKv(path);
try {
  for (const [slide, guide] of Object.entries(guides)) {
    const key = ["alin-notes-v1", "slide", slide];
    const marker = ["alin-notes-migrations", "presenter-guides-v1", slide];
    for (;;) {
      const done = await kv.get(marker);
      if (done.value) break;
      const old = await kv.get<string>(key);
      const text = (old.value ? old.value + "\n\n" : "") + "PANDUAN PRESENTER\n\n" + guide;
      if (text.length > 12000) throw new Error("Notes exceed editor limit: " + slide);
      const result = await kv.atomic().check(done).check(old).set(key, text).set(marker, true)
        .set(["alin-notes-v1", "revision"], crypto.randomUUID()).commit();
      if (result.ok) break;
    }
  }
  console.log("28 slide guides seeded, preserving existing notes.");
} finally {
  kv.close();
}
