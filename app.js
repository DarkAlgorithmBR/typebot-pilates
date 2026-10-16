/**
 * Pilates Tailandês - Funil WhatsApp Typebot
 * Especialista: Mali Santos
 */

// ==========================================
// CONFIGURAÇÕES GERAIS
// ==========================================
// Link oficial de checkout (Zuptos):
const CHECKOUT_PAYT_URL = "https://app.zuptos.com.br/checkout/7dda6e09d2f964c0";

// Estado da conversa e respostas do usuário
const state = {
  currentStepIndex: 0,
  userResponses: {},
  soundEnabled: true
};

// ==========================================
// RASTREAMENTO & ANALYTICS (DASHBOARD PRIVADO)
// ==========================================
const Tracker = {
  STORAGE_KEY: "pilates_leads",
  GOOGLE_SHEETS_URL: "https://script.google.com/macros/s/AKfycby0xd-wdy9vJZZO8nq8x7PIlE1yON6if4eTjZmul86SM3OemdSne8sKW9rWcUmCzGV7nA/exec",
  currentLeadId: null,

  init() {
    let sid = sessionStorage.getItem("pilates_session_id");
    if (!sid) {
      sid = "lead_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
      sessionStorage.setItem("pilates_session_id", sid);
    }
    this.currentLeadId = sid;

    const leads = this.getAllLeads();
    let lead = leads.find(l => l.id === sid);
    if (!lead) {
      lead = {
        id: sid,
        startedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        currentStep: 1,
        maxStepReached: 1,
        completed: false,
        clickedCheckout: false,
        device: /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent) ? "Mobile" : "Desktop",
        answers: {}
      };
      leads.unshift(lead);
      this.saveAllLeads(leads);
      this.syncLead(lead);
    }
  },

  getAllLeads() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn("Tracker read error:", e);
      return [];
    }
  },

  saveAllLeads(leads) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(leads));
    } catch (e) {
      console.warn("Tracker save error:", e);
    }
  },

  getCurrentLead() {
    const leads = this.getAllLeads();
    return leads.find(l => l.id === this.currentLeadId) || null;
  },

  trackStep(stepNumber) {
    const leads = this.getAllLeads();
    const lead = leads.find(l => l.id === this.currentLeadId);
    if (!lead) return;

    lead.currentStep = stepNumber;
    if (stepNumber > (lead.maxStepReached || 1)) {
      lead.maxStepReached = stepNumber;
    }
    if (stepNumber >= 18) {
      lead.completed = true;
    }
    lead.updatedAt = new Date().toISOString();
    this.saveAllLeads(leads);
    this.syncLead(lead);
  },

  trackAnswer(key, answer) {
    const leads = this.getAllLeads();
    const lead = leads.find(l => l.id === this.currentLeadId);
    if (!lead) return;

    if (!lead.answers) lead.answers = {};
    lead.answers[key] = answer;
    lead.updatedAt = new Date().toISOString();
    this.saveAllLeads(leads);
    this.syncLead(lead);
  },

  trackCheckout() {
    const leads = this.getAllLeads();
    const lead = leads.find(l => l.id === this.currentLeadId);
    if (!lead) return;

    lead.clickedCheckout = true;
    lead.completed = true;
    lead.updatedAt = new Date().toISOString();
    this.saveAllLeads(leads);
    this.syncLead(lead);
  },

  syncLead(lead) {
    if (!this.GOOGLE_SHEETS_URL || !lead) return;
    try {
      const stepIdx = (lead.currentStep || 1) - 1;
      let stepName = `Etapa ${lead.currentStep || 1}`;
      if (typeof funnelSteps !== "undefined" && funnelSteps[stepIdx] && funnelSteps[stepIdx].messages && funnelSteps[stepIdx].messages[0]) {
        stepName = `Etapa ${lead.currentStep} - ${funnelSteps[stepIdx].messages[0].substring(0, 35)}`;
      }

      const payload = {
        id: lead.id,
        currentStep: lead.currentStep || 1,
        maxStepReached: lead.maxStepReached || lead.currentStep || 1,
        stepName: stepName,
        completed: !!lead.completed,
        clickedCheckout: !!lead.clickedCheckout,
        device: lead.device || "Mobile",
        answers: lead.answers || {}
      };

      fetch(this.GOOGLE_SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      }).catch(() => {});
    } catch (e) {
      // Ignora silenciosamente para não interromper a usuária
    }
  }
};

