export async function protocols(base, role) {
  if (role === "guest") return [];
  const response = await fetch(new URL("/api/session?role=" + role, base), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: process.env.ALIN_PASSWORD }) });
  if (!response.ok) throw Error("Set ALIN_PASSWORD to the configured session password before running integration tests.");
  return ["alin-session", "token." + (await response.json()).token];
}
