# VIRAL · Análise de Instagram

App web que conecta uma conta **Profissional** do Instagram (Empresa ou Criador
de conteúdo) e gera uma análise completa com **métricas**, **notas por área** e
**recomendações de melhoria** — no estilo de um relatório de consultoria.

A integração usa a **API oficial da Meta** ("Instagram API com Instagram Login"),
então tudo funciona dentro das regras do Instagram. Existe também um **modo
demonstração** com dados fictícios para você ver o app funcionando antes de
configurar qualquer coisa.

---

## ✨ O que o app mostra

- **Nota geral do perfil** (0 a 100) + notas por área: Engajamento, Consistência,
  Conteúdo e Perfil.
- **Métricas:** taxa de engajamento (com benchmark do seu porte), média de
  curtidas e comentários, frequência de posts por semana.
- **Gráficos:** mix de formatos (imagem/vídeo/carrossel) e engajamento por dia da semana.
- **Top posts:** as publicações com melhor desempenho.
- **Recomendações priorizadas:** o que melhorar, da mais urgente à menos urgente.

---

## 🚀 Como rodar localmente

```bash
npm install
cp .env.example .env.local   # preencha as credenciais (veja abaixo)
npm run dev
```

Abra http://localhost:3000 e clique em **Ver demonstração** para testar sem
configurar nada.

---

## 🔑 Como conectar uma conta real (API da Meta)

Para o botão "Conectar com o Instagram" funcionar, você precisa criar um app
gratuito no painel de desenvolvedor da Meta. Passo a passo:

1. **Pré-requisito:** sua conta do Instagram precisa ser **Profissional**
   (Empresa ou Criador). Dá para mudar em: Instagram → Configurações → Conta →
   Mudar para conta profissional.

2. Acesse https://developers.facebook.com/apps e clique em **Criar app**.
   Escolha o tipo que permite adicionar o produto **Instagram**.

3. No painel do app, adicione o produto **Instagram** →
   **Configuração da API com login do Instagram**.

4. Copie o **Instagram App ID** e o **Instagram App Secret** e coloque no
   arquivo `.env.local`:
   ```
   INSTAGRAM_APP_ID=seu_id
   INSTAGRAM_APP_SECRET=seu_secret
   APP_URL=http://localhost:3000
   ```

5. Em **URIs de redirecionamento OAuth válidos**, adicione exatamente:
   ```
   http://localhost:3000/api/auth/callback
   ```
   (e, em produção, `https://SEU-DOMINIO.vercel.app/api/auth/callback`)

6. Em **Funções → Testadores**, adicione a conta do Instagram que você vai usar
   para testar (enquanto o app está em modo de desenvolvimento).

7. Reinicie o `npm run dev`, clique em **Conectar com o Instagram** e autorize.

> **Importante:** enquanto o app estiver em modo de desenvolvimento, só as contas
> adicionadas como **testadoras** conseguem conectar. Para liberar para qualquer
> pessoa, é preciso enviar o app para a **Revisão da Meta** (App Review)
> solicitando as permissões `instagram_business_basic` e
> `instagram_business_manage_insights`.

---

## ☁️ Publicar na Vercel

1. Suba este repositório no GitHub (já está no branch de desenvolvimento).
2. Em https://vercel.com → **New Project** → importe o repositório.
3. Em **Settings → Environment Variables**, adicione:
   - `INSTAGRAM_APP_ID`
   - `INSTAGRAM_APP_SECRET`
   - `APP_URL` = a URL final do projeto (ex: `https://seu-app.vercel.app`)
4. No painel da Meta, adicione a URL de callback de produção
   (`https://seu-app.vercel.app/api/auth/callback`).
5. Deploy.

---

## 🧠 Recomendações por IA (opcional)

O motor de recomendações já é embutido (sem custo) e usa benchmarks de mercado.
Se quiser textos ainda mais personalizados gerados por IA, dá para plugar a API
da Anthropic preenchendo `ANTHROPIC_API_KEY` no `.env.local` — deixei o campo
preparado para essa evolução futura.

---

## 🗂️ Estrutura

```
app/
  page.jsx                 # landing page
  dashboard/page.jsx       # painel com a análise
  api/auth/login           # inicia o login no Instagram
  api/auth/callback        # recebe o login e guarda o token
  api/auth/logout          # encerra a sessão
  api/analyze              # busca os dados e roda a análise
lib/
  instagram.js             # chamadas à API oficial do Instagram
  analysis.js              # motor de métricas, notas e recomendações
  sampleData.js            # dados do modo demonstração
components/
  charts.jsx               # gráficos (sem biblioteca externa)
```

---

## ⚠️ Observações sobre os dados

- Campos como `followers_count` e `biography` só vêm para contas Profissional.
- A análise usa as **últimas 25 publicações** do feed (não inclui Stories).
- A disponibilidade de cada métrica depende das permissões aprovadas pela Meta.