// ==========================================
// EFEITOS SONOROS (ÁUDIO NATIVO E ORIGINAL DO WHATSAPP)
// ==========================================
// Áudio nativo gravado do WhatsApp com fallback em Base64
const WHATSAPP_NOTIFICATION_B64 = "data:audio/mp3;base64,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REArE4lpmZT/+1JkEADxlCbZdxoAAAAADSDgAAEF3SF744BeeAAANIAAAASv9////+taLiky6Cp1v////0kHmKqpVTABgASAoccNyB4ikRsRIlh0xM06xx2sMv//+n1T//f3Ekunug///yHBIop5mqqpcQFsA34KezhQoLY4G7FAQETYxdIBN//Ry37VT6P//jP/////J/5n//+yiKpZ4iZmnQBpCPwIBGbgLSS5qCW8A7rE/eAM4DJ//6t2/9Gt//iu3////+h7f9W//+XoameICJl0AeQgcP/7UmQ1gPGCSF74wynEAAANIAAAAQYhHXPhmUkYAAA0gAAABAuJusuoKS11nk3PqsmesmPExAlBt/t+l/XUyO///Hqf////UcMCU1nd4iHcwXkAGAHgOp8ymbqUkZss1akzHJgtSx+cATyDv9X//SUe///UMz////VA6FWSXDaEGtABgBUrhuKhf3/ahz2F+akB9EDdCRJz1n9f/+tZw32d//54VY8v/////Ea5sNv4gxmAIAeTSY3O690akjNVBMwTQMxjCKgafDs1///6JiUT//tSZFsA8YJIWvmgP5QAAA0gAAABBgUbZeaA/lgAADSAAAAE+p//9Yrq////scUqV3iICHQFrgAgLspqdbJ/UzJoG7JmhBy8ECY6X3//6BdH0tlHj//9Qrh////7KIYt22xBHYAoF9Flop3XVrc2JkpG+5MjmgYpILcjR///WpJMmCWbX//xzjT9X//7IAuUff+oATADAJ26CLzZJaDrWjUswqMyMNgJZIv///+cIKbIpn1//5G/1M//0NcE3F23HpBEgCYGoTk4h9oTq4F94B3/+1JkgQDxhCbU6QyjJAAADSAAAAEF9RtbqYBeUAAANIAAAARAcY9tb///uUh3qUs0//0hBQev////+3/se//7GJg6BFEuQAnQaYG/ITqzWOawGSnjDvgQBGFg+aV/hgIGOrMGKS1bf/oGZ5EfxpLRmf+rzMoAZVkGFDY0ToP////0//UXVf/qQojZAR/ApJgJTp2sjzBdWrEvltOqAMAYxTFo1R8cxYEkv8j616Haaz30m//sajVFwM8y/1IpIl0mgKAMAFEgNA0rkRS2////5//7UmSnAPF0Rtn6ABecAAANIAAAAQYNG1eqAL5QAAA0gAAABD/ykVm//Y4mPomxtQIBggAd23uv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";

const AudioController = {
  receiveAudio: null,
  isUnlocked: false,

  init() {
    if (!this.receiveAudio) {
      this.receiveAudio = new Audio("whatsapp-notification.mp3");
      this.receiveAudio.preload = "auto";
      this.receiveAudio.onerror = () => {
        this.receiveAudio.src = WHATSAPP_NOTIFICATION_B64;
      };
    }
  },

  unlock() {
    if (this.isUnlocked) return;
    this.init();
    if (this.receiveAudio) {
      this.receiveAudio.play().then(() => {
        this.receiveAudio.pause();
        this.receiveAudio.currentTime = 0;
        this.isUnlocked = true;
      }).catch(() => {});
    }
  },

  playReceive() {
    if (!state.soundEnabled) return;
    try {
      this.init();
      if (this.receiveAudio) {
        this.receiveAudio.currentTime = 0;
        const playPromise = this.receiveAudio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            if (!this.receiveAudio.src.startsWith("data:")) {
              this.receiveAudio.src = WHATSAPP_NOTIFICATION_B64;
              this.receiveAudio.play().catch(() => {});
            }
          });
        }
      }
    } catch (e) {
      console.warn("Audio play error:", e);
    }
  },

  playSend() {
    if (!state.soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      }
    } catch (e) {}
  }
};

