const fs = require('fs');
const path = require('path');

function createTextContent(text) {
  const lines = text.split('\n');
  return {
    richText: lines.map(line => ({
      type: 'p',
      children: [{ text: line }]
    }))
  };
}

let blockCounter = 1;
function genId(prefix = 'b') {
  return `${prefix}_${blockCounter++}_${Math.random().toString(36).substring(2, 9)}`;
}

const variables = [
  { id: 'var_idade', name: 'idade' },
  { id: 'var_objetivo', name: 'objetivo' },
  { id: 'var_praticou', name: 'praticou_pilates' },
  { id: 'var_flexibilidade', name: 'flexibilidade' },
  { id: 'var_fisico', name: 'fisico_hoje' },
  { id: 'var_corpo_sonhos', name: 'corpo_dos_sonhos' },
  { id: 'var_tempo_melhor_fisico', name: 'tempo_melhor_fisico' },
  { id: 'var_regiao', name: 'regiao_desejada' },
  { id: 'var_exercicio', name: 'frequencia_exercicio' },
  { id: 'var_sono', name: 'horas_sono' },
  { id: 'var_motivo', name: 'motivo_emagrecer' },
  { id: 'var_altura', name: 'altura_cm' },
  { id: 'var_peso_atual', name: 'peso_atual_kg' },
  { id: 'var_peso_desejado', name: 'peso_desejado_kg' }
];

