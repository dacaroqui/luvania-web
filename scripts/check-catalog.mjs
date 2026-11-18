import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const treatments = JSON.parse(readFileSync(new URL("../src/data/treatments.json", import.meta.url), "utf8"));
const slugs = treatments.map((item) => item.slug);
assert.equal(new Set(slugs).size, slugs.length, "slugs únicos");
assert.equal(treatments.filter((item) => item.inAudit44).length, 43);
assert.ok(!slugs.includes("x"), "la página basura x no se publica");

const required = [
  "hiperhidrosis",
  "sueroterapia",
  "acido-hialuronico",
  "lipo-sin-cirugia",
  "liporeductor",
  "shock-therapy-bronce",
  "detox-reductor",
  "autosanguis",
  "dercelu",
  "rinomodelacion",
  "porcelanizacion",
  "collagen-therapy",
  "hidroxiapatita-de-calcio",
];
for (const slug of required) assert.ok(slugs.includes(slug), slug);

for (const item of treatments) {
  assert.ok(item.queEs.length > 80, item.slug);
  assert.ok(item.beneficios.length >= 3, item.slug);
  assert.ok(item.faqs.length >= 2, item.slug);
  assert.ok(item.zones.length >= 1, item.slug);
  assert.ok(item.sesiones.includes("TODO") || /\d/.test(item.sesiones), item.slug);
  for (const related of item.related) assert.ok(slugs.includes(related), `${item.slug} -> ${related}`);
  const blob = JSON.stringify(item);
  assert.equal(blob.includes("Hidroxipatita"), false, item.slug);
  assert.equal(blob.includes("Collage Therapy"), false, item.slug);
  assert.equal(blob.includes("volúmen"), false, item.slug);
}

console.log(`ok ${treatments.length} tratamientos, 43/44 del inventario (x excluida)`);