// Desbloqueia áudio no primeiro clique/toque do usuário (política de navegadores)
document.addEventListener("click", () => {
  AudioController.unlock();
}, { once: true });
document.addEventListener("touchstart", () => {
  AudioController.unlock();
}, { once: true });

// ==========================================
// DADOS DAS 18 ETAPAS DO FUNIL (AJUSTADO CONFORME O FUNIL ORIGINAL)
// ==========================================
const funnelSteps = [
  {
    step: 1,
    key: "idade",
    messages: [
      "🔥 Quer transformar seu corpo sem precisar de academia? 🔥",
      "Se você quer perder peso, ganhar massa magra e melhorar sua autoestima *com treinos em casa*, tenho algo especial para você.",
      "Em apenas *15 minutos por dia*, você pode ter resultados visíveis em *28 dias*.",
      "👉 Antes de te mostrar como, me conta: *qual a sua idade?*"
    ],
    type: "choice",
    options: ["18 a 29 anos", "30 a 39 anos", "40 a 49 anos", "50 anos ou mais"]
  },
  {
    step: 2,
    key: "objetivo",
    messages: ["Legal, e qual é seu principal objetivo com o pilates?"],
    type: "choice",
    options: [
      "Perder barriga",
      "Aumentar a força muscular",
      "Desenvolver a flexibilidade",
      "Reduzir o estresse e ansiedade",
      "Reduzir as dores corporais"
    ]
  },
  {
    step: 3,
    key: "praticou",
    messages: ["Você já praticou Pilates antes?"],
    type: "choice",
    options: [
      "Sim, já pratico regularmente",
      "Já fiz algumas vezes, mas não com frequência",
      "Nunca fiz"
    ]
  },
  {
    step: 4,
    key: "flexibilidade",
    messages: [
      "Qual é seu nível de flexibilidade?",
      "_Não importa seu nível, vamos elaborar um plano totalmente *especial* para você!_"
    ],
    type: "choice",
    options: ["Sou flexível", "Mais ou menos flexível", "Não sou flexível"]
  },
  {
    step: 5,
    key: "fisico",
    messages: ["Como você descreveria seu fisico?"],
    type: "choice",
    options: ["Magra", "Média", "Um pouco acima do peso", "Acima do peso"]
  },
  {
    step: 6,
    key: "corpo_sonhos",
    messages: ["Qual é o seu \"corpo dos sonhos\"?"],
    type: "choice",
    options: ["Magra", "Tonificada", "Com curvas", "Média"]
  },
  {
    step: 7,
    key: "tempo_melhor_fisico",
    messages: ["Há quanto tempo você esteve no melhor físico de sua vida?"],
    type: "choice",
    options: ["Há menos de um ano", "1 a 2 anos atrás", "Há mais de 3 anos", "Não sei dizer"]
  },
  {
    step: 8,
    key: "regiao",
    messages: ["Qual região do corpo você gostaria de atingir primeiro?"],
    type: "choice",
    options: ["Barriga", "Glúetos", "Pernas", "Peito"]
  },
  {
    step: 9,
    key: "exercicio",
    messages: ["Quantas vezes faz exercício?"],
    type: "choice",
    options: ["Quase todos os dias", "Algumas vezes na semana", "Algumas vezes por mês", "Poucas vezes"]
  },
  {
    step: 10,
    key: "sono",
    messages: [
      "Já estou terminando, só me responde mais algumas perguntinhas por favor",
      "Quantas horas você dorme por dia?"
    ],
    type: "choice",
    options: ["Menos de 5 horas", "5-6 horas", "7-8 horas", "Mais de 8 horas"]
  },
  {
    step: 11,
    key: "motivo",
    messages: ["Qual é o seu principal motivo para entrar em forma?"],
    type: "choice",
    options: [
      "Me sentir mais confiante no meu corpo",
      "Me sentir mais saudável e com energia",
      "Vestir melhor minhas roupas",
      "Voltar a forma após o parto",
      "Outros"
    ]
  },
  {
    step: 12,
    key: "altura",
    messages: ["Qual a sua altura em cm?"],
    type: "number_input",
    placeholder: "Ex: 170",
    unit: "cm"
  },
  {
    step: 13,
    key: "peso_atual",
    messages: ["Qual é o seu peso atualmente em kgs?"],
    type: "number_input",
    placeholder: "Ex: 80",
    unit: "kg"
  },
  {
    step: 14,
    key: "peso_desejado",
    messages: ["Entendi! E qual é o seu objetivo de peso ideal em kgs?"],
    type: "number_input",
    placeholder: "Ex: 68",
    unit: "kg"
  },
  {
    step: 15,
    messages: [
      "Terminando seu plano de Pilates Tailandês personalizado..."
    ],
    type: "calculation_wait",
    waitDuration: 4000
  },
  {
    step: 16,
    messages: [
      "Seu Plano de Pilates Tailandês está pronto! 🔥",
      "De acordo com as informações que você me passou, prevemos que você alcançará sua meta em apenas 4 semanas."
    ],
    type: "chart_step",
    options: ["SIM, ESTOU PREPARADA!"]
  },
  {
    step: 17,
    messages: [
      "Deixa eu te explicar como irá funcionar...",
      "Você receberá treinos personalizados exclusivamente para você, todos os dias! Exercícios que você pode fazer em casa:\n\n✅ Perca de peso\n✅ Ganho de massa magra\n✅ Alivio de dores nas costas\n✅ Melhora da postura\n✅ Aumento da autoestima\n✅ Aumento da libido\n✅ Melhora da flexibilidade\n✅ Pode ser feito em casa\n✅ Sem aparelhos, você não precisa comprar NADA.",
      "Você está preparada para essa transformação na sua vida?"
    ],
    type: "choice",
    options: ["SIM, EU ACEITO O DESAFIO!"]
  },
  {
    step: 18,
    messages: [
      "Não gostamos de ver que uma mensalidade em academias pelo Brasil pode chegar a R$ 200,00 por mês! Fora nutricionistas e personais! Achamos um absurdo isso...",
      "Por isso queremos oferecer isso a você sem nenhum custo. Sim, é isso mesmo, o acompanhamento é totalmente gratuito.",
      "Mas, para manter tudo rodando e garantir que você tenha a melhor experiência, cobramos uma pequena taxa de inscrição de APENAS R$ 37. Que é o valor que a Plataforma nos cobra para hospedar as aulas dos treinos.\n\nEssa pequena contribuição nos ajuda a manter tudo isso vivo, a continuar apoiando e transformando a vida de tantas mulheres. E é também uma forma de selarmos nosso compromisso juntos.\n\nAlém disso, se em até 30 dias você sentir que não está vendo a mudança que esperava, eu prometo que devolvo cada centavo."
    ],
    type: "final_payt",
    options: ["QUERO COMEÇAR A MINHA TRANSFORMAÇÃO AGORA (R$ 37)"]
  }
];