const stepsData = [
  {
    step: 1,
    title: '01 - Idade e Boas-vindas',
    texts: [
      '🔥 Quer transformar seu corpo sem precisar de academia? 🔥',
      'Se você quer perder peso, ganhar massa magra e melhorar sua autoestima *com treinos em casa*, tenho algo especial para você.',
      'Em apenas *15 minutos por dia*, você pode ter resultados visíveis em *28 dias*.',
      '👉 Antes de te mostrar como, me conta: *qual a sua idade?*'
    ],
    type: 'choice',
    variableId: 'var_idade',
    options: ['18 a 29 anos', '30 a 39 anos', '40 a 49 anos', '50 anos ou mais']
  },
  {
    step: 2,
    title: '02 - Principal Objetivo',
    texts: ['Legal, e qual é seu principal objetivo com o pilates?'],
    type: 'choice',
    variableId: 'var_objetivo',
    options: [
      'Perder barriga',
      'Aumentar a força muscular',
      'Desenvolver a flexibilidade',
      'Reduzir o estresse e ansiedade',
      'Reduzir as dores corporais'
    ]
  },
  {
    step: 3,
    title: '03 - Prática Anterior',
    texts: ['Você já praticou Pilates antes?'],
    type: 'choice',
    variableId: 'var_praticou',
    options: [
      'Sim, já pratico regularmente',
      'Já fiz algumas vezes, mas não com frequência',
      'Nunca fiz'
    ]
  },
  {
    step: 4,
    title: '04 - Flexibilidade',
    texts: [
      'Qual é seu nível de flexibilidade?',
      '_Não importa seu nível, vamos elaborar um plano totalmente *especial* para você!_'
    ],
    type: 'choice',
    variableId: 'var_flexibilidade',
    options: ['Sou flexível', 'Mais ou menos flexível', 'Não sou flexível']
  },
  {
    step: 5,
    title: '05 - Físico Hoje',
    texts: ['Como você descreveria seu fisico?'],
    type: 'choice',
    variableId: 'var_fisico',
    options: ['Magra', 'Média', 'Um pouco acima do peso', 'Acima do peso']
  },
  {
    step: 6,
    title: '06 - Corpo dos Sonhos',
    texts: ['Qual é o seu "corpo dos sonhos"?'],
    type: 'choice',
    variableId: 'var_corpo_sonhos',
    options: ['Magra', 'Tonificada', 'Com curvas', 'Média']
  },
  {
    step: 7,
    title: '07 - Melhor Físico',
    texts: ['Há quanto tempo você esteve no melhor físico de sua vida?'],
    type: 'choice',
    variableId: 'var_tempo_melhor_fisico',
    options: ['Há menos de um ano', '1 a 2 anos atrás', 'Há mais de 3 anos', 'Não sei dizer']
  },
  {
    step: 8,
    title: '08 - Região Prioritária',
    texts: ['Qual região do corpo você gostaria de atingir primeiro?'],
    type: 'choice',
    variableId: 'var_regiao',
    options: ['Barriga', 'Glúteos', 'Pernas', 'Peito']
  },
  {
    step: 9,
    title: '09 - Frequência de Exercício',
    texts: ['Quantas vezes faz exercício?'],
    type: 'choice',
    variableId: 'var_exercicio',
    options: ['Quase todos os dias', 'Algumas vezes na semana', 'Algumas vezes por mês', 'Poucas vezes']
  },
  {
    step: 10,
    title: '10 - Horas de Sono',
    texts: [
      'Já estou terminando, só me responde mais algumas perguntinhas por favor',
      'Quantas horas você dorme por dia?'
    ],
    type: 'choice',
    variableId: 'var_sono',
    options: ['Menos de 5 horas', '5-6 horas', '7-8 horas', 'Mais de 8 horas']
  },
  {
    step: 11,
    title: '11 - Principal Motivo',
    texts: ['Qual é o seu principal motivo para entrar em forma?'],
    type: 'choice',
    variableId: 'var_motivo',
    options: [
      'Me sentir mais confiante no meu corpo',
      'Me sentir mais saudável e com energia',
      'Vestir melhor minhas roupas',
      'Voltar a forma após o parto',
      'Outros'
    ]
  },
  {
    step: 12,
    title: '12 - Altura em cm',
    texts: ['Qual a sua altura em cm?'],
    type: 'number',
    variableId: 'var_altura',
    placeholder: 'Ex: 170'
  },
  {
    step: 13,
    title: '13 - Peso Atual',
    texts: ['Qual é o seu peso atualmente em kgs?'],
    type: 'number',
    variableId: 'var_peso_atual',
    placeholder: 'Ex: 80'
  },
  {
    step: 14,
    title: '14 - Peso Ideal',
    texts: ['Entendi! E qual é o seu objetivo de peso ideal em kgs?'],
    type: 'number',
    variableId: 'var_peso_desejado',
    placeholder: 'Ex: 68'
  },
  {
    step: 15,
    title: '15 - Finalização do Plano',
    texts: [
      'Terminando seu plano de Pilates de Parede personalizado...'
    ],
    type: 'wait',
    seconds: 4
  },
  {
    step: 16,
    title: '16 - Previsão e Gráfico',
    texts: [
      'Seu Plano de Pilates de Parede está pronto! 🔥',
      'De acordo com as informações que você me passou, prevemos que você alcançará sua meta em apenas 4 semanas.',
      '📊 [Gráfico de Redução de Peso: Agora ➔ 4 semanas]\nCronograma 100% sob medida para o seu metabolismo!',
      'Você está preparada para essa transformação?'
    ],
    type: 'choice',
    variableId: null,
    options: ['SIM, ESTOU PREPARADA!']
  },
  {
    step: 17,
    title: '17 - Benefícios do Desafio',
    texts: [
      'Deixa eu te explicar como irá funcionar...',
      'Você receberá treinos personalizados exclusivamente para você, todos os dias! Exercícios que você pode fazer em casa:\n\n✅ Perca de peso\n✅ Ganho de massa magra\n✅ Alivio de dores nas costas\n✅ Melhora da postura\n✅ Aumento da autoestima\n✅ Aumento da libido\n✅ Melhora da flexibilidade\n✅ Pode ser feito em casa\n✅ Sem aparelhos, você não precisa comprar NADA.',
      'Você está preparada para essa transformação na sua vida?'
    ],
    type: 'choice',
    variableId: null,
    options: ['SIM, EU ACEITO O DESAFIO!']
  },
  {
    step: 18,
    title: '18 - Oferta Final Payt',
    texts: [
      'Não gostamos de ver que uma mensalidade em academias pelo Brasil pode chegar a R$ 200,00 por mês! Fora nutricionistas e personais! Achamos um absurdo isso...',
      'Por isso queremos oferecer isso a você sem nenhum custo. Sim, é isso mesmo, o acompanhamento é totalmente gratuito.',
      'Mas, para manter tudo rodando e garantir que você tenha a melhor experiência, cobramos uma pequena taxa de inscrição de APENAS R$ 29,90. Que é o valor que a Plataforma nos cobra para hospedar as aulas dos treinos.\n\nEssa pequena contribuição nos ajuda a manter tudo isso vivo, a continuar apoiando e transformando a vida de tantas mulheres. E é também uma forma de selarmos nosso compromisso juntos.\n\nAlém disso, se em até 30 dias você sentir que não está vendo a mudança que esperava, eu prometo que devolvo cada centavo.'
    ],
    type: 'final',
    variableId: null,
    options: ['👉 QUERO COMEÇAR A MINHA TRANSFORMAÇÃO AGORA (R$ 29,90)']
  }
];

