# meus-reels · produção de Reels em lote

Fluxo: **pauta → roteiro → cenas → vídeo → capa e legenda**.

```
briefing.md          público, tom de voz, temas, exemplos de posts
pautas.json          fila de ideias (id, tema, duvida, chamada)
roteiros/<id>.json   roteiro de cada pauta (escrito pelo Claude, revisado por você)
src/config.ts        cores, fontes, assinatura e margens do modelo visual
src/Reel.tsx         composição 1080×1920, 30 fps; duração = soma das cenas
src/Capa.tsx         capa (still 1080×1920)
scripts/produzir.mjs renderização em lote
saida/<id>/          reel.mp4, capa.png, legenda.txt (não vai para o git)
saida/REVISAO.md     checklist de revisão manual
saida/erros.log      falhas de cada execução
```

## Comandos

```bash
npm install
npm run dev                          # Remotion Studio: pré-visualizar e ajustar o modelo
npm run pendentes                    # pautas sem roteiro + validação dos roteiros
npm run produzir                     # renderiza tudo que é novo ou mudou
npm run produzir -- --id bolo-01     # só uma pauta
npm run produzir -- --forcar         # renderiza tudo de novo (ex.: depois de mudar o visual)
```

- **Pula o que já está pronto:** um vídeo é refeito só se o roteiro mudou
  (ou com `--forcar`). Mudou cores/fontes em `src/config.ts`? Use `--forcar`.
- **Falhas não param o lote:** a pauta com erro vai para `saida/erros.log` e as
  demais continuam. O comando termina com código 1 se algo falhou.
- **Roteiro validado antes do render:** gancho primeiro, chamada por último,
  limites de texto e duração (veja `scripts/validar.mjs`).
- Para usar um Chrome já instalado em vez do que o Remotion baixa:
  `REMOTION_BROWSER_EXECUTABLE=/caminho/do/chrome npm run produzir`.

## Rotina semanal

1. Adicione pautas novas em `pautas.json`.
2. No Claude Code, nesta pasta: *"Escreva os roteiros pendentes"* (ele segue o `CLAUDE.md`).
3. `npm run produzir`.
4. Abra `saida/REVISAO.md` e confira gancho, texto na tela, capa e legenda.
5. Agende os aprovados.

### Agendar o render (opcional)

Linux/macOS (`crontab -e`), toda segunda às 7h:

```
0 7 * * 1 cd /caminho/para/meus-reels && npm run produzir >> saida/cron.log 2>&1
```

No Windows, use o Agendador de Tarefas com `npm run produzir` nesta pasta.

Para automatizar também a escrita, um script pode chamar a API do Claude com
`briefing.md` + a pauta, salvar a resposta em `roteiros/<id>.json` e só seguir
se `npm run pendentes` aprovar o JSON.

> Remotion é gratuito para equipes de até 3 pessoas; empresas maiores precisam
> de licença (https://www.remotion.dev/docs/license). Fonte Poppins: SIL OFL 1.1.
