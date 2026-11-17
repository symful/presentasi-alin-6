/* Operasi yang dipakai bersama oleh diagram dan pemeriksaan numerik. */
(() => {
  const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
  const add = (a, b) => a.map((x, i) => x + b[i]);
  const scale = (a, s) => a.map((x) => x * s);
  const sub = (a, b) => add(a, scale(b, -1));
  const norm = (a) => Math.sqrt(dot(a, a));
  const unit = (a) => {
    const n = norm(a);
    if (n < 1e-10) throw new Error("Vektor nol tidak dapat dinormalisasi.");
    return scale(a, 1 / n);
  };
  const projection = (v, basis) =>
    basis.reduce((p, w) => add(p, scale(w, dot(v, w))), v.map(() => 0));
  const gramSchmidt = (basis) => {
    const result = [];
    for (const v of basis) result.push(unit(sub(v, projection(v, result))));
    return result;
  };
  globalThis.AlinMath = { dot, add, scale, sub, norm, unit, projection, gramSchmidt };
})();