const groups = [];
const edges = [];

const START_X = 100;
const START_Y = 100;
const GROUP_WIDTH_SPACING = 380;
const GROUP_HEIGHT_SPACING = 550;
const COLS = 4;

const eventStart = {
  id: 'event_start',
  type: 'start',
  graphCoordinates: { x: 0, y: 100 },
  outgoingEdgeId: 'edge_start_to_group_1'
};

stepsData.forEach((sd, idx) => {
  const col = idx % COLS;
  const row = Math.floor(idx / COLS);
  const groupId = `group_${sd.step}`;
  const blocks = [];

  sd.texts.forEach(txt => {
    blocks.push({
      id: genId('block_text'),
      type: 'text',
      content: createTextContent(txt)
    });
  });

  if (sd.type === 'wait') {
    const waitBlockId = genId('block_wait');
    const waitBlock = {
      id: waitBlockId,
      type: 'Wait',
      options: {
        secondsToWaitFor: sd.seconds || 4
      }
    };
    blocks.push(waitBlock);

    const nextGroupId = `group_${sd.step + 1}`;
    const edgeId = `edge_${sd.step}_to_${sd.step + 1}`;
    waitBlock.outgoingEdgeId = edgeId;
    edges.push({
      id: edgeId,
      from: { blockId: waitBlockId },
      to: { groupId: nextGroupId }
    });
  } else if (sd.type === 'number') {
    const numberBlockId = genId('block_number');
    const nextGroupId = `group_${sd.step + 1}`;
    const edgeId = `edge_${sd.step}_to_${sd.step + 1}`;

    const numberBlock = {
      id: numberBlockId,
      type: 'number input',
      options: {
        variableId: sd.variableId,
        placeholder: sd.placeholder || 'Digite um número',
        buttonLabel: 'Enviar'
      },
      outgoingEdgeId: edgeId
    };
    blocks.push(numberBlock);

    edges.push({
      id: edgeId,
      from: { blockId: numberBlockId },
      to: { groupId: nextGroupId }
    });
  } else if (sd.type === 'choice' || sd.type === 'final') {
    const choiceBlockId = genId('block_choice');
    const items = sd.options.map((optText, optIdx) => {
      const itemId = genId(`item_${sd.step}_${optIdx}`);
      const nextGroupId = sd.step < stepsData.length ? `group_${sd.step + 1}` : null;
      let edgeId = null;

      if (nextGroupId) {
        edgeId = `edge_${sd.step}_item_${optIdx}_to_${sd.step + 1}`;
        edges.push({
          id: edgeId,
          from: { blockId: choiceBlockId, itemId: itemId },
          to: { groupId: nextGroupId }
        });
      }

      return {
        id: itemId,
        content: optText,
        outgoingEdgeId: edgeId
      };
    });

    const choiceBlock = {
      id: choiceBlockId,
      type: 'choice input',
      items: items,
      options: {
        isMultipleChoice: false
      }
    };

    if (sd.variableId) {
      choiceBlock.options.variableId = sd.variableId;
    }

    blocks.push(choiceBlock);

    if (sd.type === 'final') {
      const redirectBlockId = genId('block_redirect');
      const redirectBlock = {
        id: redirectBlockId,
        type: 'Redirect',
        options: {
          url: 'https://pay.wiapy.com/i3tIMsUrLrwY',
          isNewTab: true
        }
      };
      blocks.push(redirectBlock);

      const edgePayt = `edge_payt_redirect`;
      items[0].outgoingEdgeId = edgePayt;
      edges.push({
        id: edgePayt,
        from: { blockId: choiceBlockId, itemId: items[0].id },
        to: { groupId: groupId, blockId: redirectBlockId }
      });
    }
  }

  groups.push({
    id: groupId,
    title: sd.title,
    graphCoordinates: {
      x: START_X + col * GROUP_WIDTH_SPACING,
      y: START_Y + row * GROUP_HEIGHT_SPACING
    },
    blocks: blocks
  });
});

