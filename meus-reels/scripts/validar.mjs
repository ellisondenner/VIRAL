// Valida o JSON de um roteiro antes de enviá-lo ao Remotion.
// Retorna uma lista de problemas (vazia = roteiro válido).
const TIPOS = ["gancho", "desenvolvimento", "chamada"];

export const validarRoteiro = (r, idEsperado) => {
  const erros = [];
  const texto = (v, campo, max, obrigatorio = true) => {
    if (v === undefined && !obrigatorio) return;
    if (typeof v !== "string" || !v.trim()) erros.push(`${campo}: precisa ser um texto não vazio`);
    else if (max && v.length > max) erros.push(`${campo}: ${v.length} caracteres (máximo ${max})`);
  };

  if (!r || typeof r !== "object" || Array.isArray(r)) return ["o roteiro precisa ser um objeto JSON"];
  if (r.id !== idEsperado) erros.push(`id: "${r.id}" diferente do nome do arquivo/pauta "${idEsperado}"`);
  texto(r.titulo_capa, "titulo_capa", 80);
  texto(r.legenda, "legenda", 2200); // limite do Instagram

  if (!Array.isArray(r.cenas) || r.cenas.length < 2) {
    erros.push("cenas: precisa de pelo menos 2 cenas (gancho e chamada)");
    return erros;
  }
  r.cenas.forEach((c, i) => {
    const p = `cenas[${i}]`;
    if (!TIPOS.includes(c?.tipo)) erros.push(`${p}.tipo: use ${TIPOS.join(", ")}`);
    texto(c?.texto, `${p}.texto`, 90);
    texto(c?.apoio, `${p}.apoio`, 120, false);
    if (typeof c?.duracao !== "number" || c.duracao < 1.5 || c.duracao > 10)
      erros.push(`${p}.duracao: número entre 1.5 e 10 segundos`);
  });
  if (r.cenas[0]?.tipo !== "gancho") erros.push("a primeira cena precisa ser do tipo gancho");
  if (r.cenas.at(-1)?.tipo !== "chamada") erros.push("a última cena precisa ser do tipo chamada");
  const total = r.cenas.reduce((t, c) => t + (Number(c?.duracao) || 0), 0);
  if (total > 90) erros.push(`duração total ${total}s passa de 90s`);
  return erros;
};
