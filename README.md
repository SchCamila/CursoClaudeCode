# Passo Certo

**Da informalidade ao CNPJ, um passo por vez.**

Aplicativo que apoia trabalhadores brasileiros por conta própria a se formalizarem como Microempreendedor Individual (MEI). Projeto acadêmico de Engenharia de Software voltado à **ODS 8** da ONU — trabalho decente e crescimento econômico — com foco nas metas **8.3, 8.5, 8.8 e 8.10**.

- **App:** [`index.html`](index.html)
- **Dossiê do projeto:** [`dossie.html`](dossie.html)

---

## O problema

No Brasil, **37,5% da população ocupada está na informalidade: 38,5 milhões de pessoas** (PNAD Contínua/IBGE, trimestre nov·2025–jan·2026).

Ser informal significa três privações ao mesmo tempo:

1. sem cobertura do INSS;
2. sem poder emitir nota fiscal;
3. sem histórico de renda para acessar crédito.

O MEI resolve as três por **R$ 86,05 por mês** (serviços, 2026) — cerca de **R$ 2,83 por dia**, ou **3,6% do faturamento** de quem recebe R$ 2.400 mensais.

### A tese

A informalidade persiste por **assimetria de informação, não por custo**. A pessoa não sabe se é elegível, não consegue calcular o custo, não tem registro do próprio faturamento e não conhece os direitos que a contribuição garante. O app resolve esses quatro pontos.

### O diferencial

Todos os aplicativos que já existem para MEI pressupõem que a pessoa **já é MEI**: o app MEI da Receita Federal exige CNPJ e login gov.br; o Mais MEI parte do CNPJ existente; contas PJ (Nubank, Cora, InfinitePay) só abrem com CNPJ; apps de gestão cobram mensalidade e pressupõem empresa formalizada.

Nenhum atende o momento da decisão de formalizar, e nenhum mostra os direitos do INSS com carência e progresso. É essa lacuna que o Passo Certo ocupa.

---

## Módulos

| Tela | O que faz |
| --- | --- |
| **Entrada** | Um quadro só, sem carrossel — cada tela antes do login é gente que desiste. |
| **Cadastro** | Sem senha, em três passos: celular com máscara, código de 4 números, e quatro perguntas que alimentam o simulador. Botão **A+** amplia a interface inteira. |
| **Início** | Trilha de formalização em 5 passos, quanto entrou e sobrou no mês, medidor do faturamento do ano contra o teto, e alertas com projeção anual. |
| **Formalizar** | Veredito de elegibilidade, valor exato do DAS, custo por dia, percentual do faturamento, barra de proporção, comparação informal × MEI em sete linhas e trilha marcável até o CNPJ. |
| **Caixa** | Lançamento de entradas e saídas, gráfico de barras agrupadas dos últimos seis meses, exclusão com desfazer e gerador de comprovante de renda imprimível. |
| **Direitos** | Os seis benefícios do INSS com carência, quantas contribuições faltam, e um controle deslizante que simula o futuro. |
| **Deveres** | Grade dos doze meses com o estado das guias, custo acumulado, prazos do DAS e da DASN-SIMEI, e a regra da tolerância de 20%. |
| **Sobre e Perfil** | Dados do grupo editáveis dentro do app, e perfil com nome, negócio, cidade, ocupação, renda e tipo de atividade. |

O app **serve a qualquer profissão**: a pessoa escreve a ocupação que quiser, o app sugere o tipo de atividade a partir do que ela escreveu, e todos os números — DAS, custo por dia, fatia da renda, acumulado das guias — são recalculados com a renda informada.

---

## Parâmetros legais (exercício de 2026)

Centralizados em constantes no topo do script, para que a atualização anual aconteça **num único lugar**.

```js
const SM    = 1621.00;                                      // salário mínimo 2026
const INSS  = 81.05;                                        // 5% do salário mínimo
const DAS   = { comercio: 82.05, servico: 86.05, ambos: 87.05 };
const TETO  = 81000;                                        // limite anual de faturamento
const TOLER = 97200;                                        // teto + 20% de tolerância
```