edges.unshift({
  id: 'edge_start_to_group_1',
  from: { eventId: 'event_start' },
  to: { groupId: 'group_1' }
});

const customWhatsAppCss = `
/* WhatsApp Theme Custom CSS for Typebot */
:root {
  --typebot-chat-bg: #EFEAE2;
  --typebot-host-bubble-bg: #FFFFFF;
  --typebot-guest-bubble-bg: #282f34;
  --typebot-primary: #282f34;
  --typebot-primary-hover: #1f2529;
  --typebot-text: #111B21;
}

body, typebot-standard {
  background-color: #EFEAE2 !important;
  background-image: radial-gradient(#d1c7b7 0.75px, transparent 0.75px), radial-gradient(#d1c7b7 0.75px, #efeae2 0.75px) !important;
  background-size: 30px 30px !important;
  background-position: 0 0, 15px 15px !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
}

.typebot-container {
  max-width: 480px !important;
  margin: 0 auto !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
}

.typebot-host-bubble {
  background-color: #FFFFFF !important;
  color: #111B21 !important;
  border-radius: 8px 8px 8px 0px !important;
  box-shadow: 0 1px 0.5px rgba(11, 20, 26, 0.13) !important;
  font-size: 15px !important;
  line-height: 1.45 !important;
  padding: 8px 12px !important;
  position: relative !important;
}

.typebot-guest-bubble {
  background-color: #282f34 !important;
  color: #FFFFFF !important;
  border-radius: 8px 8px 0px 8px !important;
  box-shadow: 0 1px 0.5px rgba(11, 20, 26, 0.13) !important;
  font-size: 15px !important;
  line-height: 1.45 !important;
  padding: 8px 12px !important;
}

.typebot-button {
  background-color: #282f34 !important;
  color: #FFFFFF !important;
  border-radius: 8px !important;
  font-weight: 700 !important;
  font-size: 14px !important;
  padding: 11px 20px !important;
  transition: all 0.2s ease !important;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important;
  border: none !important;
}

.typebot-button:hover {
  background-color: #1f2529 !important;
  transform: translateY(-1px) !important;
}
`;

const typebotData = {
  version: '6',
  name: 'Pilates de Parede - Desafio 28 Dias (18 Etapas)',
  events: [eventStart],
  groups: groups,
  edges: edges,
  variables: variables,
  theme: {
    general: {
      font: 'Open Sans',
      background: {
        type: 'Color',
        content: '#EFEAE2'
      }
    },
    chat: {
      hostAvatar: {
        isEnabled: true,
        url: 'expert-avatar.jpg'
      },
      guestAvatar: {
        isEnabled: false
      },
      hostBubbles: {
        backgroundColor: '#FFFFFF',
        color: '#111B21'
      },
      guestBubbles: {
        backgroundColor: '#282f34',
        color: '#FFFFFF'
      },
      buttons: {
        backgroundColor: '#282f34',
        color: '#FFFFFF'
      },
      inputs: {
        backgroundColor: '#FFFFFF',
        color: '#111B21',
        placeholderColor: '#667781'
      }
    },
    customCss: customWhatsAppCss
  },
  settings: {
    general: {
      isBrandingEnabled: false
    },
    typingEmulation: {
      enabled: true,
      speed: 18,
      maxDelay: 5.5,
      delayBetweenBubbles: 2.4,
      isDisabledOnFirstMessage: false
    }
  }
};

const outputPath = path.join(__dirname, 'typebot-pilates.json');
fs.writeFileSync(outputPath, JSON.stringify(typebotData, null, 2), 'utf-8');
console.log('typebot-pilates.json successfully regenerated at ' + outputPath);
console.log('Total groups: ' + groups.length);
console.log('Total edges: ' + edges.length);
