// Motor de análise: recebe o perfil + as últimas publicações do Instagram
// e devolve métricas, notas (scores) e recomendações de melhoria.
// Tudo em pt-BR, com benchmarks de mercado para engajamento orgânico.

const WEEKDAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

function avg(nums) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function round(n, d = 1) {
  const f = Math.pow(10, d);
  return Math.round(n * f) / f;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

// Benchmark de taxa de engajamento por faixa de seguidores (referência de
// mercado para Instagram orgânico). Valores em %.
function engagementBenchmark(followers) {
  if (followers < 1000) return { bom: 5, medio: 2.5 };
  if (followers < 10000) return { bom: 3.5, medio: 1.8 };
  if (followers < 100000) return { bom: 2.5, medio: 1.2 };
  if (followers < 1000000) return { bom: 1.5, medio: 0.8 };
  return { bom: 1.0, medio: 0.5 };
}

export function analyzeProfile(profile, media) {
  const followers = Number(profile.followers_count) || 0;
  const posts = Array.isArray(media) ? media.slice() : [];

  // ----- Métricas básicas de engajamento -----
  const likes = posts.map((p) => Number(p.like_count) || 0);
  const comments = posts.map((p) => Number(p.comments_count) || 0);
  const avgLikes = avg(likes);
  const avgComments = avg(comments);
  const avgInteractions = avgLikes + avgComments;
  const engagementRate = followers > 0 ? (avgInteractions / followers) * 100 : 0;

  const bench = engagementBenchmark(followers);

  // ----- Frequência de publicação (posts por semana) -----
  const timestamps = posts
    .map((p) => (p.timestamp ? new Date(p.timestamp).getTime() : null))
    .filter(Boolean)
    .sort((a, b) => b - a);
  let postsPerWeek = 0;
  if (timestamps.length >= 2) {
    const spanDays = (timestamps[0] - timestamps[timestamps.length - 1]) / 86400000;
    postsPerWeek = spanDays > 0 ? (timestamps.length - 1) / (spanDays / 7) : timestamps.length;
  } else {
    postsPerWeek = timestamps.length;
  }

  // ----- Mix de tipos de conteúdo -----
  const typeCount = { IMAGE: 0, VIDEO: 0, CAROUSEL_ALBUM: 0, REELS: 0 };
  posts.forEach((p) => {
    const t = (p.media_type || "IMAGE").toUpperCase();
    if (t === "CAROUSEL_ALBUM") typeCount.CAROUSEL_ALBUM++;
    else if (t === "VIDEO" || t === "REELS") typeCount.VIDEO++;
    else typeCount.IMAGE++;
  });
  const totalTyped = posts.length || 1;
  const contentMix = [
    { label: "Imagens", value: typeCount.IMAGE, pct: round((typeCount.IMAGE / totalTyped) * 100) },
    { label: "Vídeos / Reels", value: typeCount.VIDEO, pct: round((typeCount.VIDEO / totalTyped) * 100) },
    { label: "Carrosséis", value: typeCount.CAROUSEL_ALBUM, pct: round((typeCount.CAROUSEL_ALBUM / totalTyped) * 100) }
  ];
  const videoShare = (typeCount.VIDEO / totalTyped) * 100;
  const carouselShare = (typeCount.CAROUSEL_ALBUM / totalTyped) * 100;

  // ----- Melhores horários / dias (por engajamento médio) -----
  const byWeekday = WEEKDAYS.map((name) => ({ name, total: 0, count: 0 }));
  posts.forEach((p) => {
    if (!p.timestamp) return;
    const d = new Date(p.timestamp);
    const wd = d.getDay();
    byWeekday[wd].total += (Number(p.like_count) || 0) + (Number(p.comments_count) || 0);
    byWeekday[wd].count += 1;
  });
  const weekdayPerf = byWeekday.map((w) => ({
    name: w.name,
    avg: w.count ? round(w.total / w.count) : 0,
    count: w.count
  }));
  const bestDay = weekdayPerf.reduce((best, w) => (w.avg > best.avg ? w : best), weekdayPerf[0] || { name: "—", avg: 0 });

  // ----- Top posts -----
  const topPosts = posts
    .map((p) => ({
      ...p,
      interactions: (Number(p.like_count) || 0) + (Number(p.comments_count) || 0)
    }))
    .sort((a, b) => b.interactions - a.interactions)
    .slice(0, 3);

  // ----- Análise de legendas e hashtags -----
  const captions = posts.map((p) => p.caption || "");
  const avgCaptionLen = avg(captions.map((c) => c.length));
  const avgHashtags = avg(captions.map((c) => (c.match(/#[\p{L}0-9_]+/gu) || []).length));
  const captionsWithCTA = captions.filter((c) =>
    /(link na bio|arrasta|salva esse|compartilha|comenta|marca|clique|saiba mais|acesse)/i.test(c)
  ).length;
  const ctaShare = posts.length ? (captionsWithCTA / posts.length) * 100 : 0;

  // ----- Perfil / bio -----
  const bio = profile.biography || "";
  const hasBioCTA = /(link|whatsapp|site|agende|contato|compre|acesse|👇|⬇)/i.test(bio);
  const followRatio = profile.follows_count > 0 ? followers / Number(profile.follows_count) : followers;

  // ================= SCORES (0-100) =================
  // Engajamento
  let engScore = 0;
  if (engagementRate >= bench.bom) engScore = 100;
  else if (engagementRate >= bench.medio) engScore = 60 + ((engagementRate - bench.medio) / (bench.bom - bench.medio)) * 40;
  else engScore = (engagementRate / bench.medio) * 60;
  engScore = clamp(round(engScore, 0), 0, 100);

  // Consistência (ideal: 3 a 7 posts/semana)
  let consScore;
  if (postsPerWeek >= 3 && postsPerWeek <= 7) consScore = 100;
  else if (postsPerWeek < 3) consScore = (postsPerWeek / 3) * 100;
  else consScore = clamp(100 - (postsPerWeek - 7) * 8, 40, 100);
  consScore = clamp(round(consScore, 0), 0, 100);

  // Conteúdo (variedade + presença de vídeo/carrossel, que entregam mais alcance)
  const distinctTypes = contentMix.filter((c) => c.value > 0).length;
  let contScore = distinctTypes * 22; // até 66 por variedade
  contScore += clamp(videoShare, 0, 25); // vídeo/reels impulsiona alcance
  contScore += clamp(carouselShare / 3, 0, 9);
  contScore = clamp(round(contScore, 0), 0, 100);

  // Perfil (bio com CTA + proporção de seguidores saudável)
  let perfScore = 50;
  if (hasBioCTA) perfScore += 25;
  if (followRatio >= 1) perfScore += 15;
  if (bio.length >= 50) perfScore += 10;
  perfScore = clamp(round(perfScore, 0), 0, 100);

  const overall = clamp(
    round(engScore * 0.4 + consScore * 0.25 + contScore * 0.2 + perfScore * 0.15, 0),
    0,
    100
  );

  const scores = [
    { key: "engajamento", label: "Engajamento", value: engScore },
    { key: "consistencia", label: "Consistência", value: consScore },
    { key: "conteudo", label: "Conteúdo", value: contScore },
    { key: "perfil", label: "Perfil", value: perfScore }
  ];

  // ================= RECOMENDAÇÕES =================
  const recommendations = buildRecommendations({
    engagementRate,
    bench,
    postsPerWeek,
    videoShare,
    carouselShare,
    avgHashtags,
    avgCaptionLen,
    ctaShare,
    hasBioCTA,
    bio,
    followRatio,
    bestDay,
    distinctTypes
  });

  return {
    profile: {
      username: profile.username,
      name: profile.name || profile.username,
      biography: bio,
      profile_picture_url: profile.profile_picture_url || null,
      account_type: profile.account_type || "—",
      followers_count: followers,
      follows_count: Number(profile.follows_count) || 0,
      media_count: Number(profile.media_count) || posts.length
    },
    metrics: {
      engagementRate: round(engagementRate, 2),
      benchmarkBom: bench.bom,
      benchmarkMedio: bench.medio,
      avgLikes: round(avgLikes, 0),
      avgComments: round(avgComments, 0),
      avgInteractions: round(avgInteractions, 0),
      postsPerWeek: round(postsPerWeek, 1),
      avgHashtags: round(avgHashtags, 1),
      avgCaptionLen: round(avgCaptionLen, 0),
      ctaShare: round(ctaShare, 0),
      analyzedPosts: posts.length
    },
    overall,
    scores,
    contentMix,
    weekdayPerf,
    bestDay: bestDay ? bestDay.name : "—",
    topPosts,
    recommendations
  };
}

function buildRecommendations(d) {
  const recs = [];
  const add = (priority, category, title, description) =>
    recs.push({ priority, category, title, description });

  // Engajamento
  if (d.engagementRate < d.bench.medio) {
    add(
      "alta",
      "Engajamento",
      "Aumentar a taxa de engajamento",
      `Sua taxa de engajamento (${round(d.engagementRate, 2)}%) está abaixo da média do seu porte (${d.bench.medio}%). Priorize formatos que geram interação: enquetes nos stories, perguntas na legenda e CTAs claros para comentar e salvar.`
    );
  } else if (d.engagementRate < d.bench.bom) {
    add(
      "media",
      "Engajamento",
      "Chegar ao nível de referência",
      `Você está na média (${round(d.engagementRate, 2)}%). Para alcançar o patamar "bom" (${d.bench.bom}%), aposte em ganchos fortes nos 3 primeiros segundos dos vídeos e em chamadas que incentivem o compartilhamento.`
    );
  } else {
    add(
      "baixa",
      "Engajamento",
      "Manter o ótimo engajamento",
      `Excelente! Sua taxa (${round(d.engagementRate, 2)}%) está acima da referência (${d.bench.bom}%). Continue replicando os temas dos seus melhores posts.`
    );
  }

  // Consistência
  if (d.postsPerWeek < 3) {
    add(
      "alta",
      "Consistência",
      "Postar com mais frequência",
      `Você publica ~${round(d.postsPerWeek, 1)} vez(es) por semana. O ideal é de 3 a 5 posts no feed por semana, além de stories diários, para o algoritmo manter seu alcance. Monte um calendário editorial.`
    );
  } else if (d.postsPerWeek > 10) {
    add(
      "media",
      "Consistência",
      "Cuidar da qualidade x quantidade",
      `Você posta muito (~${round(d.postsPerWeek, 1)}/semana). Garanta que a qualidade não caia — às vezes menos posts, porém melhores, rendem mais alcance.`
    );
  }

  // Conteúdo / formatos
  if (d.videoShare < 30) {
    add(
      "alta",
      "Conteúdo",
      "Investir mais em Reels",
      `Apenas ${round(d.videoShare, 0)}% do seu conteúdo é vídeo. Os Reels são o formato com maior alcance orgânico hoje. Tente pelo menos 2 a 3 Reels por semana.`
    );
  }
  if (d.distinctTypes < 2) {
    add(
      "media",
      "Conteúdo",
      "Variar os formatos",
      "Você usa basicamente um formato. Misture imagens, carrosséis e Reels para alcançar públicos diferentes e ensinar o algoritmo a entregar melhor."
    );
  }
  if (d.carouselShare < 15) {
    add(
      "baixa",
      "Conteúdo",
      "Usar carrosséis educativos",
      "Carrosséis costumam ter alto tempo de permanência e salvamentos. Crie conteúdos do tipo 'passo a passo' ou 'lista de dicas' em carrossel."
    );
  }

  // Legendas / hashtags
  if (d.avgHashtags < 3) {
    add(
      "media",
      "Alcance",
      "Usar hashtags estratégicas",
      `Você usa ~${round(d.avgHashtags, 1)} hashtags por post. Utilize de 5 a 10 hashtags relevantes, misturando termos amplos e de nicho, para ampliar a descoberta.`
    );
  } else if (d.avgHashtags > 20) {
    add(
      "baixa",
      "Alcance",
      "Reduzir excesso de hashtags",
      `Você usa muitas hashtags (~${round(d.avgHashtags, 1)}). Foque em 5 a 10 bem direcionadas; excesso pode parecer spam.`
    );
  }
  if (d.ctaShare < 40) {
    add(
      "media",
      "Conversão",
      "Adicionar chamadas para ação (CTA)",
      `Só ${round(d.ctaShare, 0)}% das suas legendas têm um CTA claro. Termine os posts pedindo uma ação: "salva esse post", "comenta aqui", "manda pra um amigo".`
    );
  }
  if (d.avgCaptionLen < 80) {
    add(
      "baixa",
      "Conteúdo",
      "Aprofundar as legendas",
      "Suas legendas são curtas. Legendas com contexto e storytelling aumentam o tempo de leitura e a conexão com o público."
    );
  }

  // Perfil / bio
  if (!d.hasBioCTA) {
    add(
      "alta",
      "Perfil",
      "Otimizar a bio",
      "Sua bio não tem uma chamada para ação ou link claro. Deixe explícito o que você oferece e direcione para um link (WhatsApp, site, agendamento)."
    );
  }
  if (d.followRatio < 1) {
    add(
      "baixa",
      "Perfil",
      "Equilibrar seguindo x seguidores",
      "Você segue mais contas do que tem seguidores. Uma proporção mais equilibrada passa mais autoridade ao visitante."
    );
  }

  // Melhor dia
  if (d.bestDay && d.bestDay.avg > 0) {
    add(
      "baixa",
      "Estratégia",
      "Aproveitar seu melhor dia",
      `Seus posts de ${d.bestDay.name.toLowerCase()} tiveram o melhor engajamento médio. Considere concentrar seus conteúdos mais importantes nesse dia.`
    );
  }

  const order = { alta: 0, media: 1, baixa: 2 };
  return recs.sort((a, b) => order[a.priority] - order[b.priority]);
}
