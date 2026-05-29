"use client";

import { useEffect, useState } from "react";

const FEATURES = [
  { icon: "📊", title: "Métricas que importam", text: "Taxa de engajamento, média de curtidas e comentários, frequência de posts e mais." },
  { icon: "🎯", title: "Notas por área", text: "Engajamento, consistência, conteúdo e perfil — cada um com uma pontuação de 0 a 100." },
  { icon: "💡", title: "O que melhorar", text: "Recomendações práticas e priorizadas para crescer de forma orgânica." },
  { icon: "🔒", title: "Login oficial da Meta", text: "Conexão segura via API oficial do Instagram. Seus dados não são compartilhados." }
];

const ERRORS = {
  sem_credenciais: "O app ainda não foi configurado com as credenciais da Meta. Use o modo demonstração por enquanto.",
  login_cancelado: "Login cancelado. Tente novamente quando quiser.",
  falha_token: "Não consegui concluir o login com o Instagram. Verifique as configurações do app na Meta."
};

export default function Home() {
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const e = params.get("erro");
    if (e && ERRORS[e]) setErro(ERRORS[e]);
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 md:py-16">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📈</span>
          <span className="text-lg font-bold tracking-tight">VIRAL</span>
        </div>
        <a href="/dashboard?demo=1" className="text-sm text-white/70 hover:text-white">
          Ver demonstração →
        </a>
      </header>

      <section className="mt-16 text-center md:mt-24">
        <span className="inline-block rounded-full border border-brand-400/40 bg-brand-400/10 px-3 py-1 text-xs font-medium text-brand-100">
          Análise de Instagram com IA
        </span>
        <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
          Descubra o que melhorar
          <br />
          no seu <span className="bg-gradient-to-r from-brand-400 to-indigo-400 bg-clip-text text-transparent">Instagram</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-white/70 md:text-lg">
          Conecte sua conta profissional e receba, em segundos, uma análise completa com
          métricas, notas e um plano de ação para crescer.
        </p>

        {erro && (
          <div className="mx-auto mt-6 max-w-md rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
            {erro}
          </div>
        )}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="/api/auth/login"
            className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-indigo-500 px-6 py-3 text-center font-semibold text-white shadow-lg transition hover:opacity-90 sm:w-auto"
          >
            Conectar com o Instagram
          </a>
          <a
            href="/dashboard?demo=1"
            className="w-full rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-center font-semibold text-white transition hover:bg-white/10 sm:w-auto"
          >
            Ver demonstração
          </a>
        </div>
        <p className="mt-3 text-xs text-white/40">
          Funciona com contas Profissional (Empresa ou Criador de conteúdo).
        </p>
      </section>

      <section className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <div key={f.title} className="card">
            <div className="text-2xl">{f.icon}</div>
            <h3 className="mt-2 font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-white/60">{f.text}</p>
          </div>
        ))}
      </section>

      <footer className="mt-20 border-t border-white/10 pt-6 text-center text-xs text-white/40">
        VIRAL · Análise de Instagram · Feito para creators e pequenos negócios.
      </footer>
    </main>
  );
}
