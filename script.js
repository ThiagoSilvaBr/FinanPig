import { audioManager } from "./js/audioManager.js";
let cutscenePlayer; // Declaração no escopo global (PARA CHAMAR NA FUNÇÃO TRIGGER)

document.addEventListener("DOMContentLoaded", function () {
  const screen = document.getElementById("startScreen");
  const backToMenuButton = document.getElementById("backToMenu");



  class CutscenePlayer {
    constructor(containerId, imageId, textId, fadeOverlayId, skipButtonId) {
      this.container = document.getElementById(containerId);
      this.image = document.getElementById(imageId);
      this.text = document.getElementById(textId);
      this.fadeOverlay = document.getElementById(fadeOverlayId);
      this.skipButton = document.getElementById(skipButtonId);
      this.audio = new Audio();

      this.index = 0;
      this.skip = false;
      this.currentTimeout1 = null;
      this.currentTimeout2 = null;
      this.isPlaying = false;

      this.skipButton.addEventListener("click", () => this.skipCutscene());
    }

    play(scenes, onComplete = () => {}, skippable = true, tempoPadrao = 3000) {
      this.scenes = scenes;
      this.onComplete = onComplete;
      this.index = 0;
      this.skip = false;
      this.isPlaying = true;
      this.tempoPadrao = tempoPadrao;
      this.container.style.display = "block";

      this.skipButton.style.display = skippable ? "block" : "none";

      this.showNext();
    }

    showNext() {
      if (this.skip || this.index >= this.scenes.length) {
        this.endCutscene();
        return;
      }

      const scene = this.scenes[this.index];
      this.fadeOverlay.style.opacity = 1;

      this.currentTimeout1 = setTimeout(() => {
        // Troca imagem e texto
        this.image.src = scene.image;
        this.text.textContent = scene.text;
        this.fadeOverlay.style.opacity = 0;

        // Se houver áudio, toca sincronizado
        if (scene.audio) {
          if (!this.audio.paused) this.audio.pause(); // para o anterior
          this.audio = new Audio(scene.audio);
          this.audio.play();

          // Avança para próxima cena após o fim do áudio
          this.audio.onended = () => {
            this.index++;
            this.showNext();
          };
        } else {
          // Se não tem áudio, usa tempo padrão
          this.currentTimeout2 = setTimeout(() => {
            this.index++;
            this.showNext();
          }, this.tempoPadrao);
        }
      }, 500);
    }

    skipCutscene() {
      this.skip = true;
      clearTimeout(this.currentTimeout1);
      clearTimeout(this.currentTimeout2);

      // 👇 PARE o áudio aqui
      if (this.audio && !this.audio.paused) this.audio.pause();

      this.fadeOverlay.style.opacity = 0;
      this.container.style.display = "none";
      this.isPlaying = false;
      this.onComplete();
    }

    endCutscene() {
      
      // 👇 PARE o áudio aqui também
      if (this.audio && !this.audio.paused) this.audio.pause();
      this.container.style.display = "none";
      this.isPlaying = false;
      this.onComplete();
    }
  }

  //Instância global para a cutscene
  cutscenePlayer = new CutscenePlayer(
    "cutscene-container",
    "cutscene-image",
    "cutscene-text",
    "fade-overlay",
    "skipCutscene"
  );



  //botão de iniciar o jogo
  document.getElementById("startButton").addEventListener("click", () => {
    cutscenePlayer.play(cutscenes.iniciais, () => {
      startGame();
      audioManager.setMap(currentMap); // ✅ CORRETO
    });

    screen.classList.add("fade-out");
    setTimeout(() => {
      screen.style.display = "none";
    }, 800);
  });

  backToMenuButton.addEventListener("click", voltarAoMenuInicial);

});

function voltarAoMenuInicial() {
  const screen = document.getElementById("startScreen");
  screen.style.display = "flex";
  screen.classList.remove("fade-out");

  pig.x = (canvas.width - pig.width) / 2;
  pig.y = sidewalkY;

  dialogManager.hide();
  hidePig = false;
  workedToday = false;

  playerMoney = 100;
  updateMoneyDisplay();
  currentDay = 1;
  updateDayDisplay();

  currentMap = "casa";
  loadMap("mapa-casa");
  resizeCanvas();
  clearInventoryIcons();

}

