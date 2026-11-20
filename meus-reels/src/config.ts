// Identidade visual dos Reels. Altere cores, fontes e textos fixos aqui.
export const config = {
  video: {
    largura: 1080,
    altura: 1920,
    fps: 30,
  },
  cores: {
    fundo: "#2B1B17",
    fundoDegrade: "#4A2C24",
    texto: "#FFF8F0",
    textoSuave: "#E9D6C5",
    destaque: "#F4A259",
    chamadaFundo: "#F4A259",
    chamadaTexto: "#2B1B17",
    barraProgresso: "#F4A259",
  },
  fontes: {
    // Arquivos em public/fonts/ (Poppins, licença SIL OFL 1.1).
    titulo: { familia: "Poppins", arquivo: "fonts/poppins-latin-800-normal.woff2", peso: "800" },
    corpo: { familia: "Poppins", arquivo: "fonts/poppins-latin-500-normal.woff2", peso: "500" },
  },
  // Texto fixo no rodapé de todos os vídeos (deixe "" para esconder).
  assinatura: "@seuperfil",
  // Margens de segurança: a interface do Instagram cobre o topo e, principalmente, a base.
  margem: { lateral: 90, topo: 220, base: 420 },
} as const;
