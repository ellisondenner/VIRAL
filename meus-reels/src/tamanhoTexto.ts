// Tamanho de fonte pelo comprimento do texto, mantendo o mínimo legível em 1080px.
export const tamanhoTitulo = (texto: string) => {
  const n = texto.length;
  if (n <= 22) return 110;
  if (n <= 40) return 102;
  if (n <= 60) return 96;
  return 86;
};

export const tamanhoApoio = (texto: string) => (texto.length <= 70 ? 54 : 48);
