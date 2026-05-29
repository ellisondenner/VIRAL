// Dados fictícios usados no "modo demonstração", para mostrar o app
// funcionando antes de conectar uma conta real do Instagram.

function daysAgo(n) {
  return new Date(Date.now() - n * 86400000).toISOString();
}

// Predominância de imagens (pouco vídeo) para o demo gerar recomendações úteis.
const TYPES = ["IMAGE", "IMAGE", "CAROUSEL_ALBUM", "IMAGE", "VIDEO", "IMAGE"];

function makePost(i) {
  const type = TYPES[i % TYPES.length];
  // ~2,3% de engajamento médio sobre 8.450 seguidores (faixa "na média").
  const base = 150 + Math.round(Math.sin(i) * 60) + (i % 5) * 12;
  const like_count = Math.max(80, base + (type === "VIDEO" ? 220 : 0));
  const comments_count = Math.round(like_count * (0.02 + (i % 4) * 0.01));
  return {
    id: `demo_${i}`,
    caption:
      i % 2 === 0
        ? `Dica ${i + 1}: como crescer no Instagram de forma orgânica. Salva esse post e comenta aqui o que achou! #marketingdigital #instagram #dicas`
        : `Bastidores do nosso trabalho 🎬 Mais conteúdo em breve.`,
    media_type: type,
    media_product_type: type === "VIDEO" ? "REELS" : "FEED",
    media_url: null,
    thumbnail_url: null,
    permalink: "https://instagram.com",
    timestamp: daysAgo(i * 2 + 1),
    like_count,
    comments_count
  };
}

export const sampleProfile = {
  user_id: "demo",
  username: "loja.exemplo",
  name: "Loja Exemplo",
  account_type: "BUSINESS",
  followers_count: 8450,
  follows_count: 612,
  media_count: 184,
  profile_picture_url: null,
  biography: "Moda feminina ✨ Novidades toda semana. Use o cupom BEMVINDA10 👇"
};

export const sampleMedia = Array.from({ length: 18 }, (_, i) => makePost(i));
