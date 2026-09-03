// Cloudflare Pages Function: POST /api/insights
// Body: { city, country, condition, temp, feelsLike, humidity, wind, todayMax, todayMin, next3Days }
// Tries a live Claude API call for a short, sharp weather insight; falls back to a
// locally computed summary if the key is missing, the call fails, or it's too slow.

const MODEL = 'claude-opus-5'; // swap to 'claude-haiku-4-5' for lower cost/latency on a high-traffic public page
const TIMEOUT_MS = 8000;

export async function onRequestPost(context) {
  let summary;
  try {
    summary = await context.request.json();
  } catch {
    return json({ error: 'invalid body' }, 400);
  }

  const apiKey = context.env.ANTHROPIC_API_KEY;
  if (apiKey) {
    try {
      const insight = await callClaude(summary, apiKey);
      if (insight) return json({ insight, source: 'ai' });
    } catch (err) {
      console.error('Claude call failed, using fallback:', err.message);
    }
  }

  return json({ insight: fallbackInsight(summary), source: 'fallback' });
}

async function callClaude(summary, apiKey) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 300,
        output_config: { effort: 'low' },
        system:
          'Você é um analista de clima direto e afiado. Escreva UM insight curto (2-3 frases, ' +
          'em português do Brasil) sobre os dados de clima fornecidos. Use os números reais para ' +
          'soar específico e analítico, não genérico. Pode comentar tendência, algo notável, ou uma ' +
          'sugestão prática leve. Nunca comece com "O clima em" ou saudações — vá direto ao ponto.',
        messages: [
          { role: 'user', content: JSON.stringify(summary) },
        ],
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`Anthropic API ${res.status}: ${body.slice(0, 200)}`);
    }

    const data = await res.json();
    const textBlock = (data.content || []).find((b) => b.type === 'text');
    return textBlock ? textBlock.text.trim() : null;
  } finally {
    clearTimeout(timer);
  }
}

function fallbackInsight(s) {
  const nextMax = s.next3Days?.[0]?.max;
  const trend = typeof nextMax === 'number' && typeof s.todayMax === 'number'
    ? (nextMax > s.todayMax ? 'subindo' : nextMax < s.todayMax ? 'caindo' : 'estável')
    : 'estável';
  const lows = (s.next3Days || []).map((d) => d.min).concat(s.todayMin ?? []);
  const highs = (s.next3Days || []).map((d) => d.max).concat(s.todayMax ?? []);
  const min = lows.length ? Math.min(...lows) : s.todayMin;
  const max = highs.length ? Math.max(...highs) : s.todayMax;

  return `${s.city || 'Aqui'} está com ${(s.condition || 'tempo variável').toLowerCase()}, ${s.temp}° ` +
    `(sensação de ${s.feelsLike}°). Temperatura ${trend} nos próximos dias, entre ${min}° e ${max}°.`;
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
