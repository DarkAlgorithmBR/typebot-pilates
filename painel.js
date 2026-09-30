/**
 * Painel de Retenção & Inteligência de Leads - Pilates Tailandês
 * Especialista: Mali Santos
 * Funil com 18 Etapas (Ajustado com o Gancho Inicial + Idade na Etapa 1)
 */

const STORAGE_KEY = "pilates_leads";
const AUTH_KEY = "pilates_admin_auth";
const DEFAULT_PASS = "admin123";

// Definição das 18 etapas com nomes explicativos para visualização
const FUNNEL_STEPS_META = [
  { num: 1, name: "Idade / Boas-vindas", desc: "🔥 Gancho inicial + Qual a sua idade? (18 a 29, 30 a 39, 40 a 49, 50+)" },
  { num: 2, name: "Objetivo Principal", desc: "Perder barriga, força, flexibilidade, ansiedade, etc." },
  { num: 3, name: "Praticou Antes", desc: "Histórico com Pilates" },
  { num: 4, name: "Flexibilidade", desc: "Nível de flexibilidade atual" },
  { num: 5, name: "Físico Atual", desc: "Descrição do corpo hoje" },
  { num: 6, name: "Corpo dos Sonhos", desc: "Objetivo estético desejado" },
  { num: 7, name: "Melhor Físico", desc: "Tempo desde a melhor fase física" },
  { num: 8, name: "Região do Corpo Alvo", desc: "Região que quer atingir primeiro (Barriga, Glúteos, etc.)" },
  { num: 9, name: "Frequência Exercício", desc: "Quantas vezes treina por semana/mês" },
  { num: 10, name: "Horas de Sono", desc: "Qualidade do descanso diário" },
  { num: 11, name: "Motivo Principal", desc: "Gatilho emocional para entrar em forma" },
  { num: 12, name: "Altura em cm", desc: "Campo numérico de altura" },
  { num: 13, name: "Peso Atual (kg)", desc: "Campo numérico de peso atual" },
  { num: 14, name: "Peso Ideal (kg)", desc: "Campo numérico de peso desejado" },
  { num: 15, name: "Finalização do Plano (4s)", desc: "Pontinhos de digitação terminando o cronograma personalizado" },
  { num: 16, name: "Previsão & Gráfico de Peso", desc: "Gráfico visual de redução de peso em 4 semanas" },
  { num: 17, name: "Benefícios do Desafio", desc: "Apresentação detalhada do método 100% sem aparelhos" },
  { num: 18, name: "Checkout (R$ 37)", desc: "Oferta com garantia de 30 dias e redirecionamento" }
];

// Mapeamento amigável das perguntas para exibição no modal
const QUESTION_LABELS = {
  idade: "Qual a sua idade?",
  objetivo: "Qual o seu principal objetivo?",
  praticou: "Já praticou Pilates antes?",
  flexibilidade: "Nível de flexibilidade?",
  fisico: "Como descreveria seu físico hoje?",
  corpo_sonhos: "Qual é o corpo dos seus sonhos?",
  tempo_melhor_fisico: "Há quanto tempo esteve no melhor físico?",
  regiao: "Qual região gostaria de atingir primeiro?",
  exercicio: "Quantas vezes faz exercício?",
  sono: "Quantas horas dorme por dia?",
  motivo: "Qual seu principal motivo para entrar em forma?",
  altura: "Qual a sua altura em cm?",
  peso_atual: "Qual o seu peso atualmente em kg?",
  peso_desejado: "Qual o seu objetivo de peso ideal em kg?",
  preparada_transformacao: "Preparada para a transformação?",
  etapa_17: "Aceitou o Desafio Pilates?",
  etapa_18: "Clicou no Checkout Payt?"
};

let currentLeads = [];

// ==========================================
// AUTENTICAÇÃO E INICIALIZAÇÃO
// ==========================================
function checkAuth() {
  const isAuth = sessionStorage.getItem(AUTH_KEY) === "true";
  const loginOverlay = document.getElementById("login-overlay");
  const dashboardApp = document.getElementById("dashboard-app");

  if (isAuth) {
    loginOverlay.style.display = "none";
    dashboardApp.style.display = "block";
    loadDashboard();
  } else {
    loginOverlay.style.display = "flex";
    dashboardApp.style.display = "none";
  }
}

