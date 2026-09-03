# SkySense — Dashboard de Clima com IA

Dashboard de clima em tempo real (Open-Meteo, sem API key) com um painel de
insights gerados ao vivo pela API da Claude, com fallback automático caso a
chamada falhe.

## Estrutura

```
weather-dashboard/
  public/            # site estático (HTML/CSS/JS puro, sem build)
    index.html
    styles.css
    app.js
  functions/
    api/
      insights.js    # Cloudflare Pages Function — chama a Claude API server-side
```

## Rodar localmente

```bash
cd weather-dashboard
npx wrangler pages dev public
```

Abre em `http://localhost:8788`. Sem a variável `ANTHROPIC_API_KEY` configurada,
o painel de IA usa o resumo local (fallback) — o site funciona 100% mesmo assim.

Para testar a chamada real à Claude localmente, crie um arquivo `.dev.vars`
na raiz de `weather-dashboard/` (já ignorado pelo git):

```
ANTHROPIC_API_KEY=sk-ant-...
```

## Deploy no Cloudflare Pages

Você já tem conta — só falta publicar:

```bash
cd weather-dashboard
npx wrangler pages deploy public --project-name=skysense
```

Na primeira vez o Wrangler pede pra autenticar (`npx wrangler login`) e cria o
projeto `skysense` automaticamente se ele não existir.

### Configurar a API key da Claude (obrigatório para o insight ao vivo)

O site funciona sem isso (cai no resumo local), mas para ter o insight real
gerado pela IA, defina o secret no projeto Cloudflare Pages — **nunca** cole a
key no código:

```bash
npx wrangler pages secret put ANTHROPIC_API_KEY --project-name=skysense
```

Ele vai pedir pra colar a key no terminal (não fica no histórico do shell).
Alternativa pela UI: Cloudflare Dashboard → Pages → skysense → Settings →
Environment variables → adicionar `ANTHROPIC_API_KEY` como **secret** (não como
variável em texto plano) — em Production e em Preview.

Depois de configurar o secret, redeploy (ou espere o próximo deploy) para o
Function pegar o valor.

### Redeploys

Qualquer alteração: rode o mesmo comando de deploy de novo. Cada deploy cria
uma URL de preview única, além de atualizar a URL de produção do projeto.

## Notas de custo/latência

`functions/api/insights.js` usa `claude-opus-5` com `effort: "low"` por
padrão (constante `MODEL` no topo do arquivo). Como esse endpoint pode ser
chamado repetidamente por várias pessoas vendo o dashboard, considere trocar
para `claude-haiku-4-5` se quiser reduzir custo/latência — é só mudar a
constante `MODEL`.