//dados das cutscenes
const cutscenes = {
  iniciais: [
    {
      image: "./imagens/cutscenes/iniciais/cena-inicial-1.png",
      text: "Pig nunca foi muito bom com dinheiro. Tudo que ganhava, gastava na mesma hora — doces, brinquedos, roupas novas…",
      audio: "./audios/dublagens/audio-01.mp3",
    },
    {
      image: "./imagens/cutscenes/iniciais/cena-inicial-2.png",
      text: "Para ele, o futuro era só uma ideia distante",
      audio: "./audios/dublagens/audio-02.mp3",
    },
    {
      image: "./imagens/cutscenes/iniciais/cena-inicial-3.png",
      text: "Criado em um lar humilde, sempre teve o essencial graças ao esforço incansável de sua mãe.",
      audio: "./audios/dublagens/audio-03.mp3",
    },
    {
      image: "./imagens/cutscenes/iniciais/cena-inicial-4.png",
      text: "Mas, sem perceber, Pig foi se afundando em dívidas e decisões impulsivas, colocando em risco o pouco que sua família tinha.",
      audio: "./audios/dublagens/audio-04.mp3",
    },
    {
      image: "./imagens/cutscenes/iniciais/cena-inicial-5.png",
      text: "Quando a situação ficou crítica, surgiu uma “ajuda” misteriosa: Lobo Lobato, um sujeito elegante, sorridente… e perigosamente convincente.",
      audio: "./audios/dublagens/audio-05.mp3",
    },
    {
      image: "./imagens/cutscenes/iniciais/cena-inicial-6.png",
      text: "Ele ofereceu empréstimos fáceis, um novo lar alugado e até ajudou Pig a conseguir um emprego. Tudo parecia estar se resolvendo.",
      audio: "./audios/dublagens/audio-06.mp3",
    },
    {
      image: "./imagens/cutscenes/iniciais/cena-inicial-7.png",
      text: "Mas era uma armadilha. O Lobo, desonesto como sempre, usou contratos enganosos e juros abusivos para sugar cada moeda que Pig tinha",
      audio: "./audios/dublagens/audio-07.mp3",
    },
    {
      image: "./imagens/cutscenes/iniciais/cena-inicial-8.png",
      text: "Em pouco tempo, Pig se viu preso a uma dívida gigante — e o Lobo deixou claro: se não pagar até o último centavo, perderá tudo.",
      audio: "./audios/dublagens/audio-08.mp3",
    },
    {
      image: "./imagens/cutscenes/iniciais/cena-inicial-9.png",
      text: "Agora, Pig precisa se levantar, aprender a cuidar do seu dinheiro e dar a volta por cima. Ele terá que economizar, fazer escolhas inteligentes, resistir às tentações e montar seu plano financeiro. Cada passo errado aproxima o Lobo. Mas cada boa decisão é uma vitória rumo à liberdade!",
      audio: "./audios/dublagens/audio-09.mp3",
    },
  ],
  finalBom: [
    {
      image: "./imagens/cutscenes/finais/final-bom/cena-final-bom-1.png",
      text: "Após dias de esforço, Pig finalmente conseguiu organizar suas finanças. Cada moeda economizada foi um passo para a liberdade. Lobo Lobato tentou de tudo, mas Pig, com sua nova disciplina, conseguiu pagar a dívida.",
    },
    {
      image: "./imagens/cutscenes/finais/final-bom/cena-final-bom-2.png",
      text: "Livre das garras do Lobo, Pig reergueu sua vida e a de sua família. Ele aprendeu a importância de planejar, investir e evitar os atalhos enganosos.",
    },
    {
      image: "./imagens/cutscenes/finais/final-bom/cena-final-bom-3.png",
      text: "Com o tempo, Pig não apenas prosperou, mas também se tornou um exemplo na comunidade, ajudando outros a não caírem nas mesmas armadilhas. Sua mãe, orgulhosa, viu seu filho se transformar.",
    },
    {
      image: "./imagens/cutscenes/finais/final-bom/cena-final-bom-4.png",
      text: "A vida de Pig mudou. Agora, ele investe, poupa e desfruta de cada conquista com consciência. Ele se tornou o porquinho financeiro que sempre deveria ter sido.",
    },
    {
      image: "./imagens/cutscenes/finais/final-bom/cena-final-bom-5.png",
      text: "Seu lar, antes ameaçado, tornou-se um refúgio de paz e segurança. Pig sabia que a verdadeira riqueza não estava em ter muito, mas em gerenciar bem o que se tem.",
    },
    {
      image: "./imagens/cutscenes/finais/final-bom/cena-final-bom-6.png",
      text: "E assim, a história de Pig se encerra. Um porquinho que aprendeu a voar... financeiramente.",
    },
  ],
  finalRuim: [
    {
      image: "./imagens/cutscenes/finais/final-ruim/cena-final-ruim-0.png",
      text:"O prazo terminou !"
    },
    {
      image: "./imagens/cutscenes/finais/final-ruim/cena-final-ruim-1.png",
      text:"Cinco dias se passaram, e Pig não conseguiu juntar o suficiente. As decisões impulsivas, os gastos desnecessários, a falta de planejamento... tudo cobrou seu preço. O Lobo Lobato, fiel à sua natureza cruel, não teve piedade."
    },
    {
      image: "./imagens/cutscenes/finais/final-ruim/cena-final-ruim-2.png",
      text:"— Negócios são negócios, meu caro porquinho... — disse com um sorriso frio enquanto assinava o último contrato."
    },
    {
      image: "./imagens/cutscenes/finais/final-ruim/cena-final-ruim-3.png",
      text:"Pig perdeu tudo: a casa, os móveis, os poucos bens que tinha. E não parou por aí."
    },
    {
      image: "./imagens/cutscenes/finais/final-ruim/cena-final-ruim-4.png",
      text:"O Lobo exigiu o pagamento até o último centavo, e como Pig não tinha mais como pagar... bem, o Lobo encontrou outra forma. A última cena que se ouviu foi o som de uma frigideira estalando."
    },
    {
      image: "./imagens/cutscenes/finais/final-ruim/cena-final-ruim-5.png",
      text:"Pig virou bacon."
    },
    {
      image: "./imagens/cutscenes/finais/final-ruim/cena-final-ruim-6.png",
    },
  ],
};

//Adicionando Caixa de Interação.
const dialogueBoxImage = new Image();
dialogueBoxImage.src = "./imagens/logos/dialog-box-image.png";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const assets = {
  background: new Image(),
  pig: new Image(),
};

assets.pigWalk1 = new Image();
assets.pigWalk2 = new Image();
assets.pigIdle = new Image();
assets.pigJump = new Image();

assets.pigWalk1.src = "./imagens/personagens/personagem-andando-1.png";
assets.pigWalk2.src = "./imagens/personagens/personagem-andando-2.png";
assets.pigIdle.src = "./imagens/personagens/personagem-lateral-direita.png";
assets.pigJump.src = "./imagens/personagens/personagem-pulando.png";

function loadMap(mapName) {
  assets.background.src = `./imagens/mapas/${mapName}.png`;
}

const pig = {
  x: 0,
  y: 0,
  width: 200,
  height: 200,
  speed: 6,
  velocityY: 0,
  isJumping: false,
  direction: "right",
  currentWidth: 200,
  currentHeight: 200,
};

const gravity = 0.5;
const jumpForce = -12;
let sidewalkY = 0;

let currentMap = "casa";
let canSwitchMap = true;

const maps = {
  casa: { transitions: { right: "trabalho" } },
  trabalho: { transitions: { left: "casa", right: "casino" } },
  casino: { transitions: { left: "trabalho", right: "shopping" } },
  shopping: { transitions: { left: "casino" } },
  shoppingInterno: { transitions: {} },
  casinoInterno: { transitions: {} },
  sala: { transitions: { right: "quarto" } },
  quarto: { transitions: { left: "sala" } },
};

function resizeCanvas() {
  const navbarHeight = document.getElementById("mainNavbar").offsetHeight;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - navbarHeight;

  // Ajusta dinamicamente a posição vertical da calçada a partir da altura da tela
  sidewalkY = canvas.height - pig.height - canvas.height * 0.18;
}

function switchMap(direction) {
  const nextMap = maps[currentMap].transitions[direction];
  if (nextMap && canSwitchMap) {
    const previousMap = currentMap;
    currentMap = nextMap;
    audioManager.setMap(currentMap);
    canSwitchMap = false;

    const mapFileNames = {
      casa: "mapa-casa",
      trabalho: "mapa-trabalho",
      shopping: "mapa-shopping",
      shoppingInterno: "mapa-shopping-interno",
      casino: "mapa-cassino",
      casinoInterno: "mapa-cassino-interno",
      sala: "mapa-sala",
      quarto: "mapa-quarto",
    };
    

    loadMap(mapFileNames[currentMap]);
    resizeCanvas();

    audioManager.setMap(currentMap);

    if (nextMap === "sala" && currentDay === 4) {
      dialogManager.show(
        "warningDia4",
        "O tempo está acabando!",
        "Você precisa juntar R$ 400,00 \naté amanhã!\n\nPressione 'E' para continuar"
      );
    }

    pig.x = direction === "right" ? 0 : canvas.width - pig.width;
    setTimeout(() => (canSwitchMap = true), 300);
  }
}

const keys = {
  ArrowUp: false,
  ArrowLeft: false,
  ArrowRight: false,
};

let isCutscenePlaying = false;

let nearLemonade = false;
let interactedWithLemonade = false;
let justClosedLemonadeDialog = false;

let nearDoor = false;
let nearRoomExit = false;
let interactedWithDoor = false;
let justClosedDoorDialog = false;

let nearBoss = false;
let talkedToBoss = false;
let bossDialogStep = 0;

let nearMom = false;
let interactedWithMom = false;
let justClosedMomDialog = false;

let nearBed = false;
let interactedWithBed = false;
let justClosedBedDialog = false;
let hidePig = false;
let waitingWakeUpDismiss = false;