function handleLogin(e) {
  if (e && e.preventDefault) e.preventDefault();
  const pass = document.getElementById("admin-password").value;
  const errorEl = document.getElementById("login-error");

  if (pass === DEFAULT_PASS) {
    sessionStorage.setItem(AUTH_KEY, "true");
    document.getElementById("login-overlay").style.display = "none";
    document.getElementById("dashboard-app").style.display = "block";
    loadDashboard();
  } else {
    errorEl.style.display = "block";
    setTimeout(() => { errorEl.style.display = "none"; }, 3500);
  }
}

function handleLogout() {
  sessionStorage.removeItem(AUTH_KEY);
  window.location.reload();
}

// ==========================================
// CARREGAMENTO E MÉTRICAS DO DASHBOARD
// ==========================================
function getLeadsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Erro ao ler leads:", e);
    return [];
  }
}

function saveLeadsToStorage(leads) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  } catch (e) {
    console.error("Erro ao salvar leads:", e);
  }
}

function loadDashboard() {
  currentLeads = getLeadsFromStorage();
  renderKpis();
  renderFunnel();
  renderAdsIntelligence();
  renderLeadsTable();
}

// ==========================================
// 1. CARDS DE KPIS PRINCIPAIS
// ==========================================
function renderKpis() {
  const total = currentLeads.length;
  const completed = currentLeads.filter(l => (l.maxStepReached || l.currentStep) >= 18 || l.completed).length;
  const checkout = currentLeads.filter(l => l.clickedCheckout).length;
  
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const conversionRate = total > 0 ? ((checkout / total) * 100).toFixed(1) : "0.0";

  // Dispositivos
  const mobileCount = currentLeads.filter(l => l.device === "Mobile").length;
  const mobilePct = total > 0 ? Math.round((mobileCount / total) * 100) : 100;

  document.getElementById("kpi-total-leads").textContent = total;
  document.getElementById("kpi-completion-rate").textContent = `${completionRate}%`;
  document.getElementById("kpi-completed-count").textContent = `${completed} de ${total} leads chegaram na oferta final`;

  document.getElementById("kpi-checkout-clicks").textContent = checkout;
  document.getElementById("kpi-conversion-rate").textContent = `${conversionRate}% de conversão para a Payt`;

  document.getElementById("kpi-device-stat").textContent = `${mobilePct}% Mobile`;
  document.getElementById("kpi-device-details").textContent = `${mobileCount} mobile / ${total - mobileCount} desktop`;
}

// ==========================================
// 2. FUNIL DE RETENÇÃO (19 ETAPAS)
// ==========================================
function renderFunnel() {
  const container = document.getElementById("funnel-steps-list");
  container.innerHTML = "";

  const total = currentLeads.length;
  if (total === 0) {
    container.innerHTML = `<div style="text-align:center; padding: 24px; color: var(--text-muted);">Nenhum dado registrado ainda. Inicie um chat ou gere leads demo.</div>`;
    return;
  }

  // Calcula quantos leads alcançaram cada etapa
  const stepCounts = FUNNEL_STEPS_META.map(step => {
    const reached = currentLeads.filter(l => (l.maxStepReached || l.currentStep || 1) >= step.num).length;
    const pct = Math.round((reached / total) * 100);
    return { ...step, reached, pct };
  });

  // Identifica a maior queda (drop-off) entre etapas consecutivas
  let biggestDropStep = null;
  let biggestDropAmount = -1;

  for (let i = 1; i < stepCounts.length; i++) {
    const prev = stepCounts[i - 1].reached;
    const curr = stepCounts[i].reached;
    const drop = prev - curr;
    if (drop > biggestDropAmount && drop > 0) {
      biggestDropAmount = drop;
      biggestDropStep = stepCounts[i].num;
    }
  }

  stepCounts.forEach((step, idx) => {
    const prevReached = idx === 0 ? total : stepCounts[idx - 1].reached;
    const dropoffFromPrev = prevReached - step.reached;
    const isHotspot = step.num === biggestDropStep && dropoffFromPrev > 0;

    const row = document.createElement("div");
    row.className = `funnel-step-row ${isHotspot ? "is-dropoff-hotspot" : ""}`;

    const numStr = String(step.num).padStart(2, "0");
    const isLow = step.pct < 40;

    row.innerHTML = `
      <div class="step-info-top">
        <div class="step-title-wrap">
          <span class="step-num-badge">Etapa ${numStr}</span>
          <span style="color: #fff;">${step.name}</span>
          ${isHotspot ? `<span class="dropoff-alert-tag">⚠️ Maior Queda (-${dropoffFromPrev})</span>` : ""}
        </div>
        <div class="step-metrics-wrap">
          <span class="step-leads-count">${step.reached} leads</span>
          <span class="step-pct-val">${step.pct}%</span>
          ${idx > 0 && dropoffFromPrev > 0 ? `<span class="step-dropoff-badge">-${dropoffFromPrev}</span>` : ""}
        </div>
      </div>
      <div class="funnel-progress-track">
        <div class="funnel-progress-bar ${isLow ? "bar-low" : ""}" style="width: ${step.pct}%"></div>
      </div>
    `;

    container.appendChild(row);
  });
}

