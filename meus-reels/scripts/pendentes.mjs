// Lista as pautas que ainda não têm roteiro e valida os roteiros existentes.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validarRoteiro } from "./validar.mjs";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pautas = JSON.parse(fs.readFileSync(path.join(RAIZ, "pautas.json"), "utf8"));
let ruins = 0;
for (const p of pautas) {
  const arq = path.join(RAIZ, "roteiros", `${p.id}.json`);
  if (!fs.existsSync(arq)) {
    console.log(`📝 ${p.id}: sem roteiro — "${p.tema}"`);
    continue;
  }
  let problemas;
  try {
    problemas = validarRoteiro(JSON.parse(fs.readFileSync(arq, "utf8")), p.id);
  } catch (e) {
    problemas = [`JSON inválido: ${e.message}`];
  }
  if (problemas.length) {
    ruins++;
    console.log(`❌ ${p.id}:\n  - ${problemas.join("\n  - ")}`);
  } else console.log(`✅ ${p.id}: roteiro válido`);
}
process.exitCode = ruins ? 1 : 0;