let nearOffice = false;
let interactedWithOffice = false;
let justClosedOfficeDialog = false;
let workedToday = false;

let nearShoppingDoor = false;
let nearShoppingExit = false;
let interactedWithShoppingDoor = false;
let justClosedShoppingDoorDialog = false;

let nearLeftShopItem = false;
let interactedWithLeftShopItem = false;

let nearRightShopItem = false;
let interactedWithRightShopItem = false;

let nearCasinoDoor = false;
let nearCasinoExit = false;
let interactedWithCasinoDoor = false;
let justClosedCasinoDoorDialog = false;

let playerMoney = 100;
let moneySpentToday = 0;
let moneyEarnedToday = 0;
let currentDay = 1;

let nearSlotMachine = false;
let interactedWithSlotMachine = false;
let currentSlotResults = [];
let showSlotResults = false;
let slotIsSpining = false;

let walkFrame = 0;
let walkFrameCounter = 0;

const dialogManager = {
  active: false,
  type: null,
  opacity: 0,
  text: "",
  subtext: "",

  show(type, text, subtext = "") {
    this.active = true;
    this.type = type;
    this.text = text;
    this.subtext = subtext;
  },

  hide() {
    this.active = false;
    this.type = null;
  },

  update() {
    const target = this.active ? 1 : 0;
    const speed = 0.1;
    this.opacity += (target - this.opacity) * speed;
    this.opacity = Math.max(0, Math.min(1, this.opacity));
  },

  // Estilo do balão de interação (balão maior)
  draw(ctx, canvas) {
    if (
      this.opacity < 0.01 ||
      !dialogueBoxImage.complete ||
      dialogueBoxImage.naturalWidth === 0
    )
      return;

    const boxWidth = 600; // Largura da caixa, você pode ajustar se precisar
    const paddingX = 60; // Aumentei um pouco a margem horizontal para o texto
    const paddingY = 40; // Aumentei a margem vertical superior e inferior
    const mainTextLineHeight = 30; // Ajustei um pouco a altura da linha para o texto principal
    const subTextLineHeight = 30; // Ajustei a altura da linha para o subtexto
    const spacingBetweenTexts = 30; // Espaçamento entre o texto principal e o subtexto

    let currentCalculatedHeight = 0; // Usaremos para somar a altura total do conteúdo de texto

    // --- 1. Calcular a Altura Necessária para o Texto Principal ---
    ctx.font = "18px 'Press Start 2P', monospace";
    const wrappedMainLines = wrapText(ctx, this.text, boxWidth - paddingX * 2);
    currentCalculatedHeight += wrappedMainLines.length * mainTextLineHeight;

    // --- 2. Calcular a Altura Necessária para o Subtexto (se existir) ---
    let wrappedSubLines = [];
    if (this.subtext) {
      // Adiciona o espaçamento entre o texto principal e o subtexto
      currentCalculatedHeight += spacingBetweenTexts;

      ctx.font = "12px 'Press Start 2P', monospace"; // Mude a fonte para o subtexto antes de medir
      wrappedSubLines = wrapText(ctx, this.subtext, boxWidth - paddingX * 2);
      currentCalculatedHeight += wrappedSubLines.length * subTextLineHeight;
    }

    // --- 3. Definir a Altura Final da Caixa de Diálogo ---
    // Adiciona o padding vertical à altura calculada do texto
    // Aumentei a altura mínima para garantir que a caixa seja sempre maior.
    const minBoxHeight = 400; // Aumentado para garantir uma caixa sempre maior
    const dynamicBoxHeight = Math.max(
      minBoxHeight,
      currentCalculatedHeight + paddingY * 2
    );

    const centerX = canvas.width / 2 - boxWidth / 2 + 10; // Move 10px do centro à direita
    // Posição Y da caixa: centralizar ela verticalmente na parte superior da tela ou ajustar
    // Para a imagem que você mostrou, ela parece estar um pouco abaixo do topo, mas ainda na parte superior.
    const centerY = 50; // Ajustado para descer um pouco a caixa se necessário.

    ctx.save();
    ctx.globalAlpha = this.opacity;
    // Efeito de transição: a caixa desliza para cima enquanto a opacidade aumenta
    ctx.translate(0, (1 - this.opacity) * -20); // Mantenha este efeito se quiser

    // --- 4. Desenha a Imagem da Caixa com a Altura Dinâmica ---
    ctx.drawImage(
      dialogueBoxImage,
      centerX,
      centerY,
      boxWidth,
      dynamicBoxHeight
    );

    // --- 5. Preparar o Contexto para o Texto ---
    ctx.textAlign = "center";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.fillStyle = "white";

    // Posição X para o texto (centralizado dentro da caixa, considerando o padding)
    const textX = centerX + boxWidth / 2 - 15;

    // --- 6. Calcular a Posição Y Inicial do Texto Principal ---
    // Este cálculo centraliza o bloco total de texto (principal + subtexto + espaçamento)
    // verticalmente dentro da área de conteúdo da caixa (excluindo o paddingY).
    let currentTextY =
      centerY +
      paddingY +
      (dynamicBoxHeight - paddingY * 2 - currentCalculatedHeight) / 2;
    // Adiciona o half-line height para o baseline do texto ficar no centro da primeira linha.
    currentTextY += mainTextLineHeight / 2;

    // --- 7. Desenhar o Texto Principal ---
    ctx.font = "15px 'Press Start 2P', monospace"; // Reaplicar a fonte para o texto principal
    wrappedMainLines.forEach((line, index) => {
      const lineY = currentTextY + index * mainTextLineHeight;
      ctx.strokeText(line, textX, lineY);
      ctx.fillText(line, textX, lineY);
    });

    // --- 8. Desenhar o Subtexto (se existir) ---
    if (this.subtext) {
      // Atualiza a posição Y para o subtexto, adicionando o espaçamento e a altura do texto principal
      currentTextY +=
        wrappedMainLines.length * mainTextLineHeight + spacingBetweenTexts;
      // Ajusta o offset para a nova fonte (subtexto)
      // Isso é para garantir que a baseline do subtexto esteja no centro da primeira linha do subtexto
      currentTextY += subTextLineHeight / 2 - mainTextLineHeight / 2;

      ctx.font = "12px 'Press Start 2P', monospace"; // Reaplicar a fonte para o subtexto
      wrappedSubLines.forEach((line, index) => {
        const lineY = currentTextY + index * subTextLineHeight;
        ctx.strokeText(line, textX, lineY);
        ctx.fillText(line, textX, lineY);
      });
    }

    // Jogabilidade da Slot Machine do cassino
    if (showSlotResults && currentSlotResults.length === 3) {
      const iconSize = 120;
      const spacing = 40;
      const totalWidth = iconSize * 3 + spacing * 2;
      const startX = (canvas.width - totalWidth) / 2;
      const y = canvas.height / 3 + 45;

      currentSlotResults.forEach((symbol, index) => {
        const x = startX + index * (iconSize + spacing);
        ctx.drawImage(slotIcons[symbol.name], x, y, iconSize, iconSize);
      });
    }
    ctx.restore();
  },
};

