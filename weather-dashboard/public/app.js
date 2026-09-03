const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const LAST_CITY_KEY = 'skysense.lastCity';
const DEFAULT_CITY = { name: 'São Paulo', country: 'Brasil', latitude: -23.5505, longitude: -46.6333 };

// WMO weather code -> { icon, label, condClass }
const WMO = {
  0: ['☀️', 'Céu limpo', 'clear'],
  1: ['🌤️', 'Poucas nuvens', 'clear'],
  2: ['⛅', 'Parcialmente nublado', 'cloud'],
  3: ['☁️', 'Nublado', 'cloud'],
  45: ['🌫️', 'Neblina', 'cloud'],
  48: ['🌫️', 'Neblina com geada', 'cloud'],
  51: ['🌦️', 'Garoa fraca', 'rain'],
  53: ['🌦️', 'Garoa', 'rain'],
  55: ['🌧️', 'Garoa forte', 'rain'],
  61: ['🌧️', 'Chuva fraca', 'rain'],
  63: ['🌧️', 'Chuva', 'rain'],
  65: ['🌧️', 'Chuva forte', 'rain'],
  71: ['🌨️', 'Neve fraca', 'snow'],
  73: ['🌨️', 'Neve', 'snow'],
  75: ['❄️', 'Neve forte', 'snow'],
  80: ['🌦️', 'Pancadas de chuva', 'rain'],
  81: ['🌧️', 'Pancadas de chuva', 'rain'],
  82: ['⛈️', 'Pancadas fortes', 'storm'],
  95: ['⛈️', 'Tempestade', 'storm'],
  96: ['⛈️', 'Tempestade com granizo', 'storm'],
  99: ['⛈️', 'Tempestade forte', 'storm'],
};
function wmo(code) { return WMO[code] || ['🌡️', 'Condição desconhecida', 'default']; }

const $ = (id) => document.getElementById(id);

let hourlyChart = null;
let currentWeatherPayload = null;

// ---------- Geocoding search ----------
let searchDebounce;
$('citySearch').addEventListener('input', (e) => {
  clearTimeout(searchDebounce);
  const q = e.target.value.trim();
  if (q.length < 2) { $('searchResults').classList.add('hidden'); return; }
  searchDebounce = setTimeout(() => runSearch(q), 300);
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-wrap')) $('searchResults').classList.add('hidden');
});

async function runSearch(query) {
  try {
    const url = `${GEOCODE_URL}?name=${encodeURIComponent(query)}&count=6&language=pt&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    renderSearchResults(data.results || []);
  } catch (err) {
    console.error('geocode error', err);
  }
}

function renderSearchResults(results) {
  const box = $('searchResults');
  if (!results.length) { box.classList.add('hidden'); box.innerHTML = ''; return; }
  box.innerHTML = results.map((r, i) => `
    <div class="search-result-item" data-idx="${i}">
      <div>${r.name}</div>
      <div class="search-result-sub">${[r.admin1, r.country].filter(Boolean).join(', ')}</div>
    </div>
  `).join('');
  box.classList.remove('hidden');
  [...box.children].forEach((el, i) => {
    el.addEventListener('click', () => {
      const r = results[i];
      selectCity({ name: r.name, country: r.country, latitude: r.latitude, longitude: r.longitude });
      box.classList.add('hidden');
      $('citySearch').value = '';
    });
  });
}

// ---------- Geolocation ----------
$('geoBtn').addEventListener('click', () => {
  if (!navigator.geolocation) return;
  $('geoBtn').textContent = '⏳';
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      $('geoBtn').textContent = '📍';
      selectCity({ name: 'Minha localização', country: '', latitude, longitude });
    },
    () => { $('geoBtn').textContent = '📍'; },
    { timeout: 8000 }
  );
});

// ---------- Selecting a city ----------
function selectCity(city) {
  localStorage.setItem(LAST_CITY_KEY, JSON.stringify(city));
  loadWeather(city);
}

// ---------- Weather fetch ----------
async function loadWeather(city) {
  $('heroContent').classList.add('hidden');
  $('heroSkeleton').classList.remove('hidden');
  resetAiCard();

  const params = new URLSearchParams({
    latitude: city.latitude,
    longitude: city.longitude,
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
    hourly: 'temperature_2m,weather_code,precipitation_probability',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    timezone: 'auto',
    forecast_days: '7',
  });

  try {
    const res = await fetch(`${FORECAST_URL}?${params}`);
    const data = await res.json();
    renderWeather(city, data);
    requestInsight(city, data);
  } catch (err) {
    console.error('forecast error', err);
    $('heroDesc').textContent = 'Não foi possível carregar o clima agora.';
  }
}

function renderWeather(city, data) {
  currentWeatherPayload = { city, data };
  const cur = data.current;
  const [icon, label, cond] = wmo(cur.weather_code);

  document.body.className = `cond-${cond}`;
  $('heroCity').textContent = [city.name, city.country].filter(Boolean).join(', ');
  $('heroUpdated').textContent = `Atualizado às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  $('heroIcon').textContent = icon;
  $('heroTemp').textContent = `${Math.round(cur.temperature_2m)}°`;
  $('heroDesc').textContent = label;
  $('statFeels').textContent = `${Math.round(cur.apparent_temperature)}°`;
  $('statHumidity').textContent = `${Math.round(cur.relative_humidity_2m)}%`;
  $('statWind').textContent = `${Math.round(cur.wind_speed_10m)} km/h`;
  $('statMinMax').textContent = `${Math.round(data.daily.temperature_2m_max[0])}° / ${Math.round(data.daily.temperature_2m_min[0])}°`;

  $('heroSkeleton').classList.add('hidden');
  $('heroContent').classList.remove('hidden');

  renderHourlyChart(data);
  renderForecastStrip(data);
}

function renderHourlyChart(data) {
  const now = new Date();
  const times = data.hourly.time;
  let startIdx = times.findIndex((t) => new Date(t) >= now);
  if (startIdx < 0) startIdx = 0;
  const slice = (arr) => arr.slice(startIdx, startIdx + 24);

  const labels = slice(times).map((t) => new Date(t).toLocaleTimeString('pt-BR', { hour: '2-digit' }));
  const temps = slice(data.hourly.temperature_2m);
  const precip = slice(data.hourly.precipitation_probability);

  const ctx = $('hourlyChart').getContext('2d');
  if (hourlyChart) hourlyChart.destroy();

  const accent = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#7dd3fc';

  hourlyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Temperatura (°C)',
          data: temps,
          borderColor: accent,
          backgroundColor: `${accent}33`,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          yAxisID: 'y',
        },
        {
          label: 'Chance de chuva (%)',
          data: precip,
          borderColor: 'rgba(148,163,184,0.5)',
          borderDash: [4, 4],
          pointRadius: 0,
          fill: false,
          tension: 0.4,
          yAxisID: 'y1',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { labels: { color: '#9aa5b8', font: { size: 11 } } },
      },
      scales: {
        x: { ticks: { color: '#9aa5b8', maxTicksLimit: 8 }, grid: { display: false } },
        y: { ticks: { color: '#9aa5b8' }, grid: { color: 'rgba(255,255,255,0.06)' } },
        y1: { position: 'right', min: 0, max: 100, ticks: { color: '#9aa5b8' }, grid: { display: false } },
      },
    },
  });
}