const chatMessagesEl = document.getElementById("chat-messages");
const userStatusEl = document.getElementById("user-status");
const soundBtnEl = document.getElementById("sound-btn");
const soundIconOn = document.getElementById("sound-icon-on");
const soundIconOff = document.getElementById("sound-icon-off");
const restartBtnEl = document.getElementById("restart-btn");

// Remove botões de escolha ativos do chat
function removeActiveChoices() {
  const active = document.getElementById("active-inline-choices");
  if (active) active.remove();
}

// ==========================================
// HELPERS
// ==========================================
function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function scrollToBottom() {
  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

function setTypingStatus(isTyping) {
  if (isTyping) {
    userStatusEl.textContent = "digitando...";
    userStatusEl.classList.add("typing");
  } else {
    userStatusEl.textContent = "online";
    userStatusEl.classList.remove("typing");
  }
}

// Cria o balão de pontinhos saltitantes oficial do WhatsApp
function createTypingBubble() {
  const row = document.createElement("div");
  row.className = "message-row incoming typing-row";
  row.id = "active-typing-bubble";
  row.innerHTML = `
    <div class="typing-bubble">
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    </div>
  `;
  return row;
}

// Formata texto com suporte a negrito (*texto*), itálico (_texto_) e quebras de linha
function formatWhatsAppText(text) {
  return text
    .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
    .replace(/_(.*?)_/g, "<em>$1</em>")
    .replace(/\n/g, "<br>");
}

// Renderiza mensagem de entrada (Mali Santos)
function renderIncomingMessage(text) {
  const row = document.createElement("div");
  row.className = "message-row incoming first-in-series";

  const formattedText = formatWhatsAppText(text);

  row.innerHTML = `
    <div class="message-bubble">
      <div class="message-content">${formattedText}</div>
      <div class="message-meta">
        <span class="message-time">${getCurrentTime()}</span>
      </div>
    </div>
  `;
  chatMessagesEl.appendChild(row);
  scrollToBottom();
  AudioController.playReceive();
}

// Renderiza mensagem de saída (Usuário)
function renderOutgoingMessage(text) {
  const row = document.createElement("div");
  row.className = "message-row outgoing first-in-series";
  row.innerHTML = `
    <div class="message-bubble">
      <div class="message-content">${text}</div>
      <div class="message-meta">
        <span class="message-time">${getCurrentTime()}</span>
        <span class="ticks">
          <svg viewBox="0 0 16 11" width="16" height="11" fill="none">
            <path d="M11.05.7a.75.75 0 0 1 1.06 0l3.19 3.19a.75.75 0 0 1 0 1.06l-6.9 6.9a.75.75 0 0 1-1.06 0l-3.2-3.2a.75.75 0 1 1 1.06-1.06l2.67 2.67 6.37-6.37a.75.75 0 0 1 .81-.19z" fill="currentColor"/>
            <path d="M7.05.7a.75.75 0 0 1 1.06 0l3.19 3.19a.75.75 0 0 1 0 1.06l-6.9 6.9a.75.75 0 0 1-1.06 0L.15 8.66a.75.75 0 1 1 1.06-1.06l2.67 2.67 6.37-6.37a.75.75 0 0 1 .8-.2z" fill="currentColor"/>
          </svg>
        </span>
      </div>
    </div>
  `;
  chatMessagesEl.appendChild(row);
  scrollToBottom();
  AudioController.playSend();
}

// ==========================================
// MOTOR DE EXECUÇÃO HUMANIZADA (TEMPOS CALIBRADOS)
// ==========================================
async function executeStep(stepIndex) {
  state.currentStepIndex = stepIndex;
  const stepData = funnelSteps[stepIndex];
  if (!stepData) return;

  // Registra o passo atual alcançado pelo lead
  Tracker.trackStep(stepIndex + 1);

  // Limpa botões ativos anteriores enquanto o bot digita
  removeActiveChoices();

  // Envia cada mensagem com tempo humanizado e pontinhos
  for (let i = 0; i < stepData.messages.length; i++) {
    let msgText = stepData.messages[i];


    // TEMPOS HUMANIZADOS CALIBRADOS (ritmo tranquilo e natural para leitura real)
    // Mensagens curtas: ~3400ms - 4400ms
    // Mensagens médias e longas: ~4800ms - 7500ms
    const typingTime = Math.min(7500, Math.max(3400, msgText.length * 45));

    // Exibe pontinhos no chat e status "digitando..."
    setTypingStatus(true);
    const typingBubble = createTypingBubble();
    chatMessagesEl.appendChild(typingBubble);
    scrollToBottom();

    // Aguarda o tempo humanizado de digitação
    await new Promise(res => setTimeout(res, typingTime));

    // Remove pontinhos e exibe a mensagem
    typingBubble.remove();
    setTypingStatus(false);
    renderIncomingMessage(msgText);

    // Pausa natural de 2200ms entre mensagens consecutivas para dar tempo de leitura
    if (i < stepData.messages.length - 1) {
      await new Promise(res => setTimeout(res, 2200));
    }
  }

  // Ações de acordo com o tipo da etapa
  if (stepData.type === "choice") {
    renderChoices(stepData.options, stepData.key);
  } else if (stepData.type === "number_input") {
    renderNumberInput(stepData);
  } else if (stepData.type === "calculation_wait") {
    // Etapa 16: Cálculo com pontinhos de digitação (4 segundos exatos, sem loading bar)
    await handleCalculationWait(stepData.waitDuration || 4000);
  } else if (stepData.type === "chart_step") {
    // Etapa 17: Previsão gráfica de redução de peso
    renderChartStep(stepData);
  } else if (stepData.type === "final_payt") {
    // Etapa 19: Botão final direto para a Payt
    renderPaytChoice(stepData.options[0]);
  }
}

// Renderiza campo numérico inline para Altura e Peso (Etapas 13, 14, 15)
function renderNumberInput(stepData) {
  removeActiveChoices();

  const container = document.createElement("div");
  container.className = "inline-input-wrapper";
  container.id = "active-inline-choices";

  const form = document.createElement("form");
  form.className = "inline-input-form";

  const input = document.createElement("input");
  input.type = "number";
  input.className = "inline-number-field";
  input.placeholder = stepData.placeholder || "Digite o valor...";
  input.inputMode = "numeric";
  input.required = true;

  if (stepData.unit === "cm") {
    input.min = "100";
    input.max = "240";
  } else if (stepData.unit === "kg") {
    input.min = "30";
    input.max = "250";
  }

  const unitSpan = document.createElement("span");
  unitSpan.className = "inline-input-unit";
  unitSpan.textContent = stepData.unit || "";

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.className = "inline-input-submit";
  submitBtn.title = "Enviar";
  submitBtn.innerHTML = `
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    </svg>
  `;

  form.appendChild(input);
  if (stepData.unit) form.appendChild(unitSpan);
  form.appendChild(submitBtn);
  container.appendChild(form);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (!val) return;

    const formattedAnswer = `${val} ${stepData.unit || ""}`.trim();

    if (stepData.key) {
      state.userResponses[stepData.key] = val;
      Tracker.trackAnswer(stepData.key, formattedAnswer);
    } else {
      Tracker.trackAnswer("etapa_" + (state.currentStepIndex + 1), formattedAnswer);
    }

    container.remove();
    renderOutgoingMessage(formattedAnswer);

    // Pausa humanizada de 1600ms antes do expert começar a digitar
    setTimeout(() => {
      executeStep(state.currentStepIndex + 1);
    }, 1600);
  });

  chatMessagesEl.appendChild(container);
  scrollToBottom();

  setTimeout(() => {
    input.focus();
  }, 100);
}