function wrapText(ctx, text, maxWidth) {
  const lines = [];
  let currentLine = "";

  // Primeiro, vamos lidar com quebras de linha explícitas (se houver no texto original)
  const paragraphs = text.split("\n"); // <-- ESTA LINHA É A CHAVE PARA O '\n'

  paragraphs.forEach((para) => {
    const words = para.split(" ");
    currentLine = ""; // Reinicia a linha para cada parágrafo

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      let testLine = "";

      if (currentLine === "") {
        testLine = word;
      } else {
        testLine = currentLine + " " + word;
      }

      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth) {
        if (currentLine !== "") {
          lines.push(currentLine);
        }
        currentLine = word;

        const wordMetrics = ctx.measureText(word);
        if (wordMetrics.width > maxWidth) {
          let tempWord = "";
          for (let charIndex = 0; charIndex < word.length; charIndex++) {
            const char = word[charIndex];
            const tempTestLine = tempWord + char;
            const tempMetrics = ctx.measureText(tempTestLine);
            if (tempMetrics.width > maxWidth && tempWord !== "") {
              lines.push(tempWord);
              tempWord = char;
            } else {
              tempWord = tempTestLine;
            }
          }
          if (tempWord.length > 0) {
            lines.push(tempWord);
          }
          currentLine = "";
        } else {
          currentLine = word;
        }
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }
  });

  return lines;
}

function updateMoneyDisplay() {
  const moneySpan = document.getElementById("money");
  moneySpan.textContent = `R$ ${playerMoney.toFixed(2)}`;

  // Animação do texto
  moneySpan.classList.add("moneyGain");
  setTimeout(() => {
    moneySpan.classList.remove("moneyGain");
  }, 500);

  // Animação do ícone
  const moneyIcon = document.querySelector(".moneyIcon");
  if (moneyIcon) {
    moneyIcon.classList.add("moneyGain");
    setTimeout(() => {
      moneyIcon.classList.remove("moneyGain");
    }, 500);
  }
}

function updateDayDisplay() {
  const dayElement = document.getElementById("day");
  if (dayElement) {
    dayElement.textContent = `Dia ${currentDay}`;
  }
}

// Função para calcular o centro do mapa, para posicionar o balão de interação de entrada aos mapas internos
function isNearCenter(threshold = 0.06) {
  const center = canvas.width / 2;
  const range = canvas.width * threshold;
  return pig.x + pig.width >= center - range && pig.x <= center + range;
}

// Pedidos diários da mãe do personagem
const momRequests = {
  1: { item: "Limonada", type: "lemonade" },
  2: { item: "Itens de Higiene", type: "leftShop" },
  3: { item: "Mantimentos", type: "rightShop" },
  4: { item: "Itens de Higiene", type: "leftShop" },
  5: { item: "Mantimentos", type: "rightShop" },
};


let itemDeliveredToday = false;

// Função para evitar bug de não conseguir entrar mais de uma vez nos mapas internos, dentre outros bugs
function resetInteractionFlags() {
  justClosedLemonadeDialog = false;
  interactedWithLemonade = false;
  nearLemonade = false;

  justClosedDoorDialog = false;
  interactedWithDoor = false;
  nearDoor = false;

  justClosedShoppingDoorDialog = false;
  interactedWithShoppingDoor = false;
  nearShoppingDoor = false;

  interactedWithLeftShopItem = false;
  nearLeftShopItem = false;

  interactedWithRightShopItem = false;
  nearRightShopItem = false;

  interactedWithLeftShopItem = false;
  nearLeftShopItem = false;

  interactedWithRightShopItem = false;
  nearRightShopItem = false;

  justClosedCasinoDoorDialog = false;
  interactedWithCasinoDoor = false;
  nearCasinoDoor = false;

  justClosedMomDialog = false;
  interactedWithMom = false;
  nearMom = false;

  justClosedBedDialog = false;
  interactedWithBed = false;
  nearBed = false;

  nearCasinoExit = false;
  nearRoomExit = false;
  nearShoppingExit = false;

  nearSlotMachine = false;
  interactedWithSlotMachine = false;
}

function playSlotMachine() {
  const symbols = [
    { name: "bacon", image: "./imagens/slot-machine/bacon.png" },
    { name: "cofre", image: "./imagens/slot-machine/cofre.png" },
    { name: "limonada", image: "./imagens/slot-machine/limonada.png" },
    { name: "moeda", image: "./imagens/slot-machine/moeda.png" },
    { name: "porco", image: "./imagens/slot-machine/porco.png" },
  ];

  const getRandom = () => symbols[Math.floor(Math.random() * symbols.length)];
  return [getRandom(), getRandom(), getRandom()];
}

// Função para rodar as cutscenes finais
function triggerFinalCutscene() {
  const prazoLimite = 5;
  let tipo;

  if (currentDay > prazoLimite) {
    tipo = "finalRuim";
  } else {
    tipo = playerMoney >= 400 ? "finalBom" : "finalRuim";
  }

  cutscenePlayer.play(cutscenes[tipo], () => {
    // Após o fim da cutscene final, volta direto ao menu inicial
    voltarAoMenuInicial();
  },false,5000); //Não permite pular 
}

