// Renderiza os roteiros em lote: saida/<id>/{reel.mp4, capa.png, legenda.txt}
//
//   npm run produzir                  -> todas as pautas
//   npm run produzir -- --id bolo-01  -> só uma pauta (pode repetir --id)
//   npm run produzir -- --forcar      -> renderiza de novo mesmo sem mudanças
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { validarRoteiro } from "./validar.mjs";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SAIDA = path.join(RAIZ, "saida");
const LOG_ERROS = path.join(SAIDA, "erros.log");

const args = process.argv.slice(2);
const forcar = args.includes("--forcar");
const apenas = args.flatMap((a, i) => (a === "--id" && args[i + 1] ? [args[i + 1]] : []));
// Opcional: caminho de um Chrome/Chromium já instalado (senão o Remotion baixa um).
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE || null;

const lerJson = (arquivo) => JSON.parse(fs.readFileSync(arquivo, "utf8"));
const hashDe = (obj) => createHash("sha256").update(JSON.stringify(obj)).digest("hex");
const registrarErro = (id, erro) => {
  const linha = `[${new Date().toISOString()}] ${id}: ${String(erro?.stack || erro).split("\n").slice(0, 4).join(" | ")}\n`;
  fs.appendFileSync(LOG_ERROS, linha);
};

const concluido = (pasta, hash) => {
  const estado = path.join(pasta, ".estado.json");
  if (!fs.existsSync(estado)) return false;
  const arquivosOk = ["reel.mp4", "capa.png", "legenda.txt"].every((f) => fs.existsSync(path.join(pasta, f)));
  return arquivosOk && lerJson(estado).hash === hash;
};

const main = async () => {
  fs.mkdirSync(SAIDA, { recursive: true });
  let pautas = lerJson(path.join(RAIZ, "pautas.json"));
  if (apenas.length) {
    const faltando = apenas.filter((id) => !pautas.some((p) => p.id === id));
    if (faltando.length) console.warn(`⚠ IDs não encontrados em pautas.json: ${faltando.join(", ")}`);
    pautas = pautas.filter((p) => apenas.includes(p.id));
  }

  const resultado = { gerados: [], pulados: [], pendentes: [], falhas: [] };
  let serveUrl = null;
  const obterBundle = async () => {
    if (serveUrl) return serveUrl;
    console.log("📦 Preparando o modelo de vídeo...");
    serveUrl = await bundle({ entryPoint: path.join(RAIZ, "src/index.ts"), rspack: true });
    return serveUrl;
  };

  for (const pauta of pautas) {
    const { id } = pauta;
    const arqRoteiro = path.join(RAIZ, "roteiros", `${id}.json`);
    const pasta = path.join(SAIDA, id);
    try {
      if (!fs.existsSync(arqRoteiro)) {
        console.log(`📝 ${id}: sem roteiro (roteiros/${id}.json). Peça ao Claude para escrever.`);
        resultado.pendentes.push(id);
        continue;
      }
      const roteiro = lerJson(arqRoteiro);
      const problemas = validarRoteiro(roteiro, id);
      if (problemas.length) throw new Error(`roteiro inválido:\n  - ${problemas.join("\n  - ")}`);

      const hash = hashDe(roteiro);
      if (!forcar && concluido(pasta, hash)) {
        console.log(`⏭  ${id}: já concluído e roteiro sem mudanças, pulando.`);
        resultado.pulados.push(id);
        continue;
      }

      console.log(`🎬 ${id}: renderizando...`);
      fs.mkdirSync(pasta, { recursive: true });
      fs.rmSync(path.join(pasta, ".estado.json"), { force: true });
      const url = await obterBundle();
      const inputProps = { roteiro };

      const comp = await selectComposition({ serveUrl: url, id: "Reel", inputProps, browserExecutable });
      // Renderiza em arquivo temporário: um vídeo pela metade nunca fica com o nome final.
      const tmpVideo = path.join(pasta, "reel.parcial.mp4");
      let ultimo = -1;
      await renderMedia({
        composition: comp,
        serveUrl: url,
        codec: "h264",
        outputLocation: tmpVideo,
        inputProps,
        browserExecutable,
        onProgress: ({ progress }) => {
          const pct = Math.floor(progress * 10) * 10;
          if (pct !== ultimo) {
            ultimo = pct;
            process.stdout.write(`   ${pct}%${pct === 100 ? "\n" : ""}`);
          }
        },
      });
      fs.renameSync(tmpVideo, path.join(pasta, "reel.mp4"));

      const capa = await selectComposition({ serveUrl: url, id: "Capa", inputProps, browserExecutable });
      await renderStill({
        composition: capa,
        serveUrl: url,
        output: path.join(pasta, "capa.png"),
        inputProps,
        browserExecutable,
      });

      fs.writeFileSync(path.join(pasta, "legenda.txt"), roteiro.legenda.trim() + "\n");
      fs.writeFileSync(
        path.join(pasta, ".estado.json"),
        JSON.stringify({ hash, duracaoSegundos: comp.durationInFrames / comp.fps, geradoEm: new Date().toISOString() }, null, 2),
      );
      console.log(`✅ ${id}: saida/${id}/ (reel.mp4, capa.png, legenda.txt)`);
      resultado.gerados.push(id);
    } catch (erro) {
      console.error(`❌ ${id}: ${erro.message}`);
      registrarErro(id, erro);
      resultado.falhas.push(id);
    }
  }

  escreverRevisao();
  console.log(
    `\nResumo: ${resultado.gerados.length} gerados, ${resultado.pulados.length} pulados, ` +
      `${resultado.pendentes.length} sem roteiro, ${resultado.falhas.length} com falha.`,
  );
  if (resultado.pendentes.length) console.log(`Sem roteiro: ${resultado.pendentes.join(", ")}`);
  if (resultado.falhas.length) console.log(`Falhas registradas em saida/erros.log: ${resultado.falhas.join(", ")}`);
  console.log("Revise saida/REVISAO.md antes de publicar.");
  process.exitCode = resultado.falhas.length ? 1 : 0;
};

// Checklist de revisão manual com todas as pautas que já têm saída.
const escreverRevisao = () => {
  const todas = lerJson(path.join(RAIZ, "pautas.json"));
  const linhas = ["# Revisão antes de publicar", "", "Marque cada item depois de conferir o vídeo.", ""];
  for (const p of todas) {
    const pasta = path.join(SAIDA, p.id);
    const arqEstado = path.join(pasta, ".estado.json");
    if (!fs.existsSync(arqEstado)) continue;
    const estado = lerJson(arqEstado);
    const roteiro = lerJson(path.join(RAIZ, "roteiros", `${p.id}.json`));
    const atual = hashDe(roteiro) === estado.hash ? "" : " ⚠ roteiro mudou depois do render";
    linhas.push(
      `## ${p.id} — ${p.tema}${atual}`,
      "",
      `- Duração: ${estado.duracaoSegundos.toFixed(1)}s · gerado em ${estado.geradoEm}`,
      `- Gancho: "${roteiro.cenas[0].texto}"`,
      `- Capa: "${roteiro.titulo_capa}"`,
      "",
      "- [ ] Gancho prende nos primeiros segundos",
      "- [ ] Texto na tela legível e sem erros",
      "- [ ] Capa correta (confira também o recorte 3:4 da grade)",
      "- [ ] Legenda revisada",
      "- [ ] Aprovado para agendar",
      "",
    );
  }
  fs.writeFileSync(path.join(SAIDA, "REVISAO.md"), linhas.join("\n"));
};

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