// ==========================================
// 3. INTELIGÊNCIA DE ADS & GANCHOS DE COPY
// ==========================================
function renderAdsIntelligence() {
  const total = currentLeads.length;

  if (total === 0) {
    document.getElementById("top-objective").textContent = "Sem dados";
    document.getElementById("top-age").textContent = "Sem dados";
    document.getElementById("top-region").textContent = "Sem dados";
    const topW = document.getElementById("top-weight-loss");
    if (topW) topW.textContent = "Sem dados";
    document.getElementById("ads-hooks-list").innerHTML = `<p style="color: var(--text-muted); font-size: 13px;">Gere leads de demonstração ou use o chat para gerar ganchos automáticos.</p>`;
    return;
  }

  // Função helper de contagem e dominante
  function getTopFrequency(key) {
    const counts = {};
    currentLeads.forEach(l => {
      const val = l.answers && l.answers[key];
      if (val) counts[val] = (counts[val] || 0) + 1;
    });
    let topVal = "-";
    let topCount = 0;
    for (const [val, count] of Object.entries(counts)) {
      if (count > topCount) {
        topCount = count;
        topVal = val;
      }
    }
    const pct = total > 0 && topCount > 0 ? Math.round((topCount / total) * 100) : 0;
    return { topVal, topCount, pct, counts };
  }

  const objStats = getTopFrequency("objetivo");
  const ageStats = getTopFrequency("idade");
  const regStats = getTopFrequency("regiao");
  const motStats = getTopFrequency("motivo");
  const fisStats = getTopFrequency("fisico");

  // Média de redução de peso desejada (peso_atual - peso_desejado)
  let totalLoss = 0;
  let lossCount = 0;
  currentLeads.forEach(l => {
    const p1 = parseFloat(l.answers?.peso_atual);
    const p2 = parseFloat(l.answers?.peso_desejado);
    if (!isNaN(p1) && !isNaN(p2) && p1 > p2) {
      totalLoss += (p1 - p2);
      lossCount++;
    }
  });
  const avgLoss = lossCount > 0 ? (totalLoss / lossCount).toFixed(1) : "9.2";

  document.getElementById("top-objective").textContent = objStats.topVal || "Perder barriga";
  document.getElementById("top-objective-pct").textContent = `${objStats.pct}% das respostas`;

  document.getElementById("top-age").textContent = ageStats.topVal || "40 - 49";
  document.getElementById("top-age-pct").textContent = `${ageStats.pct}% do público`;

  document.getElementById("top-region").textContent = regStats.topVal || "Barriga";
  document.getElementById("top-region-pct").textContent = `${regStats.pct}% foco principal`;

  const topWeightLossEl = document.getElementById("top-weight-loss");
  const topWeightLossSubEl = document.getElementById("top-weight-loss-sub");
  if (topWeightLossEl) topWeightLossEl.textContent = `-${avgLoss} kg`;
  if (topWeightLossSubEl) topWeightLossSubEl.textContent = `${lossCount} metas registradas`;

  // GERAÇÃO DE GANCHOS PARA ANÚNCIOS (HOOKS & SCRIPTS)
  const hooksContainer = document.getElementById("ads-hooks-list");
  hooksContainer.innerHTML = "";

  const dominantObj = objStats.topVal !== "-" ? objStats.topVal : "Perder barriga";
  const dominantAge = ageStats.topVal !== "-" ? ageStats.topVal : "40 - 49";
  const dominantReg = regStats.topVal !== "-" ? regStats.topVal : "barriga";
  const dominantMot = motStats.topVal !== "-" ? motStats.topVal : "me sentir mais confiante no meu corpo";

  const generatedHooks = [
    {
      angle: `ÂNGULO 1: DOR + FAIXA ETÁRIA (${dominantAge})`,
      headline: `🚨 Para mulheres de ${dominantAge} anos que sentem que a ${dominantReg.toLowerCase()} não diminui mesmo com dieta:`,
      script: `"Se você já tentou de tudo e sente que seu metabolismo desacelerou, academias pesadas só te deixam dolorida. O método de 15 minutos de Pilates Tailandês ativa o abdômen profundo e acelera a queima de gordura sem impacto!"`
    },
    {
      angle: `ÂNGULO 2: ZERO IMPACTO & FIM DAS DORES NAS COSTAS`,
      headline: `🩺 "Quero tonificar meu corpo, mas tenho dores nas costas e articulações..."`,
      script: `"Você não precisa pular nem levantar peso pesado. O Pilates Tailandês fortalece a musculatura postural, queima gordura e alivia as dores na coluna em apenas 4 semanas."`
    },
    {
      angle: `ÂNGULO 3: META DE EMAGRECIMENTO REALISTA (-${avgLoss} KG)`,
      headline: `🎯 Como eliminar em média ${avgLoss} kg em 4 semanas sem sair de casa:`,
      script: `"Com base nas avaliações reais de centenas de mulheres, nosso Desafio de 28 Dias proporciona uma perda média de ${avgLoss}kg focada em desinchar o abdômen e tonificar as pernas, com apenas 15 minutos por dia de Pilates Tailandês!"`
    },
    {
      angle: `ÂNGULO 4: GATILHO EMOCIONAL (${dominantMot.toUpperCase()})`,
      headline: `✨ Sabe aquela roupa guardada que você sonha em voltar a vestir com orgulho?`,
      script: `"O principal desejo da maioria das mulheres não é apenas perder peso, mas sim voltar a ${dominantMot.toLowerCase()}. Em 28 dias você volta a se sentir bem com o próprio corpo sem mensalidades abusivas de academia."`
    },
    {
      angle: `ÂNGULO 5: COMPARATIVO VS ACADEMIA CARA`,
      headline: `❌ Mensalidades de academia chegam a R$ 200/mês fora nutricionistas e personais!`,
      script: `"Por que pagar caro todo mês se você pode ter um cronograma completo guiado em vídeo por apenas R$ 37 taxa única? Sem aparelhos caros, sem impacto e com garantia de 30 dias!"`
    },
    {
      angle: `ÂNGULO 6: FALTA DE TEMPO (ROTINA DE 15 MIN)`,
      headline: `⏰ "Não tenho tempo para treinar na correria do dia a dia..."`,
      script: `"Você tem 15 a 20 minutos antes do banho ou logo ao acordar? Esse é o único tempo que você precisa para praticar o Pilates Tailandês e transformar o seu corpo em 28 dias."`
    }
  ];

  generatedHooks.forEach((hook, i) => {
    const card = document.createElement("div");
    card.className = "hook-card";

    card.innerHTML = `
      <div class="hook-angle-tag">${hook.angle}</div>
      <div class="hook-headline">${hook.headline}</div>
      <div class="hook-script">${hook.script}</div>
      <div class="hook-actions">
        <button class="btn-copy-hook" onclick="copyHookToClipboard(this, ${i})">
          <span>📋</span> Copiar Gancho
        </button>
      </div>
    `;

    hooksContainer.appendChild(card);
  });

  // Guardar hooks globalmente para cópia fácil
  window._generatedHooks = generatedHooks;

  // Sugestão de segmentação para o Meta Ads
  const metaTargetingEl = document.getElementById("meta-targeting-content");
  metaTargetingEl.innerHTML = `
    <div class="targeting-item">
      <span>👩</span> <strong>Gênero:</strong> Mulheres
    </div>
    <div class="targeting-item">
      <span>🎂</span> <strong>Idade Recomendada:</strong> ${ageStats.topVal.includes("50") ? "35 a 65+ anos" : "28 a 55 anos"}
    </div>
    <div class="targeting-item">
      <span>📍</span> <strong>Localização:</strong> Brasil (Todo o país)
    </div>
    <div class="targeting-item">
      <span>🎯</span> <strong>Interesses Sugeridos (Meta Ads):</strong> Pilates, Joseph Pilates, Saúde da Mulher, Yoga, Perda de peso, Qualidade de vida, Exercício físico, Fisioterapia
    </div>
    <div class="targeting-item">
      <span>📱</span> <strong>Posicionamentos Ideais:</strong> Instagram Reels, Instagram Stories e Feed do Facebook (Mobile First)
    </div>
  `;
}