document.addEventListener("keydown", (e) => {
  // Bloqueia qualquer tecla durante a cutscene
  if (isCutscenePlaying) return;

  if (keys.hasOwnProperty(e.key)) keys[e.key] = true;

  // Impede ações enquanto estiver "No trabalho..."
  if (dialogManager.type === "working") return;

  // ESC fecha qualquer balão
  if (e.key === "Escape") {
    if (dialogManager.active) {
      const closedType = dialogManager.type;

      // Se estiver na tela de wakeUp, ESC age como E (levantar da cama)
      if (closedType === "wakeUp" && waitingWakeUpDismiss) {
        dialogManager.hide();
        showSlotResults = false;
        currentSlotResults = [];
        setTimeout(() => {
          currentMap = "quarto";
          loadMap("mapa-quarto");
          assets.background.onload = () => {
            resizeCanvas();
            hidePig = false;
            waitingWakeUpDismiss = false;
          };
        }, 400);
        return; // impede execução do resto do ESC
      }

      dialogManager.hide();

      switch (closedType) {
        case "lemonade":
        case "lemonadeHint":
          justClosedLemonadeDialog = true;
          setTimeout(() => (justClosedLemonadeDialog = false), 500);
          break;
        case "door":
        case "doorHint":
          justClosedDoorDialog = true;
          setTimeout(() => (justClosedDoorDialog = false), 500);
          break;
        case "office":
        case "alreadyWorked":
          justClosedOfficeDialog = true;
          setTimeout(() => (justClosedOfficeDialog = false), 500);
          break;
        case "endWork":
          justClosedOfficeDialog = true;
          hidePig = false;
          setTimeout(() => (justClosedOfficeDialog = false), 500);
          break;
        case "shoppingDoor":
        case "shoppingDoorHint":
          justClosedShoppingDoorDialog = true;
          setTimeout(() => (justClosedShoppingDoorDialog = false), 500);
          break;
        case "casinoDoor":
        case "casinoDoorHint":
          justClosedCasinoDoorDialog = true;
          setTimeout(() => (justClosedCasinoDoorDialog = false), 500);
          break;
        case "bed":
        case "bedHint":
          justClosedBedDialog = true;
          setTimeout(() => (justClosedBedDialog = false), 500);
          break;
      }
    }
  }

  if (e.key === "e" || e.key === "E") {
    if (dialogManager.active && dialogManager.type === "warningDia4") {
      dialogManager.hide();
      return;
    }

    if (dialogManager.active && dialogManager.type === "warning") {
      dialogManager.hide();

      // Reexibe o balão de wakeUp após fechar o alerta
      dialogManager.show(
        "wakeUp",
        `Dia ${currentDay}!`,
        `Pressione 'E' para levantar`
      );

      waitingWakeUpDismiss = true;
      return;
    }

    if (dialogManager.active && dialogManager.type === "endWork") {
      dialogManager.hide();
      hidePig = false;
      justClosedOfficeDialog = true;
      setTimeout(() => (justClosedOfficeDialog = false), 500);
      return;
    }

    if (
      waitingWakeUpDismiss &&
      dialogManager.active &&
      dialogManager.type === "wakeUp"
    ) {
      dialogManager.hide();
      setTimeout(() => {
        currentMap = "quarto";
        loadMap("mapa-quarto");
        assets.background.onload = () => {
          resizeCanvas();
          hidePig = false;
          waitingWakeUpDismiss = false;
        };
      }, 400);
      return;
    }

    if (currentMap === "casa" && currentDay === 5 && nearBoss) {
      // Impede falar com o lobo se não comprou mantimentos
      if (!itemDeliveredToday) {
        dialogManager.show(
          "bossBlocked",
          "Você não pode fazer isso ainda!",
          "Sua mãe precisa de ajuda!\nCompre os mantimentos antes de\nfalar com o lobo\n\nPressione 'ESC' para sair"
        );
        return;
      }

      // Conversa com o boss em dois passos
      if (bossDialogStep === 0) {
        dialogManager.show(
          "boss1",
          "Lobo Lobato",
          "Finalmente chegou o\ndia do pagamento.\nEspero que tenha juntado\nmeus R$ 400,00\nPressione 'E' para continuar"
        );
        bossDialogStep = 1;
        return;
      }

      if (bossDialogStep === 1) {
        dialogManager.show(
          "boss2",
          "Lobo Lobato",
          "Me acompanhe... Senhor Pig.\nPressione 'E' para ter sua última conversa"
        );
        bossDialogStep = 2;
        return;
      }

      if (bossDialogStep === 2) {
        talkedToBoss = true;
        dialogManager.hide();
        // Chama função que rodará as cutscenes finais
        triggerFinalCutscene();
      }
      return;
    }

    if (currentMap === "casa" && nearLemonade) {
      if (dialogManager.active && dialogManager.type === "lemonade") {
        if (playerMoney >= 25) {
          playerMoney -= 25;
          moneySpentToday += 25;
          updateMoneyDisplay();
          updateDayDisplay();

          if (momRequests[currentDay].type === "lemonade") {
            itemDeliveredToday = true;
          }
          showItemIcon("Limonada");

          dialogManager.show(
            "lemonadeSuccess",
            "Você comprou uma limonada!",
            "Refrescante! :)"
          );
        } else {
          dialogManager.show(
            "lemonadeFail",
            "Você não tem dinheiro suficiente.",
            "A limonada custa 25 reais.\n"
          );
        }
      } else {
        dialogManager.show(
          "lemonade",
          "Gostaria de uma limonada geladinha por 25 reais?",
          "Pressione 'E' para confirmar\nPressione 'ESC' para cancelar"
        );
        interactedWithLemonade = true;
      }
    } else if (currentMap === "casa" && nearDoor) {
      if (dialogManager.active && dialogManager.type === "door") {
        audioManager.playEffect("minecraft-porta-sound");
        currentMap = "sala";
        loadMap("mapa-sala");
        resizeCanvas();

        // Personagem spawna à esquerda da sala
        pig.x = canvas.width * 0.1;
        pig.y = sidewalkY;
        dialogManager.hide();
      } else {
        dialogManager.show(
          "door",
          "Deseja entrar em casa?",
          "'E' para entrar\n'ESC' para cancelar"
        );
        interactedWithDoor = true;
      }
    }

    // Ver o que a mãe do personagem precisa em cada dia
   if (currentMap === "sala" && nearMom) {
  if (dialogManager.active && dialogManager.type === "momHint") {
    dialogManager.hide();

    const request = momRequests[currentDay];
    if (itemDeliveredToday) {
      // 👇 Remove o item do inventário visual
      hideItemIcon(request.item);

      dialogManager.show(
        "momThanks",
        "Mamãe",
        "Muito obrigada por comprar\n o que eu pedi meu filho! ❤"
      );
    } else {
      dialogManager.show(
        "momRequest",
        "Mamãe",
        `Filho, você pode comprar\n ${request.item} para mim,\n por favor?`
      );
    }
  } else if (dialogManager.type === "momRequest" && !itemDeliveredToday) {
    dialogManager.hide();
  }
}


    if (currentMap === "quarto" && nearBed) {
      // Impede o personagem de dormir quando for dia 5 (final)
      if (currentDay === 5) {
        dialogManager.show(
          "noSleepFinalDay",
          "Não é possível dormir!",
          "Você precisa se encontrar\n com o Lobo Lobato hoje."
        );
        return;
      }

      // Impede o personagem dormir sem comprar o que a mãe precisa
      if (!itemDeliveredToday) {
        dialogManager.show(
          "momNeedsItem",
          "Mamãe ainda precisa da sua ajuda!",
          "Compre o item que ela pediu\n antes de dormir."
        );
        return;
      }

      if (dialogManager.active && dialogManager.type === "bed") {
        const dailyExpense = 20;
        updateMoneyDisplay();

        assets.background.onload = () => {
          resizeCanvas();

          playerMoney -= dailyExpense;
          moneySpentToday += dailyExpense;
          updateMoneyDisplay();

          const moneyLost = moneySpentToday;
          const netEarned = moneyEarnedToday;
          const dailyBalance = netEarned - moneyLost;

          currentDay++;
          updateDayDisplay();
          moneyEarnedToday = 0;
          moneySpentToday = 0;
          workedToday = false;
          itemDeliveredToday = false;

          dialogManager.show(
            "wakeUp",
            `Dia ${currentDay}!`,
            `Dinheiro ganho: R$ ${netEarned},00\nDinheiro perdido: R$ ${moneyLost},00 \n sendo R$ ${dailyExpense},00 de aluguel e comida\nSaldo diário: R$ ${dailyBalance},00\nPressione 'E' para levantar`
          );
          hidePig = true;
          waitingWakeUpDismiss = true;
        };

        currentMap = "quartoNoite";
        loadMap("mapa-quarto-noite");
      } else {
        dialogManager.show(
          "bed",
          "Deseja dormir um pouco? 💤",
          "'E' para dormir\n'ESC' para cancelar"
        );
        interactedWithBed = true;
      }
    } else if (currentMap === "trabalho" && nearOffice) {
      if (workedToday) {
        dialogManager.show(
          "alreadyWorked",
          "Você já trabalhou hoje!",
          "Vá para casa descansar antes de \ntrabalhar novamente."
        );
      } else if (dialogManager.active && dialogManager.type === "office") {
        hidePig = true;
        dialogManager.hide();
        dialogManager.show("working", "No trabalho...", "...");
        setTimeout(() => {
          playerMoney += 113;
          moneyEarnedToday += 113;
          updateMoneyDisplay();
          workedToday = true;
          dialogManager.show(
            "endWork",
            "Fim do expediente!",
            "Você ganhou R$ 113,00!\nPressione 'ESC' para sair"
          );
        }, 2000);
      } else {
        dialogManager.show(
          "office",
          "Deseja começar seu expediente no escritório?",
          "Pressione 'E' para confirmar\nPressione 'ESC' para cancelar"
        );
        interactedWithOffice = true;
      }
    }

    if (currentMap === "shopping" && nearShoppingDoor) {
      if (dialogManager.active && dialogManager.type === "shoppingDoor") {
        audioManager.playEffect("minecraft-porta-sound");
        currentMap = "shoppingInterno";
        audioManager.setMap(currentMap);
        loadMap("mapa-shopping-interno");
        resizeCanvas();
        pig.x = canvas.width / 2 - pig.width / 2;
        pig.y = sidewalkY;
        dialogManager.hide();
      } else {
        dialogManager.show(
          "shoppingDoor",
          "Deseja entrar no shopping?",
          "'E' para entrar\n'ESC' para cancelar"
        );
        interactedWithShoppingDoor = true;
      }
    }

    if (currentMap === "shoppingInterno" && nearLeftShopItem) {
      if (dialogManager.active && dialogManager.type === "leftShop") {
        if (playerMoney >= 30) {
          playerMoney -= 30;
          moneySpentToday += 30;
          updateMoneyDisplay();

          if (momRequests[currentDay].type === "leftShop") {
            itemDeliveredToday = true;
          }
          showItemIcon("Itens de Higiene");

          dialogManager.show(
            "leftShopSuccess",
            "Você comprou itens de Saúde e Higiene!",
            "Cuidado é tudo. :)"
          );
        } else {
          dialogManager.show(
            "leftShopFail",
            "Dinheiro insuficiente!",
            "Os itens custam R$ 30,00."
          );
        }
      } else {
        dialogManager.show(
          "leftShop",
          "Comprar itens de Saúde e Higiene por R$ 30,00?",
          "'E' para confirmar\n'ESC' para cancelar"
        );
        interactedWithLeftShopItem = true;
      }
    }

    if (currentMap === "shoppingInterno" && nearRightShopItem) {
      if (dialogManager.active && dialogManager.type === "rightShop") {
        if (playerMoney >= 40) {
          playerMoney -= 40;
          moneySpentToday += 40;
          updateMoneyDisplay();

          if (momRequests[currentDay].type === "rightShop") {
            itemDeliveredToday = true;
          }
          showItemIcon("Mantimentos");

          dialogManager.show(
            "rightShopSuccess",
            "Você comprou Mantimentos!",
            "Barriga cheia!"
          );
        } else {
          dialogManager.show(
            "rightShopFail",
            "Dinheiro insuficiente!",
            "Os Mantimentos custam R$ 40,00."
          );
        }
      } else {
        dialogManager.show(
          "rightShop",
          "Comprar Mantimentos por R$ 40,00?",
          "'E' para confirmar\n'ESC' para cancelar"
        );
        interactedWithRightShopItem = true;
      }
    }

    if (currentMap === "casino" && nearCasinoDoor) {
      if (dialogManager.active && dialogManager.type === "casinoDoor") {
        audioManager.playEffect("minecraft-porta-sound");
        currentMap = "casinoInterno";
        loadMap("mapa-cassino-interno");
        resizeCanvas();
        pig.x = canvas.width / 2 - pig.width / 2;
        pig.y = sidewalkY;
        dialogManager.hide();
      } else {
        dialogManager.show(
          "casinoDoor",
          "Deseja entrar no cassino?",
          "'E' para entrar\n'ESC' para cancelar"
        );
      }
    }

    if (currentMap === "shoppingInterno" && nearShoppingExit) {
      audioManager.playEffect("minecraft-porta-sound");
      currentMap = "shopping";
      audioManager.setMap(currentMap);
      loadMap("mapa-shopping");
      resizeCanvas();
      pig.x = canvas.width / 2 - pig.width / 2;
      pig.y = sidewalkY;
      dialogManager.hide();
    }

    if (currentMap === "casinoInterno" && nearCasinoExit) {
      audioManager.playEffect("minecraft-porta-sound");
      currentMap = "casino";
      loadMap("mapa-cassino");
      resizeCanvas();
      pig.x = canvas.width / 2 - pig.width / 2;
      pig.y = sidewalkY;
      dialogManager.hide();
    }

    // Interação com as máquinas do cassino
    if (currentMap === "casinoInterno" && nearSlotMachine) {
      if (dialogManager.active && dialogManager.type === "slotMachine") {
        if (playerMoney >= 30) {
          playerMoney -= 30;
          moneySpentToday += 30;
          updateMoneyDisplay();

          slotIsSpining = true;
          dialogManager.show("slotRolling", "Girando... ⏳", " ");

          let results = ["❓", "❓", "❓"];
          let spinInterval = setInterval(() => {
            results = playSlotMachine();
            currentSlotResults = results;
            showSlotResults = true;
          }, 150);

          setTimeout(() => {
            clearInterval(spinInterval);

            const [a, b, c] = results.map((r) => r.name);
            const allSame = a === b && b === c;

            if (allSame) {
              const reward = 100;
              playerMoney += reward;
              moneyEarnedToday += reward;
              updateMoneyDisplay();
              dialogManager.show("slotWin", "Você ganhou! 😎 + R$ 100,00", " ");
            } else {
              dialogManager.show("slotLose", "Você perdeu! 😥", " ");
            }

            // Mostra os símbolos por 2s, depois esconde tudo
            setTimeout(() => {
              showSlotResults = false;
              currentSlotResults = [];
              dialogManager.hide();
              slotIsSpining = false;
            }, 2000);
          }, 5000); // após 5 segundos, exibe o resultado
        } else {
          dialogManager.show(
            "slotNoMoney",
            "Dinheiro insuficiente!",
            "Você precisa de R$ 30,00\n para jogar."
          );
        }
      } else {
        dialogManager.show(
          "slotMachine",
          "Jogar na caça-níquel por R$ 30,00?",
          "Pressione 'E' para confirmar\nPressione 'ESC' para cancelar"
        );
        interactedWithSlotMachine = true;
      }

      resetInteractionFlags();
      return;
    }

    if (currentMap === "sala" && nearRoomExit) {
      audioManager.playEffect("minecraft-porta-sound");
      currentMap = "casa";
      loadMap("mapa-casa");
      resizeCanvas();
      pig.x = canvas.width / 2 - pig.width / 2;
      pig.y = sidewalkY;
      dialogManager.hide();
    }

    resetInteractionFlags();
  }
});

