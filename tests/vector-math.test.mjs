import test from "node:test";
import assert from "node:assert/strict";
import "../public/vector-math.js";
const M = globalThis.AlinMath;
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-10, `${a} ≠ ${b}`);
const vector = (a, b) => a.forEach((v, i) => close(v, b[i]));
test("Contoh 6 sesuai PDF: koefisien 3/√2 dan −1/√2", () => {
  const a = [1, 2], u = M.unit([1, 1]), v = M.unit([1, -1]);
  close(M.dot(a, u), 3 / Math.sqrt(2));
  close(M.dot(a, v), -1 / Math.sqrt(2));
  vector(M.add(M.scale(u, M.dot(a, u)), M.scale(v, M.dot(a, v))), a);
});
test("Contoh 7: tiga vektor ortonormal sesuai PDF", () => {
  const basis = [[1, 1, 1], [0, 1, 1], [0, 0, 1]], w = M.gramSchmidt(basis);
  [M.unit([1, 1, 1]), M.unit([-2, 1, 1]), M.unit([0, -1, 1])].forEach((v, i) => vector(w[i], v));
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) close(M.dot(w[i], w[j]), Number(i === j));
  for (const v of basis) vector(M.projection(v, w), v);
});
test("Contoh 8/9: proyeksi ada di bidang dan sisa tegak lurus", () => {
  const a = [1, 0, 1],
    b = [0, 1, 1],
    x = [1, 1, 1],
    e = M.gramSchmidt([a, b]),
    p = M.projection(x, e),
    r = M.sub(x, p);
  vector(p, [2 / 3, 2 / 3, 4 / 3]);
  vector(r, [1 / 3, 1 / 3, -1 / 3]);
  close(p[2], p[0] + p[1]);
  close(M.dot(r, a), 0);
  close(M.dot(r, b), 0);
  close(M.norm(x) ** 2, M.norm(p) ** 2 + M.norm(r) ** 2);
});
test("Elipsoid norm satu memenuhi bobot 2, 1, 3", () => {
  for (let i = 0; i < 50; i++) {
    const a = i * .7, b = i * .3;
    const v = [
      Math.cos(a) * Math.cos(b) / Math.sqrt(2),
      Math.sin(a) * Math.cos(b),
      Math.sin(b) / Math.sqrt(3),
    ];
    close(2 * v[0] ** 2 + v[1] ** 2 + 3 * v[2] ** 2, 1);
  }
});
test("Basis bergantung linear dan normalisasi nol ditolak", () => {
  assert.throws(() => M.unit([0, 0, 0]));
  assert.throws(() => M.gramSchmidt([[1, 0], [2, 0]]));
});
test("Contoh 4: bentuk semidefinit tidak cukup sebagai hasil kali dalam", () => {
  const u = [0, 2, 0];
  close(u[0] ** 2 + u[2] ** 2, 0);
  assert.ok(M.norm(u) > 0);
});