function copyHookToClipboard(btn, index) {
  const hook = window._generatedHooks && window._generatedHooks[index];
  if (!hook) return;

  const fullText = `${hook.headline}\n\n${hook.script}`;

  function onSuccess() {
    btn.classList.add("copied");
    btn.innerHTML = `<span>✓</span> Copiado!`;
    setTimeout(() => {
      btn.classList.remove("copied");
      btn.innerHTML = `<span>📋</span> Copiar Gancho`;
    }, 2500);
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(fullText).then(onSuccess).catch(() => fallbackCopy());
  } else {
    fallbackCopy();
  }

  function fallbackCopy() {
    const ta = document.createElement("textarea");
    ta.value = fullText;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand("copy");
      onSuccess();
    } catch (e) {
      console.warn("Falha ao copiar:", e);
    }
    document.body.removeChild(ta);
  }
}

// ==========================================
// 4. TABELA DE LEADS & FILTROS
// ==========================================
function renderLeadsTable() {
  const tbody = document.getElementById("leads-table-body");
  const emptyState = document.getElementById("empty-state");
  const search = (document.getElementById("lead-search-input").value || "").toLowerCase().trim();
  const filter = document.getElementById("status-filter").value;

  tbody.innerHTML = "";

  let filtered = currentLeads.filter(lead => {
    // Filtro por status (19 Etapas)
    const reachedFinal = (lead.maxStepReached || lead.currentStep || 1) >= 19 || lead.completed;
    const clickedCheckout = lead.clickedCheckout === true;

    if (filter === "checkout" && !clickedCheckout) return false;
    if (filter === "completed" && !reachedFinal) return false;
    if (filter === "dropoff" && reachedFinal) return false;

    // Busca textual
    if (search) {
      const answersText = Object.values(lead.answers || {}).join(" ").toLowerCase();
      const idMatch = (lead.id || "").toLowerCase().includes(search);
      const objMatch = (lead.answers?.objetivo || "").toLowerCase().includes(search);
      const ageMatch = (lead.answers?.idade || "").toLowerCase().includes(search);
      if (!idMatch && !objMatch && !ageMatch && !answersText.includes(search)) {
        return false;
      }
    }

    return true;
  });

  if (filtered.length === 0) {
    emptyState.style.display = "block";
    return;
  }
  emptyState.style.display = "none";

  filtered.forEach(lead => {
    const tr = document.createElement("tr");

    const dateStr = lead.startedAt ? formatDateTime(lead.startedAt) : "-";
    const stepNum = lead.maxStepReached || lead.currentStep || 1;
    const objective = lead.answers?.objetivo || "-";
    const age = lead.answers?.idade || "-";
    const altura = lead.answers?.altura ? `${lead.answers.altura} cm` : "-";

    let pesoStr = "-";
    if (lead.answers?.peso_atual) {
      pesoStr = `${lead.answers.peso_atual} kg`;
      if (lead.answers?.peso_desejado) {
        pesoStr += ` ➔ ${lead.answers.peso_desejado} kg`;
      }
    }
    const region = lead.answers?.regiao || "-";

    // Status Badge
    let statusBadge = "";
    if (lead.clickedCheckout) {
      statusBadge = `<span class="status-badge status-checkout">🟢 Checkout Payt</span>`;
    } else if (stepNum >= 19 || lead.completed) {
      statusBadge = `<span class="status-badge status-completed">🟡 Chegou na Oferta</span>`;
    } else {
      statusBadge = `<span class="status-badge status-dropoff">🔴 Parou na Etapa ${stepNum}</span>`;
    }

    tr.innerHTML = `
      <td style="font-family: monospace; font-size: 11px; color: var(--text-secondary);">${lead.id ? lead.id.substring(0, 14) + "..." : "-"}</td>
      <td>${dateStr}</td>
      <td><span style="font-size: 12px; color: #cbd5e1;">${lead.device === "Mobile" ? "📱 Mobile" : "💻 Desktop"}</span></td>
      <td><strong style="color: #fff;">Etapa ${stepNum}/19</strong></td>
      <td style="color: var(--accent-green); font-weight: 600;">${objective}</td>
      <td>${age}</td>
      <td>${altura}</td>
      <td style="color: var(--accent-teal); font-weight: 600;">${pesoStr}</td>
      <td>${region}</td>
      <td>${statusBadge}</td>
      <td style="text-align: right;">
        <button class="btn-view-lead" onclick="openLeadModal('${lead.id}')">
          🔍 Ver Respostas
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function filterLeadsTable() {
  renderLeadsTable();
}

function formatDateTime(isoString) {
  try {
    const d = new Date(isoString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month} ${hours}:${mins}`;
  } catch (e) {
    return isoString;
  }
}

// ==========================================
// 5. MODAL DE DETALHES DO LEAD
// ==========================================
function openLeadModal(leadId) {
  const lead = currentLeads.find(l => l.id === leadId);
  if (!lead) return;

  const modal = document.getElementById("lead-modal");
  const titleEl = document.getElementById("modal-lead-title");
  const metaEl = document.getElementById("modal-lead-meta");
  const contentEl = document.getElementById("modal-lead-content");

  titleEl.textContent = `Lead: ${lead.id}`;
  metaEl.textContent = `Início: ${formatDateTime(lead.startedAt)} | Dispositivo: ${lead.device} | Etapa: ${lead.maxStepReached || 1}/18 | Checkout: ${lead.clickedCheckout ? "Sim (Payt)" : "Não"}`;

  contentEl.innerHTML = "";

  const answers = lead.answers || {};
  const answerEntries = Object.entries(answers);

  if (answerEntries.length === 0) {
    contentEl.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 20px;">O lead iniciou o chat mas não chegou a selecionar nenhuma resposta.</p>`;
  } else {
    answerEntries.forEach(([key, val]) => {
      const qLabel = QUESTION_LABELS[key] || `Pergunta (${key})`;
      const card = document.createElement("div");
      card.className = "qa-card";
      card.innerHTML = `
        <div class="qa-question">${qLabel}</div>
        <div class="qa-answer">${val}</div>
      `;
      contentEl.appendChild(card);
    });
  }

  modal.style.display = "flex";
}

function closeLeadModal() {
  document.getElementById("lead-modal").style.display = "none";
}

// Fecha modal ao clicar fora
window.addEventListener("click", (e) => {
  const modal = document.getElementById("lead-modal");
  if (e.target === modal) {
    closeLeadModal();
  }
});

// ==========================================
// 6. GERADOR DE LEADS DE DEMONSTRAÇÃO (30 LEADS REALISTAS EM 19 ETAPAS)
// ==========================================
function generateDemoLeads() {
  if (currentLeads.length > 0 && !confirm("Já existem dados de leads salvos. Deseja adicionar mais 30 leads de demonstração hiper-realistas para análise?")) {
    return;
  }

  const ageOptions = ["18 a 29 anos", "30 a 39 anos", "30 a 39 anos", "40 a 49 anos", "40 a 49 anos", "50 anos ou mais"];
  const objOptions = [
    "Perder barriga",
    "Perder barriga",
    "Perder barriga",
    "Desenvolver a flexibilidade",
    "Reduzir as dores corporais",
    "Aumentar a força muscular",
    "Reduzir o estresse e ansiedade"
  ];
  const pracOptions = [
    "Nunca fiz",
    "Nunca fiz",
    "Já fiz algumas vezes, mas não com frequência",
    "Sim, já pratico regularmente"
  ];
  const flexOptions = ["Não sou flexível", "Mais ou menos flexível", "Mais ou menos flexível", "Sou flexível"];
  const fisOptions = ["Um pouco acima do peso", "Um pouco acima do peso", "Acima do peso", "Média", "Magra"];
  const corpOptions = ["Tonificada", "Média", "Com curvas", "Magra"];
  const melhOptions = ["Há mais de 3 anos", "1 a 2 anos atrás", "Há menos de um ano", "Não sei dizer"];
  const regOptions = ["Barriga", "Barriga", "Barriga", "Glúetos", "Pernas", "Peito"];
  const exOptions = ["Poucas vezes", "Algumas vezes na semana", "Algumas vezes por mês", "Quase todos os dias"];
  const sonoOptions = ["5-6 horas", "7-8 horas", "Menos de 5 horas", "Mais de 8 horas"];
  const motOptions = [
    "Me sentir mais confiante no meu corpo",
    "Me sentir mais confiante no meu corpo",
    "Me sentir mais saudável e com energia",
    "Vestir melhor minhas roupas",
    "Voltar a forma após o parto"
  ];

  const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const demoLeads = [];
  const now = Date.now();

  for (let i = 1; i <= 30; i++) {
    const minutesAgo = (30 - i) * 14;
    const started = new Date(now - minutesAgo * 60000).toISOString();
    
    // Distribuição de retenção natural ao longo das 18 etapas
    let maxStep;
    const r = Math.random();
    if (r < 0.08) maxStep = Math.floor(Math.random() * 4) + 1; // drop etapas 1-4
    else if (r < 0.18) maxStep = Math.floor(Math.random() * 6) + 5; // drop etapas 5-10
    else if (r < 0.32) maxStep = Math.floor(Math.random() * 3) + 12; // drop altura/peso 12-14
    else if (r < 0.42) maxStep = 15; // drop no cálculo
    else if (r < 0.58) maxStep = 16; // drop no gráfico
    else if (r < 0.70) maxStep = 17; // drop nos benefícios
    else maxStep = 18; // concluiu o funil

    const completed = maxStep >= 18;
    const clickedCheckout = completed && Math.random() < 0.55;

    const leadAnswers = {
      idade: randomChoice(ageOptions)
    };

    if (maxStep >= 2) leadAnswers.objetivo = randomChoice(objOptions);
    if (maxStep >= 3) leadAnswers.praticou = randomChoice(pracOptions);
    if (maxStep >= 4) leadAnswers.flexibilidade = randomChoice(flexOptions);
    if (maxStep >= 5) leadAnswers.fisico = randomChoice(fisOptions);
    if (maxStep >= 6) leadAnswers.corpo_sonhos = randomChoice(corpOptions);
    if (maxStep >= 7) leadAnswers.tempo_melhor_fisico = randomChoice(melhOptions);
    if (maxStep >= 8) leadAnswers.regiao = randomChoice(regOptions);
    if (maxStep >= 9) leadAnswers.exercicio = randomChoice(exOptions);
    if (maxStep >= 10) leadAnswers.sono = randomChoice(sonoOptions);
    if (maxStep >= 11) leadAnswers.motivo = randomChoice(motOptions);

    const demoHeight = Math.floor(Math.random() * 22) + 154; // 154 a 176 cm
    const demoWeightCurrent = Math.floor(Math.random() * 26) + 68; // 68 a 94 kg
    const demoLoss = Math.floor(Math.random() * 8) + 6; // 6 a 14 kg
    const demoWeightTarget = demoWeightCurrent - demoLoss;

    if (maxStep >= 12) leadAnswers.altura = String(demoHeight);
    if (maxStep >= 13) leadAnswers.peso_atual = String(demoWeightCurrent);
    if (maxStep >= 14) leadAnswers.peso_desejado = String(demoWeightTarget);
    if (maxStep >= 16) leadAnswers.preparada_transformacao = "SIM, ESTOU PREPARADA!";
    if (maxStep >= 17) leadAnswers.etapa_17 = "SIM, EU ACEITO O DESAFIO!";
    if (clickedCheckout) leadAnswers.etapa_18 = "QUERO COMEÇAR A MINHA TRANSFORMAÇÃO AGORA (R$ 37)";

    demoLeads.push({
      id: `lead_demo_${String(i).padStart(2, "0")}_${Math.random().toString(36).substring(2, 6)}`,
      startedAt: started,
      updatedAt: new Date(new Date(started).getTime() + 180000).toISOString(),
      currentStep: maxStep,
      maxStepReached: maxStep,
      completed,
      clickedCheckout,
      device: Math.random() < 0.88 ? "Mobile" : "Desktop",
      answers: leadAnswers
    });
  }

  // Adiciona ao topo dos existentes
  currentLeads = [...demoLeads, ...currentLeads];
  saveLeadsToStorage(currentLeads);
  loadDashboard();

  alert("🎉 30 Leads de demonstração gerados com sucesso!\nVocê já pode analisar os gráficos de retenção e os ganchos de Ads gerados para o funil de 18 etapas.");
}

// ==========================================
// 7. EXPORTAÇÃO PARA CSV (EXCEL / GOOGLE SHEETS)
// ==========================================
function exportLeadsCSV() {
  if (currentLeads.length === 0) {
    alert("Nenhum lead para exportar.");
    return;
  }

  const headers = [
    "ID Lead",
    "Data Inicio",
    "Dispositivo",
    "Etapa Maxima",
    "Concluiu Funil",
    "Clicou Checkout Payt",
    "Idade",
    "Objetivo",
    "Praticou Antes",
    "Flexibilidade",
    "Fisico Atual",
    "Corpo Sonhos",
    "Tempo Melhor Fisico",
    "Regiao Alvo",
    "Frequencia Exercicio",
    "Horas Sono",
    "Principal Motivo",
    "Altura (cm)",
    "Peso Atual (kg)",
    "Peso Desejado (kg)",
    "Meta Reducao (kg)"
  ];

  const rows = currentLeads.map(lead => {
    const a = lead.answers || {};
    const pAtual = parseFloat(a.peso_atual);
    const pDesejado = parseFloat(a.peso_desejado);
    const diff = (!isNaN(pAtual) && !isNaN(pDesejado)) ? (pAtual - pDesejado).toFixed(1) : "";

    return [
      lead.id,
      lead.startedAt,
      lead.device,
      lead.maxStepReached || lead.currentStep || 1,
      lead.completed ? "SIM" : "NAO",
      lead.clickedCheckout ? "SIM" : "NAO",
      `"${(a.idade || "").replace(/"/g, '""')}"`,
      `"${(a.objetivo || "").replace(/"/g, '""')}"`,
      `"${(a.praticou || "").replace(/"/g, '""')}"`,
      `"${(a.flexibilidade || "").replace(/"/g, '""')}"`,
      `"${(a.fisico || "").replace(/"/g, '""')}"`,
      `"${(a.corpo_sonhos || "").replace(/"/g, '""')}"`,
      `"${(a.tempo_melhor_fisico || "").replace(/"/g, '""')}"`,
      `"${(a.regiao || "").replace(/"/g, '""')}"`,
      `"${(a.exercicio || "").replace(/"/g, '""')}"`,
      `"${(a.sono || "").replace(/"/g, '""')}"`,
      `"${(a.motivo || "").replace(/"/g, '""')}"`,
      `"${(a.altura || "").replace(/"/g, '""')}"`,
      `"${(a.peso_atual || "").replace(/"/g, '""')}"`,
      `"${(a.peso_desejado || "").replace(/"/g, '""')}"`,
      `"${diff}"`
    ].join(";");
  });

  // BOM para compatibilidade com acentos no Excel Windows
  const csvContent = "\uFEFF" + [headers.join(";"), ...rows].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `leads_pilates_tailandes_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ==========================================
// 8. LIMPAR DADOS
// ==========================================
function clearAllData() {
  if (confirm("⚠️ ATENÇÃO: Tem certeza que deseja apagar todos os leads gravados no navegador? Esta ação não pode ser desfeita.")) {
    localStorage.removeItem(STORAGE_KEY);
    currentLeads = [];
    loadDashboard();
    alert("Dados limpos com sucesso.");
  }
}

// ==========================================
// ATRIBUIÇÃO DE EVENTOS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  checkAuth();

  document.getElementById("btn-demo-data").addEventListener("click", generateDemoLeads);
  document.getElementById("btn-export-csv").addEventListener("click", exportLeadsCSV);
  document.getElementById("btn-clear-data").addEventListener("click", clearAllData);
  document.getElementById("btn-logout").addEventListener("click", handleLogout);
});
