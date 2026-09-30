# Typebot Pilates Tailandês - Simulação WhatsApp & Painel de Leads 🧘‍♀️✨
**Especialista:** Mali Santos  
**Oferta:** Desafio Pilates Tailandês 28 Dias (R$ 37 com 30 dias de garantia)

---

## 📦 Arquivos do Projeto

1. **`painel.html`**: 📊 Painel privado e exclusivo de retenção do funil (18 Etapas) e inteligência para anúncios (Meta Ads & TikTok).
2. **`painel.css`**: Estilização do dashboard (modo escuro elegante, gráficos de barras de retenção, cards de ganchos de copy e modais).
3. **`painel.js`**: Motor analítico em tempo real para 18 etapas, média de perda de peso desejada, gerador de ganchos de Ads, leads demo e exportação CSV.
4. **`index.html`**: Simulador web do WhatsApp (com botões inline grafite alinhados à direita, campos numéricos de altura/peso e gráfico dinâmico).
5. **`style.css`**: Design autêntico do WhatsApp (fundo com doodle suave, botões alinhados à direita, campos numéricos e gráfico de redução de peso).
6. **`app.js`**: Lógica de fluxo com 18 etapas completas, cálculo com pontinhos ("digitando..."), gráfico dinâmico de perda de peso e rastreador automático de leads (`Tracker`).
7. **`typebot-pilates.json`**: Arquivo de fluxo com 18 grupos e 52 conexões pronto para ser importado diretamente no [Typebot.io](https://typebot.io).
8. **`whatsapp-notification.mp3`**: Áudio oficial de notificação nativa do WhatsApp (com fallback Base64 embutido).
9. **`expert-avatar.jpg`**: Foto oficial da especialista Mali Santos em estúdio de Pilates.

---

## 🎯 As 18 Etapas do Funil

| Etapa | Pergunta / Bloco | Tipo | Opções / Ação de Resposta |
|---|---|---|---|
| **01** | Gancho de abertura + Qual a sua idade? | Escolha | `18 a 29 anos` \| `30 a 39 anos` \| `40 a 49 anos` \| `50 anos ou mais` |
| **02** | Qual a sua idade? | Escolha | `18 - 29` \| `30-39` \| `40 - 49` \| `50+` |
| **03** | Principal objetivo com o pilates | Escolha | `Perder barriga` \| `Aumentar a força muscular` \| `Desenvolver a flexibilidade` \| `Reduzir o estresse e ansiedade` \| `Reduzir as dores corporais` |
| **04** | Já praticou Pilates antes? | Escolha | `Sim, já pratico regularmente` \| `Já fiz algumas vezes, mas não com frequência` \| `Nunca fiz` |
| **05** | Nível de flexibilidade | Escolha | `Sou flexível` \| `Mais ou menos flexível` \| `Não sou flexível` |
| **06** | Como você descreveria seu fisico? | Escolha | `Magra` \| `Média` \| `Um pouco acima do peso` \| `Acima do peso` |
| **07** | Qual é o seu "corpo dos sonhos"? | Escolha | `Magra` \| `Tonificada` \| `Com curvas` \| `Média` |
| **08** | Tempo no melhor físico de sua vida | Escolha | `Há menos de um ano` \| `1 a 2 anos atrás` \| `Há mais de 3 anos` \| `Não sei dizer` |
| **09** | Região do corpo que quer atingir primeiro | Escolha | `Barriga` \| `Glúetos` \| `Pernas` \| `Peito` |
| **10** | Frequência de exercício | Escolha | `Quase todos os dias` \| `Algumas vezes na semana` \| `Algumas vezes por mês` \| `Poucas vezes` |
| **11** | Horas de sono por dia | Escolha | `Menos de 5 horas` \| `5-6 horas` \| `7-8 horas` \| `Mais de 8 horas` |
| **12** | Principal motivo para entrar em forma | Escolha | `Me sentir mais confiante no meu corpo` \| `Me sentir mais saudável e com energia` \| `Vestir melhor minhas roupas` \| `Voltar a forma após o parto` \| `Outros` |
| **13** | Qual a sua altura em cm? | Campo Numérico | Digitar altura (Placeholder: `Ex: 170`) ➔ Botão Enviar |
| **14** | Qual é o seu peso atualmente em kgs? | Campo Numérico | Digitar peso atual (Placeholder: `Ex: 80`) ➔ Botão Enviar |
| **15** | Objetivo de peso ideal em kgs | Campo Numérico | Digitar peso desejado (Placeholder: `Ex: 68`) ➔ Botão Enviar |
| **16** | Cálculo do plano personalizado | Diagnóstico | Pontinhos automáticos de digitação (4 segundos) |
| **17** | Plano Pronto + Gráfico de Redução de Peso | Gráfico + Copy | Card visual com curva de perda de peso (Hoje ➔ 4 semanas) + Botão `SIM, ESTOU PREPARADA!` |
| **18** | Benefícios do Desafio (100% sem aparelhos) | Benefícios | `SIM, EU ACEITO O DESAFIO!` |
| **19** | Comparativo com academias + Oferta R$ 37 | Oferta Final | Botão CTA: `QUERO COMEÇAR A MINHA TRANSFORMAÇÃO AGORA (R$ 37)` direto para Payt |

---

## 🔐 Como Acessar o Painel de Leads & Inteligência de Ads

Abra o arquivo **`painel.html`** no seu navegador (ou clique no ícone de gráfico 📊 no topo do chat `index.html`):

- **Senha Padrão de Acesso:** `admin123`

### 🚀 Recursos do Painel:

1. **4 KPIs em Tempo Real:**
   - **Total de Leads** iniciados.
   - **Taxa de Conclusão** (quantos % chegaram na Etapa 19).
   - **Cliques no Checkout Payt** (total e taxa de conversão final).
   - **Dispositivo Dominante** (% Mobile vs Desktop).

2. **📊 Funil de Retenção Passo a Passo (19 Etapas):**
   - Gráficos de barras para cada uma das 19 etapas.
   - Destaque automático de **Gargalo / Maior Queda (`⚠️ Maior Queda`)** entre perguntas consecutivas.

3. **🎯 Inteligência para Novos Ads (Meta & TikTok Ads):**
   - **Métricas do Público:** Objetivo nº 1, faixa etária dominante, região alvo e **média de perda de peso desejada em kg**.
   - **6 Ganchos de Copy Prontos para Anúncios:**
     - Ângulo 1: Dor + Faixa Etária Dominante
     - Ângulo 2: Zero Impacto & Sem Dores nas Costas
     - Ângulo 3: Meta de Emagrecimento Realista (-X kg em 4 semanas)
     - Ângulo 4: Gatilho Emocional & Autoestima
     - Ângulo 5: Comparativo vs Academias Caras
     - Ângulo 6: Falta de Tempo (Rotina de 15 minutos)
     - Botão **"Copiar Gancho"** com 1 clique.
   - **Sugestão de Segmentação para o Gerenciador de Anúncios:** Idades recomendadas, interesses no Meta Ads e posicionamentos ideais (Reels/Stories).

4. **📋 Tabela de Leads & Respostas Detalhadas:**
   - Colunas com ID, Data, Dispositivo, Etapa, Objetivo, Idade, **Altura**, **Peso Atual ➔ Meta**, Região e Status.
   - Botão **"🔍 Ver Respostas"** para abrir o modal com o questionário completo do lead.

5. **🛠️ Ferramentas Rápidas:**
   - **🎲 Gerar 30 Leads Demo:** Popula o painel com 30 leads simulados hiper-realistas ao longo das 19 etapas para visualização imediata.
   - **📥 Exportar CSV:** Gera planilha compatível com Excel e Google Sheets com todas as respostas e colunas estruturadas.
   - **🗑️ Limpar Dados:** Zera os dados salvos quando desejar iniciar nova contagem.

---

## 🚀 Como Importar no Typebot.io

1. Acesse sua conta no [Typebot](https://app.typebot.io).
2. No seu painel principal, clique em **"Create a typebot"** ou **"Novo Typebot"**.
3. Escolha a opção **"Import a file"** (Importar arquivo).
4. Selecione o arquivo **`typebot-pilates.json`** presente nesta pasta.
5. Pronto! Todas as 19 etapas, campos numéricos, blocos de texto, botões de escolha, bloco Wait de 4s e o bloco Redirect para a Payt já estarão conectados.

---

## 🔗 Como Configurar seu Link de Checkout da Payt

### No Typebot:
1. Abra o bot importado no Typebot.
2. Vá até o último grupo (**Grupo 19 - Oferta Final Payt**).
3. Clique no bloco **Redirect** (ou no botão Payt).
4. Altere a URL `https://checkout.payt.com.br/SEU_CHECKOUT_AQUI` para o link real da sua oferta na Payt.
5. Clique em **Publish** no canto superior direito.

### No Simulador Web (`app.js`):
1. Abra o arquivo `app.js` em qualquer editor de código.
2. Na linha 10, altere a constante:
   ```javascript
   const CHECKOUT_PAYT_URL = "https://checkout.payt.com.br/SEU_CHECKOUT_AQUI";
   ```
3. Salve o arquivo.

---

## ⚡ Como Testar o Projeto Localmente

Você pode abrir tanto o `index.html` (simulador) quanto o `painel.html` (dashboard de métricas) diretamente em qualquer navegador com dois cliques.

Se preferir usar um servidor local:
```bash
npx serve .
```
Ou:
```bash
python -m http.server 8080
```
Acesse `http://localhost:8080/index.html` para o chat e `http://localhost:8080/painel.html` para o painel de leads.
