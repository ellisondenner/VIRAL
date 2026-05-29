"use client";

import { useEffect, useState } from "react";
import { ScoreRing, ScoreBar, BarList } from "../../components/charts";

const PRIORITY = {
  alta: { label: "Alta", cls: "bg-red-500/15 text-red-300 border-red-500/30" },
  media: { label: "Média", cls: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30" },
  baixa: { label: "Baixa", cls: "bg-sky-500/15 text-sky-300 border-sky-500/30" }
};

function nf(n) {
  return new Intl.NumberFormat("pt-BR").format(n);
}

function StatCard({ label, value, sub }) {
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wide text-white/50">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
      {sub && <div className="mt-1 text-xs text-white/50">{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const demo = params.get("demo") === "1";
    fetch(`/api/analyze${demo ? "?demo=1" : ""}`)
      .then(async (r) => {
        const json = await r.json();
        if (!r.ok) throw new Error(json.error || "Erro ao analisar.");
        return json;
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Centered>
        <div className="animate-pulse text-white/70">Analisando a conta…</div>
      </Centered>
    );
  }

  if (error) {
    return (
      <Centered>
        <div className="card max-w-md text-center">
          <div className="text-3xl">🔌</div>
          <h2 className="mt-3 text-lg font-semibold">Não foi possível analisar</h2>
          <p className="mt-2 text-sm text-white/60">{error}</p>
          <div className="mt-5 flex justify-center gap-3">
            <a href="/api/auth/login" className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold">
              Conectar Instagram
            </a>
            <a href="/dashboard?demo=1" className="rounded-lg border border-white/15 px-4 py-2 text-sm">
              Ver demonstração
            </a>
          </div>
        </div>
      </Centered>
    );
  }

  const p = data.profile;
  const m = data.metrics;

  return (
    <main className="mx-auto max-w-5xl px-5 py-8">
      {data.demo && (
        <div className="mb-5 rounded-xl border border-indigo-400/30 bg-indigo-400/10 px-4 py-2 text-center text-sm text-indigo-200">
          Você está vendo uma <strong>demonstração</strong> com dados fictícios.{" "}
          <a href="/api/auth/login" className="underline">Conecte sua conta real</a>.
        </div>
      )}

      {/* Cabeçalho do perfil */}
      <header className="card flex flex-col items-center gap-4 sm:flex-row sm:items-center">
        <Avatar url={p.profile_picture_url} name={p.name} />
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold">{p.name}</h1>
          <p className="text-white/60">@{p.username} · {accountLabel(p.account_type)}</p>
          {p.biography && <p className="mt-2 max-w-xl text-sm text-white/70">{p.biography}</p>}
          <div className="mt-3 flex justify-center gap-6 text-sm sm:justify-start">
            <span><strong>{nf(p.media_count)}</strong> <span className="text-white/50">posts</span></span>
            <span><strong>{nf(p.followers_count)}</strong> <span className="text-white/50">seguidores</span></span>
            <span><strong>{nf(p.follows_count)}</strong> <span className="text-white/50">seguindo</span></span>
          </div>
        </div>
        <a href="/api/auth/logout" className="text-xs text-white/40 hover:text-white/70">Sair</a>
      </header>

      {/* Nota geral + notas por área */}
      <section className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="card flex flex-col items-center justify-center">
          <h2 className="mb-2 text-sm font-semibold text-white/70">Nota geral do perfil</h2>
          <ScoreRing value={data.overall} />
          <p className="mt-3 text-center text-xs text-white/50">{verdict(data.overall)}</p>
        </div>
        <div className="card md:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-white/70">Notas por área</h2>
          <div className="space-y-4">
            {data.scores.map((s) => (
              <ScoreBar key={s.key} label={s.label} value={s.value} />
            ))}
          </div>
        </div>
      </section>

      {/* Métricas principais */}
      <section className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Taxa de engajamento"
          value={`${m.engagementRate}%`}
          sub={`Média do porte: ${m.benchmarkMedio}% · Bom: ${m.benchmarkBom}%`}
        />
        <StatCard label="Média de curtidas" value={nf(m.avgLikes)} sub="por publicação" />
        <StatCard label="Média de comentários" value={nf(m.avgComments)} sub="por publicação" />
        <StatCard label="Frequência" value={`${m.postsPerWeek}/sem`} sub={`${m.analyzedPosts} posts analisados`} />
      </section>

      {/* Gráficos */}
      <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="card">
          <h2 className="mb-4 text-sm font-semibold text-white/70">Mix de formatos</h2>
          <BarList
            items={data.contentMix.map((c) => ({ label: c.label, value: c.value }))}
            format={(v) => `${v}`}
          />
        </div>
        <div className="card">
          <h2 className="mb-1 text-sm font-semibold text-white/70">Engajamento por dia da semana</h2>
          <p className="mb-3 text-xs text-white/50">Melhor dia: <strong>{data.bestDay}</strong></p>
          <BarList
            items={data.weekdayPerf.map((w) => ({ label: w.name, value: w.avg }))}
            format={(v) => nf(Math.round(v))}
          />
        </div>
      </section>

      {/* Top posts */}
      {data.topPosts?.length > 0 && (
        <section className="mt-4 card">
          <h2 className="mb-4 text-sm font-semibold text-white/70">Publicações com melhor desempenho</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {data.topPosts.map((post, i) => (
              <a
                key={post.id}
                href={post.permalink || "#"}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
              >
                <div className="text-xs text-white/40">#{i + 1} · {typeLabel(post.media_type)}</div>
                <p className="mt-1 line-clamp-3 text-sm text-white/80">
                  {post.caption || "(sem legenda)"}
                </p>
                <div className="mt-3 flex gap-4 text-sm text-white/60">
                  <span>❤️ {nf(post.like_count || 0)}</span>
                  <span>💬 {nf(post.comments_count || 0)}</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Recomendações */}
      <section className="mt-4 card">
        <h2 className="mb-1 text-lg font-bold">O que você pode melhorar</h2>
        <p className="mb-4 text-sm text-white/50">
          {data.recommendations.length} recomendações, da mais importante para a menos urgente.
        </p>
        <div className="space-y-3">
          {data.recommendations.map((r, i) => {
            const pr = PRIORITY[r.priority] || PRIORITY.baixa;
            return (
              <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${pr.cls}`}>
                    {pr.label}
                  </span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60">
                    {r.category}
                  </span>
                  <h3 className="font-semibold">{r.title}</h3>
                </div>
                <p className="mt-2 text-sm text-white/70">{r.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="mt-8 text-center text-xs text-white/40">
        VIRAL · Análise gerada a partir das suas últimas {m.analyzedPosts} publicações.
      </footer>
    </main>
  );
}

function Centered({ children }) {
  return <main className="flex min-h-screen items-center justify-center px-5">{children}</main>;
}

function Avatar({ url, name }) {
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt={name} className="h-20 w-20 rounded-full object-cover" />;
  }
  const initial = (name || "?").charAt(0).toUpperCase();
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-indigo-500 text-2xl font-bold">
      {initial}
    </div>
  );
}

function accountLabel(t) {
  if (t === "BUSINESS") return "Conta Empresa";
  if (t === "MEDIA_CREATOR" || t === "CREATOR") return "Criador de conteúdo";
  return "Conta pessoal";
}

function typeLabel(t) {
  const up = (t || "").toUpperCase();
  if (up === "VIDEO" || up === "REELS") return "Vídeo/Reels";
  if (up === "CAROUSEL_ALBUM") return "Carrossel";
  return "Imagem";
}

function verdict(score) {
  if (score >= 80) return "Perfil muito bem otimizado. Continue assim!";
  if (score >= 60) return "Bom perfil, com espaço para crescer.";
  if (score >= 40) return "Há pontos importantes a melhorar.";
  return "O perfil precisa de ajustes em várias áreas.";
}