// Renderiza o gráfico visual de redução de peso e botão de confirmação (Etapa 17)
function renderChartStep(stepData) {
  removeActiveChoices();

  const pAtual = parseFloat(state.userResponses.peso_atual) || 80;
  let pDesejado = parseFloat(state.userResponses.peso_desejado) || 68;

  // Garante valores coerentes para o gráfico
  if (pDesejado >= pAtual) {
    pDesejado = Math.round(pAtual * 0.88);
  }
  const kgDiff = Math.max(2, Math.round(pAtual - pDesejado));
  const pSemana2 = (pAtual - kgDiff * 0.55).toFixed(1);
  const regiaoAlvo = state.userResponses.regiao || "Barriga";

  // Card com o gráfico de redução de peso
  const chartRow = document.createElement("div");
  chartRow.className = "chat-row incoming-row";
  chartRow.innerHTML = `
    <div class="chat-bubble incoming-bubble chart-bubble">
      <div class="chart-header">
        <span class="chart-badge">📊 PREVISÃO DE TRANSFORMAÇÃO</span>
        <span class="chart-target">4 Semanas</span>
      </div>

      <div class="weight-stat-row">
        <div class="weight-stat-pill">
          <span class="stat-lbl">Hoje</span>
          <strong class="stat-val">${pAtual} kg</strong>
        </div>
        <div class="weight-arrow">➔</div>
        <div class="weight-stat-pill success">
          <span class="stat-lbl">Meta 4 Semanas</span>
          <strong class="stat-val target">${pDesejado} kg</strong>
        </div>
        <div class="weight-stat-pill diff">
          <span class="stat-lbl">Eliminar</span>
          <strong class="stat-val diff">-${kgDiff} kg 🔥</strong>
        </div>
      </div>

      <div class="chart-svg-container">
        <svg viewBox="0 0 320 125" class="weight-curve-svg">
          <defs>
            <linearGradient id="curveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#00a884" stop-opacity="0.32"/>
              <stop offset="100%" stop-color="#00a884" stop-opacity="0.0"/>
            </linearGradient>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#25d366"/>
              <stop offset="100%" stop-color="#00a884"/>
            </linearGradient>
          </defs>
          <path d="M 28 26 Q 160 55, 292 95 L 292 118 L 28 118 Z" fill="url(#curveGrad)"/>
          <path d="M 28 26 Q 160 55, 292 95" fill="none" stroke="url(#lineGrad)" stroke-width="3.5" stroke-linecap="round"/>
          <circle cx="28" cy="26" r="4.5" fill="#25d366" stroke="#fff" stroke-width="1.8"/>
          <circle cx="160" cy="55" r="3.5" fill="#00a884" stroke="#fff" stroke-width="1.5"/>
          <circle cx="292" cy="95" r="5" fill="#00a884" stroke="#fff" stroke-width="2"/>
          <text x="28" y="16" font-size="11" font-weight="700" fill="#111b21" text-anchor="start">Hoje: ${pAtual}kg</text>
          <text x="160" y="47" font-size="10" font-weight="600" fill="#667781" text-anchor="middle">Semana 2: ${pSemana2}kg</text>
          <text x="292" y="86" font-size="11" font-weight="800" fill="#008069" text-anchor="end">Semana 4: ${pDesejado}kg</text>
        </svg>
      </div>

      <div class="chart-footer-specs">
        <span>⏱️ 15 a 20 min/dia</span>
        <span>🎯 Foco: ${regiaoAlvo}</span>
        <span>🛡️ 100% Sem Impacto</span>
      </div>

      <div class="msg-meta">
        <span class="msg-time">${getCurrentTime()}</span>
      </div>
    </div>
  `;

  chatMessagesEl.appendChild(chartRow);
  scrollToBottom();
  AudioController.playReceive();

  // Pergunta de confirmação após breve pausa de 1800ms
  setTimeout(() => {
    setTypingStatus(true);
    const typingBubble = createTypingBubble();
    chatMessagesEl.appendChild(typingBubble);
    scrollToBottom();

    setTimeout(() => {
      typingBubble.remove();
      setTypingStatus(false);
      renderIncomingMessage("Você está preparada para essa transformação?");

      // Exibe o botão de confirmação inline alinhado à direita
      renderChoices(stepData.options, "preparada_transformacao");
    }, 2400);
  }, 1800);
}

