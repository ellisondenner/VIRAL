# Projeto: Reels em lote (Remotion)

## Ao escrever roteiros

Leia `briefing.md` e `pautas.json`. Para cada pauta sem `roteiros/<id>.json`
(`npm run pendentes` lista), escreva um roteiro **original** em português do Brasil,
no tom de voz do briefing, e salve em `roteiros/<id>.json`:

```json
{
  "id": "<id da pauta>",
  "titulo_capa": "até 80 caracteres",
  "cenas": [
    { "tipo": "gancho", "texto": "...", "duracao": 3.5 },
    { "tipo": "desenvolvimento", "texto": "...", "apoio": "opcional", "duracao": 4 },
    { "tipo": "chamada", "texto": "<chamada da pauta>", "duracao": 3.5 }
  ],
  "legenda": "legenda do Instagram, com a chamada e hashtags"
}
```

Regras:
- Primeira cena = `gancho` (prende nos primeiros segundos e toca na `duvida` da pauta).
- Uma ideia por cena. `texto` ≤ 90 caracteres (ideal ≤ 45), `apoio` ≤ 120.
- Última cena = `chamada`, usando a chamada da pauta.
- `duracao` em segundos (1.5 a 10); dê ~1s para cada 3–4 palavras na tela. Total ≤ 90s.
- Não reescreva roteiros existentes sem pedido: mudar um roteiro faz o vídeo ser refeito.
- Depois de escrever, rode `npm run pendentes` e corrija o que ele apontar.

## Código

- Visual (cores, fontes, assinatura, margens): `src/config.ts`.
- `npm run produzir` faz o render; não renderize sem pedido explícito.
