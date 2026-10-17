const https = require('https');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchJson(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    }).on('error', reject);
  });
}

const FUNNEL_STEPS_META = [
  { num: 1, name: "Idade / Boas-vindas" },
  { num: 2, name: "Objetivo Principal" },
  { num: 3, name: "Praticou Antes" },
  { num: 4, name: "Flexibilidade" },
  { num: 5, name: "Físico Atual" },
  { num: 6, name: "Corpo dos Sonhos" },
  { num: 7, name: "Melhor Físico" },
  { num: 8, name: "Região do Corpo Alvo" },
  { num: 9, name: "Frequência Exercício" },
  { num: 10, name: "Horas de Sono" },
  { num: 11, name: "Motivo Principal" },
  { num: 12, name: "Altura em cm" },
  { num: 13, name: "Peso Atual (kg)" },
  { num: 14, name: "Peso Ideal (kg)" },
  { num: 15, name: "Finalização do Plano (Wait/Análise)" },
  { num: 16, name: "Previsão & Gráfico de Peso" },
  { num: 17, name: "Benefícios & Depoimentos" },
  { num: 18, name: "Checkout Payt / Zuptos" }
];

async function run() {
  const data = await fetchJson('https://script.google.com/macros/s/AKfycby0xd-wdy9vJZZO8nq8x7PIlE1yON6if4eTjZmul86SM3OemdSne8sKW9rWcUmCzGV7nA/exec');
  const leads = data.leads || [];

  console.log('TOTAL DE LEADS NO BANCO:', leads.length);

  // Desduplica leads preservando a linha com maior progresso de cada ID
  const leadMap = new Map();
  leads.forEach(l => {
    if (!l || !l.id) return;
    if (!leadMap.has(l.id)) {
      leadMap.set(l.id, l);
    } else {
      const existing = leadMap.get(l.id);
      const maxStep = Math.max(existing.maxStepReached || existing.currentStep || 1, l.maxStepReached || l.currentStep || 1);
      const clicked = existing.clickedCheckout || l.clickedCheckout;
      const completed = existing.completed || l.completed;
      leadMap.set(l.id, {
        ...existing,
        ...l,
        maxStepReached: maxStep,
        clickedCheckout: clicked,
        completed: completed
      });
    }
  });

  const uniqueLeads = Array.from(leadMap.values());
  console.log('TOTAL DE LEADS ÚNICOS (REAIS):', uniqueLeads.length);

  function getLocalDateStr(isoStr) {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    const brDate = new Date(d.getTime() - (3 * 3600 * 1000));
    return brDate.toISOString().substring(0, 10);
  }

  const todayStr = '2026-10-17';
  const yesterdayStr = '2026-10-16';

  const todayLeads = uniqueLeads.filter(l => {
    const dStr = getLocalDateStr(l.startedAt || l.updatedAt);
    return dStr === todayStr;
  });

  const yesterdayLeads = uniqueLeads.filter(l => {
    const dStr = getLocalDateStr(l.startedAt || l.updatedAt);
    return dStr === yesterdayStr;
  });

  function analyze(subset, label) {
    console.log(`\n========================================`);
    console.log(`RELATÓRIO: ${label} (Total: ${subset.length} leads)`);
    console.log(`========================================`);

    if (subset.length === 0) {
      console.log('Nenhum lead encontrado para este período.');
      return;
    }

    const total = subset.length;
    const completed = subset.filter(l => (l.maxStepReached || l.currentStep) >= 18 || l.completed).length;
    const clickedCheckout = subset.filter(l => l.clickedCheckout).length;

    console.log(`Leads iniciados: ${total}`);
    console.log(`Chegaram ao Checkout (Etapa 18): ${completed} (${((completed/total)*100).toFixed(1)}%)`);
    console.log(`Clicaram no Checkout: ${clickedCheckout} (${((clickedCheckout/total)*100).toFixed(1)}%)`);

    // Dispositivos
    const devices = {};
    subset.forEach(l => {
      const dev = l.device || 'Desconhecido';
      devices[dev] = (devices[dev] || 0) + 1;
    });
    console.log('Dispositivos:', devices);

    console.log('\n--- RETENÇÃO PASSO A PASSO ---');
    FUNNEL_STEPS_META.forEach(step => {
      const reachedCount = subset.filter(l => (l.maxStepReached || l.currentStep) >= step.num).length;
      const pct = ((reachedCount / total) * 100).toFixed(1);
      const barLength = Math.round(pct / 4);
      const bar = '█'.repeat(barLength) + '░'.repeat(25 - barLength);
      console.log(`Etapa ${step.num.toString().padStart(2, '0')} | ${step.name.padEnd(30, ' ')} | ${reachedCount.toString().padStart(4, ' ')} leads (${pct.padStart(5, ' ')}%) | ${bar}`);
    });

    console.log('\n--- RESPOSTAS DOS LEADS (TOP RESPOSTAS) ---');
    ['idade', 'objetivo', 'regiao', 'exercicio'].forEach(key => {
      const counts = {};
      subset.forEach(l => {
        const a = (l.answers && l.answers[key]) ? l.answers[key] : 'Não preenchido';
        counts[a] = (counts[a] || 0) + 1;
      });
      console.log(`\n[${key.toUpperCase()}]:`);
      Object.entries(counts)
        .sort((a,b) => b[1] - a[1])
        .forEach(([val, count]) => {
          console.log(`  - ${val}: ${count} (${((count/total)*100).toFixed(1)}%)`);
        });
    });
  }

  analyze(todayLeads, `HOJE (${todayStr})`);
  analyze(yesterdayLeads, `ONTEM (${yesterdayStr})`);
  analyze(leads, `TOTAL GERAL HISTÓRICO`);
}

run().catch(console.error);