function renderForecastStrip(data) {
  const days = data.daily.time;
  const html = days.map((d, i) => {
    const [icon] = wmo(data.daily.weather_code[i]);
    const dayName = i === 0 ? 'Hoje' : new Date(d).toLocaleDateString('pt-BR', { weekday: 'short' });
    return `
      <div class="forecast-day">
        <div class="forecast-day-name">${dayName}</div>
        <div class="forecast-day-icon">${icon}</div>
        <div class="forecast-day-max">${Math.round(data.daily.temperature_2m_max[i])}°</div>
        <div class="forecast-day-min">${Math.round(data.daily.temperature_2m_min[i])}°</div>
      </div>
    `;
  }).join('');
  $('forecastStrip').innerHTML = html;
}

// ---------- AI Insight ----------
function resetAiCard() {
  $('aiBody').innerHTML = `
    <div class="ai-skeleton">
      <div class="skel-line w90"></div>
      <div class="skel-line w70"></div>
    </div>`;
  $('aiSource').textContent = '';
}

async function requestInsight(city, data) {
  const summary = buildWeatherSummary(city, data);
  try {
    $('refreshInsight').classList.add('spinning');
    const res = await fetch('/api/insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(summary),
    });
    const json = await res.json();
    renderInsight(json.insight, json.source);
  } catch (err) {
    console.error('insight fetch failed', err);
    renderInsight(fallbackInsight(summary), 'fallback-client');
  } finally {
    $('refreshInsight').classList.remove('spinning');
  }
}

function buildWeatherSummary(city, data) {
  const cur = data.current;
  const [, label] = wmo(cur.weather_code);
  return {
    city: city.name,
    country: city.country || '',
    condition: label,
    temp: Math.round(cur.temperature_2m),
    feelsLike: Math.round(cur.apparent_temperature),
    humidity: Math.round(cur.relative_humidity_2m),
    wind: Math.round(cur.wind_speed_10m),
    todayMax: Math.round(data.daily.temperature_2m_max[0]),
    todayMin: Math.round(data.daily.temperature_2m_min[0]),
    next3Days: data.daily.time.slice(1, 4).map((d, i) => ({
      day: new Date(d).toLocaleDateString('pt-BR', { weekday: 'short' }),
      max: Math.round(data.daily.temperature_2m_max[i + 1]),
      min: Math.round(data.daily.temperature_2m_min[i + 1]),
      condition: wmo(data.daily.weather_code[i + 1])[1],
    })),
  };
}

function fallbackInsight(s) {
  const trend = s.next3Days[0] && s.next3Days[0].max > s.todayMax ? 'subindo' : 'estável ou caindo';
  return `${s.city} está com ${s.condition.toLowerCase()}, ${s.temp}° (sensação de ${s.feelsLike}°). ` +
    `Temperatura ${trend} nos próximos dias, entre ${Math.min(...s.next3Days.map(d => d.min), s.todayMin)}° e ${Math.max(...s.next3Days.map(d => d.max), s.todayMax)}°.`;
}

function renderInsight(text, source) {
  $('aiBody').textContent = text;
  $('aiSource').textContent = source === 'ai' ? '✨ Gerado pela Claude API' : 'Resumo local (IA indisponível no momento)';
}

$('refreshInsight').addEventListener('click', () => {
  if (currentWeatherPayload) requestInsight(currentWeatherPayload.city, currentWeatherPayload.data);
});

// ---------- Init ----------
(function init() {
  const saved = localStorage.getItem(LAST_CITY_KEY);
  const city = saved ? JSON.parse(saved) : DEFAULT_CITY;
  loadWeather(city);
})();