// Renderiza as opções de botões inline diretamente no fluxo do chat, logo abaixo da mensagem
function renderChoices(options, responseKey) {
  removeActiveChoices();

  const container = document.createElement("div");
  container.className = "inline-choices-row";
  container.id = "active-inline-choices";

  options.forEach(optionText => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    if (optionText.includes("EU QUERO") || optionText.includes("ESTOU PREPARADA") || optionText.includes("ACEITO")) {
      btn.classList.add("primary-cta");
    }
    btn.textContent = optionText;

    btn.addEventListener("click", () => {
      // Salva resposta no estado e no Tracker analítico
      if (responseKey) {
        state.userResponses[responseKey] = optionText;
        Tracker.trackAnswer(responseKey, optionText);
      } else {
        Tracker.trackAnswer("etapa_" + (state.currentStepIndex + 1), optionText);
      }

      // Remove os botões inline após a escolha
      container.remove();
      // Renderiza mensagem do usuário
      renderOutgoingMessage(optionText);

      // Pausa humanizada de 1600ms antes do expert começar a digitar a próxima resposta
      setTimeout(() => {
        executeStep(state.currentStepIndex + 1);
      }, 1600);
    });

    container.appendChild(btn);
  });

  chatMessagesEl.appendChild(container);
  scrollToBottom();
}