- O **DAS vence dia 20** de cada mês. Atraso: multa de 0,33% ao dia, limitada a 20%.
- A **DASN-SIMEI** vai até 31 de maio.
- O **alerta preventivo de teto** dispara em 80% do limite, não no estouro.
- Acima de **R$ 97.200** o desenquadramento é imediato. Entre **R$ 81.000 e R$ 97.200**, o MEI segue até dezembro pagando a diferença.

### Carências previdenciárias

| Benefício | Carência |
| --- | --- |
| Auxílio por incapacidade temporária | 12 contribuições |
| Salário-maternidade | 10 contribuições |
| Aposentadoria por incapacidade permanente | 12 contribuições |
| Pensão por morte | sem carência |
| Auxílio-reclusão | 24 contribuições |
| Aposentadoria por idade | 180 contribuições, 62 anos (mulher) / 65 (homem) |

> A contribuição de 5% **não dá direito à aposentadoria por tempo de contribuição**. O app diz isso de forma explícita e orienta confirmar a situação no **Meu INSS**.

---

## Como rodar

Não há build, dependência nem instalação. Abra `index.html` no navegador.

Para servir localmente:

```bash
python3 -m http.server 8000
# depois abra http://localhost:8000
```

Publicação: veja [`DEPLOY.md`](DEPLOY.md).

---

## Decisões técnicas

- **Sem framework e sem biblioteca de execução.** HTML, CSS e JS puros, um arquivo por página.
- **Gráficos em SVG** gerado em tempo de execução, com camada de interação por toque. Barras com cantos de 4px e 2px de respiro entre vizinhas. Nunca dois eixos verticais.
- **Persistência em `localStorage`**, sempre dentro de `try/catch`. A página renderiza corretamente quando a leitura falha ou volta vazia.
- **Mobile-first.** Abaixo de 640px o app ocupa a tela inteira; acima disso aparece centralizado como aparelho.
- **Avisos flutuantes** no lugar de `alert()`, com ação **Desfazer** onde houver perda de dado.
- **Acessibilidade:** foco visível, `aria-live` nos alertas, navegação por teclado, `role` e `aria-pressed` corretos, `prefers-reduced-motion` respeitado.
- **Tema claro e escuro:** a paleta clara é definida por inteiro em `:root`; os blocos de tema apenas redefinem tokens já existentes. Nenhuma cor existe só dentro de uma media query.

### Marca

Três degraus subindo, em barras arredondadas brancas sobre quadrado verde. Cada degrau é um passo; o conjunto é crescimento — a segunda metade da ODS 8. A forma é **deliberadamente** também um gráfico de barras: são os meses de faturamento que o app registra.

Tipografia: **Bitter** nos títulos, **IBM Plex Sans** no texto e **IBM Plex Mono** em todo valor em reais, com `tabular-nums` para os números se alinharem em coluna.

---

## Limitações

Declaradas com clareza, porque um protótipo que promete demais engana quem mais precisa de informação correta.

- O app **não emite guia de pagamento e não abre CNPJ**. Ele orienta e acompanha; a abertura acontece no Portal do Empreendedor.
- A **lista de ocupações é exemplificativa**, não a lista oficial. A conferência tem de ser feita no gov.br/mei.
- Os **parâmetros mudam a cada ano**. Os projetos PLP 60/2025 e PLP 67/2025 propõem elevar o teto do MEI para R$ 140 mil ou R$ 150 mil, o que alteraria as contas.
- **Não houve teste de usabilidade com o público real.** As decisões de interface partem de pesquisa e de premissas do grupo.
- Os dados são fictícios e ficam apenas no aparelho: não há servidor, conta, nem sincronização.

---

## Fontes

- PNAD Contínua — IBGE
- Perfil do MEI — Sebrae
- Metas nacionais da ODS 8 — Ipea
- Lei Complementar nº 123/2006
- Lei Complementar nº 128/2008
- Lei nº 13.709/2018 (LGPD)
- Portal do Empreendedor — gov.br/mei
- Tabela DAS-MEI 2026
- Reajuste do salário mínimo 2026

---

**Protótipo acadêmico com dados fictícios — UVA.** Não constitui orientação contábil, jurídica ou financeira.
