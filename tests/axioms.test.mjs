import test from "node:test";
import assert from "node:assert/strict";
const dot = (a, b, w = [1, 1, 1]) => a.reduce((s, x, i) => s + x * b[i] * w[i], 0);
test("opening distinguishes projection length 4, vertical component 3, and b length 2", () => {
  const a = [4, 3], b = [2, 0];
  assert.equal(dot(a, b), 8);
  assert.equal(dot(a, b) / Math.hypot(...b), 4);
});
test("axiom examples and weighted examples agree with their diagrams", () => {
  assert.equal(dot([2, 1], [1, 3]), 5);
  assert.equal(dot([1, 3], [2, 1]), 5);
  assert.equal(dot([2, 1], [1, 2]), 4);
  assert.equal(dot([3, 3], [1, 0]), 3);
  const w = [2, 1, 3], u = [1, 1, 0], v = [2, 0, 1], r = [0, 1, 1];
  assert.equal(dot(u, v, w), 4);
  assert.equal(dot(u.map((x, i) => x + v[i]), r, w), 4);
  assert.equal(dot(u, r, w) + dot(v, r, w), 4);
  assert.equal(dot(u.map((x) => 2 * x), v, w), 8);
  assert.equal(dot(u, u, w), 3);
});
test("negative and degenerate forms violate positive definiteness", () => {
  assert.equal(dot([1, 0, 2], [1, 0, 2], [1, 2, -3]), -11);
  assert.equal(dot([0, 2, 0], [0, 2, 0], [1, 0, 1]), 0);
});