// Etapa 16: Cálculo sem barra de loading, apenas com pontinhos de digitação ("digitando...")
async function handleCalculationWait(durationMs) {
  setTypingStatus(true);
  const typingBubble = createTypingBubble();
  chatMessagesEl.appendChild(typingBubble);
  scrollToBottom();

  // Espera os 4.5 segundos de cálculo
  await new Promise(res => setTimeout(res, durationMs || 4500));

  typingBubble.remove();
  setTypingStatus(false);

  // Avança automaticamente para a Etapa 17
  executeStep(state.currentStepIndex + 1);
}

// Etapa 19: Renderiza botão CTA final da Payt no padrão dos outros botões
function renderPaytChoice(buttonLabel) {
  removeActiveChoices();

  const container = document.createElement("div");
  container.className = "inline-choices-row";
  container.id = "active-inline-choices";

  const btn = document.createElement("button");
  btn.className = "choice-btn";
  btn.textContent = buttonLabel;

  btn.addEventListener("click", () => {
    // Registra clique no Checkout Payt
    Tracker.trackCheckout();

    // Remove os botões
    container.remove();
    // Mensagem enviada pelo usuário
    renderOutgoingMessage(buttonLabel);

    // Abre o checkout em nova aba
    window.open(CHECKOUT_PAYT_URL, "_blank");

    // Resposta final amigável da Mali Santos
    setTimeout(() => {
      setTypingStatus(true);
      const typingBubble = createTypingBubble();
      chatMessagesEl.appendChild(typingBubble);
      scrollToBottom();

      setTimeout(() => {
        typingBubble.remove();
        setTypingStatus(false);
        renderIncomingMessage(
          `Excelente escolha! Você está sendo redirecionada para a página segura de pagamento. 🧘‍♀️💚\n\nCaso a página não abra automaticamente, você pode acessar diretamente pelo link abaixo:\n\n👉 <a href="${CHECKOUT_PAYT_URL}" target="_blank" style="color: #008069; font-weight: bold; text-decoration: underline;">Clique aqui para abrir o Checkout</a>`
        );
      }, 2600);
    }, 1000);
  });

  container.appendChild(btn);
  chatMessagesEl.appendChild(container);
  scrollToBottom();
}

