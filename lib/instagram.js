// Integração com a "Instagram API com Instagram Login" (API oficial da Meta).
// Funciona para contas Profissional (Empresa/Criador de conteúdo).
// Docs: https://developers.facebook.com/docs/instagram-platform

const GRAPH = "https://graph.instagram.com";
const GRAPH_VERSION = "v21.0";

const SCOPES = [
  "instagram_business_basic",
  "instagram_business_manage_insights"
].join(",");

export function getRedirectUri() {
  const base = (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
  return `${base}/api/auth/callback`;
}

// URL para onde mandamos o usuário fazer login no Instagram.
export function getAuthorizationUrl(state) {
  const params = new URLSearchParams({
    client_id: process.env.INSTAGRAM_APP_ID || "",
    redirect_uri: getRedirectUri(),
    response_type: "code",
    scope: SCOPES,
    state: state || "viral"
  });
  return `https://www.instagram.com/oauth/authorize?${params.toString()}`;
}

// Troca o "code" recebido no callback por um token de acesso de curta duração.
export async function exchangeCodeForToken(code) {
  const body = new URLSearchParams({
    client_id: process.env.INSTAGRAM_APP_ID || "",
    client_secret: process.env.INSTAGRAM_APP_SECRET || "",
    grant_type: "authorization_code",
    redirect_uri: getRedirectUri(),
    code
  });
  const res = await fetch("https://api.instagram.com/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error_message || data.error?.message || "Falha ao obter token de acesso.");
  }
  return data; // { access_token, user_id, permissions }
}

// Converte o token de curta duração em um de longa duração (60 dias).
export async function exchangeForLongLivedToken(shortToken) {
  const params = new URLSearchParams({
    grant_type: "ig_exchange_token",
    client_secret: process.env.INSTAGRAM_APP_SECRET || "",
    access_token: shortToken
  });
  const res = await fetch(`${GRAPH}/access_token?${params.toString()}`);
  const data = await res.json();
  if (!res.ok) return { access_token: shortToken }; // fallback: segue com o curto
  return data; // { access_token, token_type, expires_in }
}

export async function fetchProfile(accessToken) {
  const fields = [
    "user_id",
    "username",
    "name",
    "account_type",
    "followers_count",
    "follows_count",
    "media_count",
    "profile_picture_url",
    "biography"
  ].join(",");
  const res = await fetch(
    `${GRAPH}/${GRAPH_VERSION}/me?fields=${fields}&access_token=${accessToken}`
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || "Falha ao buscar o perfil.");
  }
  return data;
}

export async function fetchMedia(accessToken, limit = 25) {
  const fields = [
    "id",
    "caption",
    "media_type",
    "media_product_type",
    "media_url",
    "thumbnail_url",
    "permalink",
    "timestamp",
    "like_count",
    "comments_count"
  ].join(",");
  const res = await fetch(
    `${GRAPH}/${GRAPH_VERSION}/me/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || "Falha ao buscar as publicações.");
  }
  return Array.isArray(data.data) ? data.data : [];
}
