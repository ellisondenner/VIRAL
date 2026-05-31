export const metadata = {
  title: "Política de Privacidade · VIRAL",
  description: "Como o VIRAL coleta, usa e protege seus dados."
};

export default function Privacidade() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <a href="/" className="text-sm text-white/60 hover:text-white">← Voltar</a>
      <h1 className="mt-4 text-3xl font-extrabold">Política de Privacidade</h1>
      <p className="mt-1 text-sm text-white/50">Última atualização: 31 de maio de 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-white/80">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-white">1. Quem somos</h2>
          <p>
            O <strong>VIRAL</strong> é uma ferramenta de análise de contas do Instagram que ajuda
            criadores de conteúdo e pequenos negócios a entender seu desempenho e receber
            recomendações de melhoria. Esta política explica como tratamos seus dados.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-white">2. Quais dados acessamos</h2>
          <p>
            Quando você conecta sua conta do Instagram (login oficial da Meta), e somente com a sua
            autorização, acessamos via API oficial do Instagram:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Informações do perfil: nome de usuário, nome, biografia, foto, número de seguidores, de seguindo e de publicações;</li>
            <li>Suas publicações recentes: legenda, tipo (imagem/vídeo/carrossel), data, número de curtidas e de comentários.</li>
          </ul>
          <p className="mt-2">
            Esses dados são usados <strong>exclusivamente</strong> para gerar a análise exibida a você
            na tela, no momento da consulta.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-white">3. Como armazenamos</h2>
          <p>
            Nós <strong>não armazenamos seus dados do Instagram em nossos servidores</strong>. A análise
            é gerada em tempo real e não fica salva. O token de acesso fornecido pela Meta é guardado
            apenas em um cookie seguro no <strong>seu próprio navegador</strong>, durante a sua sessão,
            para permitir a consulta — e expira automaticamente.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-white">4. Compartilhamento</h2>
          <p>
            Não vendemos, alugamos nem compartilhamos seus dados com terceiros. A comunicação acontece
            somente entre o seu navegador e a API oficial do Instagram/Meta.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-white">5. Revogação de acesso</h2>
          <p>
            Você pode revogar o acesso do VIRAL a qualquer momento em: Instagram → Configurações →
            Apps e sites → remover o VIRAL. Ao fazer isso, qualquer autorização é encerrada
            imediatamente.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-white">6. Exclusão de dados</h2>
          <p>
            Como não guardamos seus dados, não há informação pessoal armazenada para excluir. Ainda
            assim, você pode solicitar formalmente a exclusão seguindo as instruções em{" "}
            <a href="/exclusao-de-dados" className="text-brand-100 underline">
              /exclusao-de-dados
            </a>.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-white">7. Contato</h2>
          <p>
            Dúvidas sobre esta política? Fale conosco: <strong>ellisondennerpaiva@gmail.com</strong>.
          </p>
        </section>
      </div>

      <footer className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/40">
        VIRAL · Análise de Instagram
      </footer>
    </main>
  );
}