document.addEventListener("keyup", (e) => {
  if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
});

function update() {
  // Impede movimentação do personagem enquanto está no trabalho ou girando a slot machine
  if (dialogManager.type === "working" || slotIsSpining) return;

  let moveX = 0;

  if (keys.ArrowLeft) {
    moveX -= pig.speed;
    pig.direction = "left";
  }
  if (keys.ArrowRight) {
    moveX += pig.speed;
    pig.direction = "right";
  }

  pig.x = Math.max(0, Math.min(canvas.width - pig.width, pig.x + moveX));

  // Pula
  if (keys.ArrowUp && !pig.isJumping) {
    pig.velocityY = jumpForce;
    pig.isJumping = true;
  }

  // Física do pulo
  pig.velocityY += gravity;
  pig.y += pig.velocityY;

  // Para na calçada ao pular
  if (pig.y >= sidewalkY) {
    pig.y = sidewalkY;
    pig.velocityY = 0;
    pig.isJumping = false;
  }

  const internalMaps = ["shoppingInterno", "casinoInterno"];

  if (!internalMaps.includes(currentMap)) {
    if (pig.x + pig.width >= canvas.width - 10) switchMap("right");
    if (pig.x <= 10) switchMap("left");
  }

  // Carregar o mapa especial para o último dia
  if (currentMap === "casa" && currentDay === 5 && !nearBoss) {
    loadMap("mapa-casa-final");
    resizeCanvas();
  }

  // Condicionais para detectar proximidade com os itens/mapas
  // Interação com a limonada
  if (currentMap === "casa" && pig.x >= 30 && pig.x <= 250) {
    nearLemonade = true;
    if (!dialogManager.active && !justClosedLemonadeDialog) {
      dialogManager.show(
        "lemonadeHint",
        "Barraquinha de Limonada!",
        "Pressione 'E' para interagir"
      );
    }
  } else {
    nearLemonade = false;
    interactedWithLemonade = false;
    if (
      dialogManager.type === "lemonade" ||
      dialogManager.type === "lemonadeHint" ||
      dialogManager.type === "lemonadeSuccess" ||
      dialogManager.type === "lemonadeFail"
    ) {
      dialogManager.hide();
    }
  }

  // Interação com a porta da casa
  if (currentMap === "casa" && isNearCenter()) {
    nearDoor = true;
    if (!dialogManager.active && !justClosedDoorDialog) {
      dialogManager.show(
        "doorHint",
        "Porta da Casa!",
        "Pressione 'E' para interagir"
      );
    }
  } else {
    nearDoor = false;
    interactedWithDoor = false;
    if (dialogManager.type === "door" || dialogManager.type === "doorHint") {
      dialogManager.hide();
    }
  }

  // Interagir com o Boss no dia final
  if (
    currentMap === "casa" &&
    currentDay === 5 &&
    pig.x + pig.width >= canvas.width - 300
  ) {
    nearBoss = true;
    if (!dialogManager.active && bossDialogStep === 0) {
      dialogManager.show(
        "finalBossHint",
        "Lobo Lobato te espera...",
        "Pressione 'E' para interagir"
      );
    }
  } else {
    if (
      dialogManager.type === "finalBossHint" ||
      dialogManager.type === "boss1" ||
      dialogManager.type === "boss2" ||
      dialogManager.type === "bossBlocked"
    ) {
      dialogManager.hide();
    }
    nearBoss = false;
    bossDialogStep = 0; // Reinicia os diálogos ao sair de perto
  }

  // Interação com escritório no mapa de trabalho
  if (currentMap === "trabalho" && isNearCenter()) {
    nearOffice = true;

    if (!dialogManager.active && !justClosedOfficeDialog) {
      dialogManager.show(
        "officeHint",
        "Escritório de Trabalho",
        "Pressione 'E' para trabalhar"
      );
    }
  } else {
    nearOffice = false;
    interactedWithOffice = false;

    if (
      dialogManager.type === "office" ||
      dialogManager.type === "officeHint" ||
      dialogManager.type === "alreadyWorked"
    ) {
      dialogManager.hide();
    }
  }

  // Interação com a porta do shopping
  if (currentMap === "shopping" && isNearCenter()) {
    nearShoppingDoor = true;
    if (!dialogManager.active && !justClosedShoppingDoorDialog) {
      dialogManager.show(
        "shoppingDoorHint",
        "Porta do shopping!",
        "Pressione 'E' para interagir"
      );
    }
  } else {
    nearShoppingDoor = false;
    interactedWithShoppingDoor = false;
    if (
      dialogManager.type === "shoppingDoor" ||
      dialogManager.type === "shoppingDoorHint"
    ) {
      dialogManager.hide();
    }
  }

  // Balão de interação com a prateleira esquerda do shopping
  if (currentMap === "shoppingInterno" && pig.x >= 101 && pig.x <= 280) {
    nearLeftShopItem = true;
    // Se o balão de diálogo não está ativo e o jogador ainda não interagiu
    if (!dialogManager.active && !interactedWithLeftShopItem) {
      dialogManager.show(
        "leftShopHint",
        "Saúde e Higiene",
        "Pressione 'E' para ver produtos\n de Saúde e Higiene por R$ 30,00"
      );
    }
    // Se não está mais perto do item, mas o balão está visível
  } else if (
    dialogManager.type === "leftShopHint" ||
    dialogManager.type == "leftShopSuccess" ||
    dialogManager.type == "leftShopFail"
  ) {
    nearLeftShopItem = false; // Marca que o jogador saiu de perto do balão
    interactedWithLeftShopItem = false; // Reseta interação
    dialogManager.hide(); // Esconde o balão
  }

  // Balão de interação com a prateleira direita do shopping
  if (
    currentMap === "shoppingInterno" &&
    pig.x + pig.width >= canvas.width - 420
  ) {
    nearRightShopItem = true;
    if (!dialogManager.active && !interactedWithRightShopItem) {
      dialogManager.show(
        "rightShopHint",
        "Mantimentos",
        "Pressione 'E' para ver \nMantimentos por R$ 40,00"
      );
    }
  } else if (
    dialogManager.type === "rightShopHint" ||
    dialogManager.type == "rightShopSuccess" ||
    dialogManager.type == "rightShopFail"
  ) {
    nearRightShopItem = false;
    interactedWithRightShopItem = false;
    dialogManager.hide();
  }

  // Interação com a porta do cassino
  if (currentMap === "casino" && isNearCenter()) {
    nearCasinoDoor = true;
    if (!dialogManager.active && !justClosedCasinoDoorDialog) {
      dialogManager.show(
        "casinoDoorHint",
        "Porta do Cassino!",
        "Pressione 'E' para interagir"
      );
    }
  } else {
    nearCasinoDoor = false;
    interactedWithCasinoDoor = false;
    if (
      dialogManager.type === "casinoDoor" ||
      dialogManager.type === "casinoDoorHint"
    ) {
      dialogManager.hide();
    }
  }

  if (currentMap === "sala" && isNearCenter()) {
    nearMom = true;
    if (!dialogManager.active && !justClosedMomDialog) {
      dialogManager.show("momHint", "Mamãe!", "Pressione 'E' para interagir");
    }
  } else {
    nearMom = false;
    if (
      dialogManager.type === "momHint" ||
      dialogManager.type === "momRequest" ||
      dialogManager.type === "momThanks"
    ) {
      dialogManager.hide();
    }
  }

  // Interação com a cama no quarto
  if (currentMap === "quarto" && isNearCenter()) {
    nearBed = true;
    if (!dialogManager.active && !justClosedBedDialog) {
      dialogManager.show(
        "bedHint",
        "Cama confortável!",
        "Pressione 'E' para dormir"
      );
    }
  } else {
    nearBed = false;
    interactedWithBed = false;
    if (
      dialogManager.type === "bed" ||
      dialogManager.type === "bedHint" ||
      dialogManager.type === "noSleepFinalDay" ||
      dialogManager.type === "momNeedsItem"
    ) {
      dialogManager.hide();
    }
  }

  // Saída do shopping (lado esquerdo)
  if (currentMap === "shoppingInterno" && pig.x <= 100) {
    nearShoppingExit = true;
    if (!dialogManager.active) {
      dialogManager.show(
        "shoppingExitHint",
        "",
        "Pressione 'E' para sair do shopping"
      );
    }
  } else if (dialogManager.type === "shoppingExitHint") {
    nearShoppingExit = false;
    dialogManager.hide();
  }

  // Saída do cassino (lado esquerdo)
  if (currentMap === "casinoInterno" && pig.x <= 100) {
    nearCasinoExit = true;
    if (!dialogManager.active) {
      dialogManager.show(
        "casinoExitHint",
        "",
        "Pressione 'E' para sair do cassino"
      );
    }
  } else if (dialogManager.type === "casinoExitHint") {
    nearCasinoExit = false;
    dialogManager.hide();
  }

  if (currentMap === "casinoInterno" && isNearCenter()) {
    if (!dialogManager.active && !interactedWithSlotMachine) {
      dialogManager.show(
        "slotMachineHint",
        "Máquina de Caça-Níquel",
        "Pressione 'E' para jogar\n por R$ 30,00"
      );
    }
    nearSlotMachine = true;
  } else {
    if (
      dialogManager.type === "slotMachineHint" ||
      dialogManager.type === "slotMachine"
    ) {
      dialogManager.hide();
    }
    nearSlotMachine = false;
    interactedWithSlotMachine = false;
  }

  // Saída da sala (lado esquerdo)
  if (currentMap === "sala" && pig.x <= 100) {
    nearRoomExit = true;
    if (!dialogManager.active) {
      dialogManager.show("roomExitHint", "", "Pressione 'E' para sair da casa");
    }
  } else if (dialogManager.type === "roomExitHint") {
    nearRoomExit = false;
    dialogManager.hide();
  }

  // Atualiza o diálogo (fade)
  dialogManager.update();
}

function drawRoundedRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let pigImage = assets.pigIdle;
  pig.currentWidth = 200;
  pig.currentHeight = 200;

  if (pig.isJumping) {
    pigImage = assets.pigJump;
    pig.currentWidth = 200;
    pig.currentHeight = 200;
  } else if (!hidePig && (keys.ArrowLeft || keys.ArrowRight)) {
    walkFrameCounter++;
    if (walkFrameCounter >= 20) { // Velocidade da animação de andar (a cada quantos ciclos o frame muda)
      walkFrame = (walkFrame + 1) % 2;
      walkFrameCounter = 0;
    }
    pigImage = walkFrame === 0 ? assets.pigWalk1 : assets.pigWalk2;
    pig.currentWidth = 125;
    pig.currentHeight = 198;
  }

  // Desenhar fundo
  ctx.drawImage(assets.background, 0, 0, canvas.width, canvas.height);

  // Desenhar personagem
  if (!hidePig) {
    ctx.save();
    const drawX = pig.x;
    // Cálculo para a altura diminuir de cima pra baixo, e não o inverso.
    const drawY = pig.y + (pig.height - pig.currentHeight);
    if (pig.direction === "left") {
      ctx.translate(drawX + pig.currentWidth, drawY);
      ctx.scale(-1, 1);
      ctx.drawImage(pigImage, 0, 0, pig.currentWidth, pig.currentHeight);
    } else {
      ctx.drawImage(
        pigImage,
        drawX,
        drawY,
        pig.currentWidth,
        pig.currentHeight
      );
    }
    ctx.restore();
  }

  // Desenha diálogo gerenciado pelo dialogManager
  dialogManager.draw(ctx, canvas);

  // Estilo do HUD (interface gráfica)
  const layoutWidth = 250;
  const layoutHeight = 80;
  const padding = 10;

  ctx.fillStyle = "rgba(101, 157, 90, 0.9)";
  drawRoundedRect(padding, padding, layoutWidth, layoutHeight, 10);
  ctx.fill();

  ctx.strokeStyle = "rgb(80, 130, 70)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "white";
  ctx.font = "16px sans-serif";
  ctx.fillText(`Mapa: ${currentMap}`, padding + 10, padding + 25);
  ctx.fillText(`X: ${Math.round(pig.x)}`, padding + 10, padding + 45);
  ctx.fillText(`Y: ${Math.round(pig.y)}`, padding + 10, padding + 65);
}