// ==========================================
// CONTROLES DE INTERFACE
// ==========================================
soundBtnEl.addEventListener("click", () => {
  state.soundEnabled = !state.soundEnabled;
  if (state.soundEnabled) {
    soundIconOn.style.display = "block";
    soundIconOff.style.display = "none";
    AudioController.playReceive();
  } else {
    soundIconOn.style.display = "none";
    soundIconOff.style.display = "block";
  }
});

restartBtnEl.addEventListener("click", () => {
  if (confirm("Deseja reiniciar a conversa do início?")) {
    window.location.reload();
  }
});

// ==========================================
// ACESSO SECRETO DO ADMINISTRADOR (100% INVISÍVEL PARA OS LEADS)
// ==========================================
// 1. Clicar 5 vezes seguidas na foto de perfil da Mali Santos
const avatarEl = document.querySelector(".avatar-wrapper");
let avatarClicks = 0;
let avatarTimer = null;
if (avatarEl) {
  avatarEl.addEventListener("click", () => {
    avatarClicks++;
    clearTimeout(avatarTimer);
    avatarTimer = setTimeout(() => { avatarClicks = 0; }, 2000);
    if (avatarClicks >= 5) {
      avatarClicks = 0;
      window.open("painel.html", "_blank");
    }
  });
}

// 2. Atalho de teclado secreto: Ctrl + Shift + L (ou no Mac: Cmd + Shift + L)
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "L" || e.key === "l")) {
    e.preventDefault();
    window.open("painel.html", "_blank");
  }
});

// Inicia o fluxo ao carregar
window.addEventListener("DOMContentLoaded", () => {
  // Inicializa o rastreador de sessão do lead
  Tracker.init();

  // Pausa inicial de 2000ms antes da especialista começar a digitar
  setTimeout(() => {
    executeStep(0);
  }, 2000);
});
