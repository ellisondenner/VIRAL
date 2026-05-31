export const metadata = {
  title: "Exclusão de Dados · VIRAL",
  description: "Como solicitar a exclusão dos seus dados no VIRAL."
};

export default function ExclusaoDeDados({ searchParams }) {
  const code = searchParams?.code;

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <a href="/" className="text-sm text-white/60 hover:text-white">← Voltar</a>
      <h1 className="mt-4 text-3xl font-extrabold">Exclusão de Dados</h1>

      {code && (
        <div className="mt-6 rounded-xl border border-green-400/30 bg-green-400/10 px-4 py-3 text-sm text-green-200">
          ✅ Sua solicitação de exclusão foi recebida e concluída.
          <br />
          Código de confirmação: <strong>{code}</strong>
        </div>
      )}

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-white/80">
        <section>
          <p>
            O <strong>VIRAL</strong> não armazena dados pessoais em seus servidores. A análise da sua
            conta é gerada em tempo real e não é salva; o token de acesso fica apenas em um cookie no
            seu navegador e expira sozinho. Portanto, na prática, <strong>não há dados retidos</strong>{" "}
            sobre você do nosso lado.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-white">Como garantir a remoção de tudo</h2>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              Saia da sua sessão clicando em <strong>“Sair”</strong> dentro do app (isso apaga o cookie
              com o token do seu navegador).
            </li>
            <li>
              Revogue o acesso do app na sua conta: Instagram → <strong>Configurações</strong> →{" "}
              <strong>Apps e sites</strong> → localize o <strong>VIRAL</strong> → <strong>Remover</strong>.
            </li>
          </ol>
          <p className="mt-3">Pronto — nenhuma autorização ou dado permanece.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-white">Solicitação formal</h2>
          <p>
            Se quiser registrar uma solicitação formal de exclusão, envie um e-mail para{" "}
            <strong>ellisondennerpaiva@gmail.com</strong> com o assunto{" "}
            <em>“Exclusão de dados”</em> e o nome de usuário da conta. Responderemos confirmando.
          </p>
        </section>
      </div>

      <footer className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/40">
        VIRAL · Análise de Instagram
      </footer>
    </main>
  );
}