const slotIcons = {
  bacon: new Image(),
  cofre: new Image(),
  limonada: new Image(),
  moeda: new Image(),
  porco: new Image(),
};

slotIcons.bacon.src = "./imagens/slot-machine/bacon.png";
slotIcons.cofre.src = "./imagens/slot-machine/cofre.png";
slotIcons.limonada.src = "./imagens/slot-machine/limonada.png";
slotIcons.moeda.src = "./imagens/slot-machine/moeda.png";
slotIcons.porco.src = "./imagens/slot-machine/porco.png";

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

let assetsLoaded = 0;
function checkAllLoaded() {
  assetsLoaded++;
  if (assetsLoaded === 2) {
    resizeCanvas();
    // Pig spawna na frente de casa
    pig.x = (canvas.width - pig.width) / 2;
    pig.y = sidewalkY;
    gameLoop();
  }
}

assets.background.onload = checkAllLoaded;
assets.pigIdle.onload = checkAllLoaded;

loadMap("mapa-casa");

window.addEventListener("resize", resizeCanvas);

function startGame() {
  console.log("O jogo começou!"); 
}

function showItemIcon(itemName) {
  const iconIdMap = {
    "Limonada": "icon-limonada",
    "Itens de Higiene": "icon-higiene",
    "Mantimentos": "icon-mantimentos"
  };

  const id = iconIdMap[itemName];
  if (id) {
    document.getElementById(id).style.display = "block";
  }
}

function hideItemIcon(itemName) {
  const iconIdMap = {
    "Limonada": "icon-limonada",
    "Itens de Higiene": "icon-higiene",
    "Mantimentos": "icon-mantimentos"
  };

  const id = iconIdMap[itemName];
  if (id) {
    document.getElementById(id).style.display = "none";
  }
}

function clearInventoryIcons() {
  document.getElementById("icon-limonada").style.display = "none";
  document.getElementById("icon-higiene").style.display = "none";
  document.getElementById("icon-mantimentos").style.display = "none";
}


