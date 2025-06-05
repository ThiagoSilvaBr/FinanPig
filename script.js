document.addEventListener("DOMContentLoaded", function () {
    const screen = document.getElementById("startScreen");
    const backToMenuButton = document.getElementById("backToMenu");

    document.getElementById("startButton").addEventListener("click", function () { // Função ao clicar no botão de iniciar jogo
        screen.classList.add("fade-out"); // Adiciona a classe CSS fade-out (transição de opacidade)
        setTimeout(() => {
            screen.style.display = "none"; // Esconde a tela completamente
        }, 800); // Tempo da transição para esconder a tela. O mesmo colocado no css (0.8s)
    });

    backToMenuButton.addEventListener("click", function(){ // Função ao clicar no botão de voltar ao menu do jogo
        screen.style.display = "flex";
        screen.classList.remove("fade-out");  

        pig.x = (canvas.width - pig.width) / 2; // Reposiciona o personagem no local de spawn original
        pig.y = sidewalkY;

        dialogManager.hide(); // Fecha qualquer balão de interação
        hidePig = false; // Garante que o personagem irá respawnar
        workedToday = false;

        // Reseta o dinheiro e o dia do jogo
        playerMoney = 100;
        updateMoneyDisplay();
        currentDay = 1;
        updateDayDisplay();
 
        currentMap = "casa";
        loadMap("mapa-casa");
        resizeCanvas();
    });
});

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const assets = {
    background: new Image(),
    pig: new Image()
};

assets.pig.src = "./imagens/personagens/personagem-lateral-direita.png";

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
    direction: "right"
};

const gravity = 0.5;
const jumpForce = -12;
let sidewalkY = 0;

let currentMap = "casa";
let canSwitchMap = true;

const maps = {
    casa: { transitions: { right: "trabalho" } },
    trabalho: { transitions: { left: "casa", right: "shopping" } },
    shopping: { transitions: { left: "trabalho", right: "casino" } },
    casino: { transitions: { left: "shopping" } },
    shoppingInterno: { transitions: {} },  
    casinoInterno: { transitions: {} },
    sala: { transitions: { right: "quarto" } },
    quarto: { transitions: { left: "sala" } }
};

function resizeCanvas() {
    const navbarHeight = document.getElementById("mainNavbar").offsetHeight;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - navbarHeight;

    // Ajusta dinamicamente a posição vertical da calçada a partir da altura da tela
    sidewalkY = canvas.height - pig.height - (canvas.height * 0.18);
}

function switchMap(direction) {
    const nextMap = maps[currentMap].transitions[direction];
    if (nextMap && canSwitchMap) {
        const previousMap = currentMap;
        currentMap = nextMap;
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
            quartoNoite: "mapa-quarto-noite"
        };

        loadMap(mapFileNames[currentMap]);
        resizeCanvas();

        pig.x = direction === "right" ? 0 : canvas.width - pig.width;      
        setTimeout(() => canSwitchMap = true, 300);
    }
}

const keys = {
    ArrowUp: false,
    ArrowLeft: false,
    ArrowRight: false
};

let nearLemonade = false;
let interactedWithLemonade = false;
let justClosedLemonadeDialog = false;

let nearDoor = false;
let nearRoomExit = false;
let interactedWithDoor = false;
let justClosedDoorDialog = false;

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

let nearCasinoDoor = false;
let nearCasinoExit = false;
let interactedWithCasinoDoor = false;
let justClosedCasinoDoorDialog = false;

let playerMoney = 100;
let moneySpentToday = 0;
let moneyEarnedToday = 0;
let currentDay = 1;

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
        if (this.opacity < 0.01) return;

        const boxWidth = Math.min(canvas.width * 0.8, 600);
        const boxHeight = 200;
        const centerX = canvas.width / 2 - boxWidth / 2;
        const centerY = 10;

        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(0, (1 - this.opacity) * -20);

        ctx.fillStyle = "rgba(101, 157, 90, 0.9)";
        drawRoundedRect(centerX, centerY, boxWidth, boxHeight, 15);
        ctx.fill();

        ctx.strokeStyle = "rgb(80, 130, 70)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.font = "20px sans-serif";
        ctx.fillText(this.text, centerX + 20, centerY + 50);

        if (this.subtext) {
            ctx.font = "18px sans-serif";
            const lines = this.subtext.split("\n");
            lines.forEach((line, index) =>{
                ctx.fillText(line, centerX + 20, centerY + 90 + index * 25); // Configura espaço entre as linhas
            });
        }

        ctx.restore();
    }
};

function updateMoneyDisplay() {
    const moneyElement = document.getElementById("money");
    if (moneyElement) {
        moneyElement.textContent = `R$ ${playerMoney},00`;

        if (playerMoney < 0) {
            moneyElement.style.color = "red";
        } else {
            moneyElement.style.color = ""; // Volta à cor padrão
        }
    }
}

function updateDayDisplay() {
    const dayElement = document.getElementById("day");
    if (dayElement) {
        dayElement.textContent = `Dia ${currentDay}`;
    }
}

// Função para calcular o centro do mapa, para posicionar o balão de interação de entrada aos mapas internos
function isNearCenter(threshold = 0.06){
    const center = canvas.width / 2;
    const range = canvas.width * threshold;
    return pig.x + pig.width >= center - range && pig.x <= center + range;
};

// Função para evitar bug de não conseguir entrar mais de uma vez nos mapas internos
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

    justClosedCasinoDoorDialog = false;
    interactedWithCasinoDoor = false;
    nearCasinoDoor = false;

    justClosedBedDialog = false;
    interactedWithBed = false;
    nearBed = false;

    nearCasinoExit = false;
    nearRoomExit = false;
    nearShoppingExit = false;
};

document.addEventListener("keydown", e => {
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
                setTimeout(() => justClosedLemonadeDialog = false, 500);
                break;
            case "door":
            case "doorHint":
                justClosedDoorDialog = true;
                setTimeout(() => justClosedDoorDialog = false, 500);
                break;
            case "office":
            case "alreadyWorked":
                justClosedOfficeDialog = true;
                setTimeout(() => justClosedOfficeDialog = false, 500);
                break;
            case "endWork":
                justClosedOfficeDialog = true;
                hidePig = false;
                setTimeout(() => justClosedOfficeDialog = false, 500);
                break;
            case "shoppingDoor":
            case "shoppingDoorHint":
                justClosedShoppingDoorDialog = true;
                setTimeout(() => justClosedShoppingDoorDialog = false, 500);
                break;
            case "casinoDoor":
            case "casinoDoorHint":
                justClosedCasinoDoorDialog = true;
                setTimeout(() => justClosedCasinoDoorDialog = false, 500);
                break;
            case "bed":
            case "bedHint":
                justClosedBedDialog = true;
                setTimeout(() => justClosedBedDialog = false, 500);
                break;
        }
    }
}

    if (e.key === "e" || e.key === "E") {
        if (dialogManager.active && dialogManager.type === "endWork") {
            dialogManager.hide();
            hidePig = false;
            justClosedOfficeDialog = true;
            setTimeout(() => justClosedOfficeDialog = false, 500);
            return;
        }

        if (waitingWakeUpDismiss && dialogManager.active && dialogManager.type === "wakeUp") {
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

        if (currentMap === "casa" && nearLemonade) {
            if (dialogManager.active && dialogManager.type === "lemonade") {
                if (playerMoney >= 25) {
                    playerMoney -= 25;
                    moneySpentToday += 25;
                    updateMoneyDisplay();
                    updateDayDisplay();
                    dialogManager.show("lemonadeSuccess", "Você comprou uma limonada!", "Refrescante! :)");
                } else {
                    dialogManager.show("lemonadeFail", "Você não tem dinheiro suficiente.", "A limonada custa 25 reais.\n");
                }
            } else {
                dialogManager.show("lemonade", "Gostaria de uma limonada geladinha por 25 reais?", "Pressione 'E' para confirmar\nPressione 'ESC' para cancelar.");
                interactedWithLemonade = true;
            }
        }

        else if (currentMap === "casa" && nearDoor) {
            if (dialogManager.active && dialogManager.type === "door") {
                currentMap = "sala";
                loadMap("mapa-sala");
                resizeCanvas();
                pig.x = canvas.width / 2 - pig.width / 2;
                pig.y = sidewalkY;
                dialogManager.hide();
            } else {
                dialogManager.show("door", "Deseja entrar em casa?", "'E' para entrar\n'ESC' para cancelar.");
                interactedWithDoor = true;
            }
        }

        if (currentMap === "quarto" && nearBed) {
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

                    dialogManager.show(
                        "wakeUp",
                        `Dia ${currentDay}!`,
                        `Dinheiro ganho: R$ ${netEarned},00\nDinheiro perdido: R$ ${moneyLost},00, sendo R$ ${dailyExpense},00 de aluguel e comida\nSaldo diário: R$ ${dailyBalance},00\nPressione 'E' para levantar.`);
                    hidePig = true;
                    waitingWakeUpDismiss = true;
                };

                currentMap = "quartoNoite";
                loadMap("mapa-quarto-noite");
            } else {
                dialogManager.show("bed", "Deseja dormir um pouco? 💤", "'E' para dormir\n'ESC' para cancelar.");
                interactedWithBed = true;
            }
        }

        else if (currentMap === "trabalho" && nearOffice) {
            if (workedToday) {
                dialogManager.show("alreadyWorked", "Você já trabalhou hoje!", "Vá para casa descansar antes de trabalhar novamente.");
            } else if (dialogManager.active && dialogManager.type === "office") {
                hidePig = true;
                dialogManager.hide();
                dialogManager.show("working", "No trabalho...", "...");
                setTimeout(() => {
                    playerMoney += 50;
                    moneyEarnedToday += 50;
                    updateMoneyDisplay();
                    workedToday = true;
                    dialogManager.show("endWork", "Fim do expediente!", "Você ganhou R$ 50,00!\nPressione 'ESC' para sair.");
                }, 2000);
            } else {
                dialogManager.show("office", "Deseja começar seu expediente no escritório?", "Pressione 'E' para confirmar\nPressione 'ESC' para cancelar.");
                interactedWithOffice = true;
            }
        }

        if (currentMap === "shopping" && nearShoppingDoor) {
            if (dialogManager.active && dialogManager.type === "shoppingDoor") {
                currentMap = "shoppingInterno";
                loadMap("mapa-shopping-interno");
                resizeCanvas();
                pig.x = canvas.width / 2 - pig.width / 2;
                pig.y = sidewalkY;
                dialogManager.hide();
            } else {
                dialogManager.show("shoppingDoor", "Deseja entrar no shopping?", "'E' para entrar\n'ESC' para cancelar.");
                interactedWithShoppingDoor = true;
            }
        }

        if (currentMap === "casino" && nearCasinoDoor) {
            if (dialogManager.active && dialogManager.type === "casinoDoor") {
                currentMap = "casinoInterno";
                loadMap("mapa-cassino-interno");
                resizeCanvas();
                pig.x = canvas.width / 2 - pig.width / 2;
                pig.y = sidewalkY;
                dialogManager.hide();
            } else {
                dialogManager.show("casinoDoor", "Deseja entrar no cassino?", "'E' para entrar\n'ESC' para cancelar.");
            }
        }

        if (currentMap === "shoppingInterno" && nearShoppingExit) {
            currentMap = "shopping";
            loadMap("mapa-shopping");
            resizeCanvas();
            pig.x = canvas.width / 2 - pig.width / 2;
            pig.y = sidewalkY;
            dialogManager.hide();
        }

        if (currentMap === "casinoInterno" && nearCasinoExit) {
            currentMap = "casino";
            loadMap("mapa-cassino");
            resizeCanvas();
            pig.x = canvas.width / 2 - pig.width / 2;
            pig.y = sidewalkY;
            dialogManager.hide();
        }

        if (currentMap === "sala" && nearRoomExit) {
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

document.addEventListener("keyup", e => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
});

function update() {
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

    // Interação com a limonada
    if (currentMap === "casa" && pig.x >= 30 && pig.x <= 250) {
        nearLemonade = true;
        if (!dialogManager.active && !justClosedLemonadeDialog) {
            dialogManager.show(
                "lemonadeHint",
                "Barraquinha de Limonada!",
                "Pressione 'E' para interagir."
            );
        }
    } else {
        nearLemonade = false;
        interactedWithLemonade = false;
        if (dialogManager.type === "lemonade" ||
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
                "Pressione 'E' para interagir."
            );
        }
    } else {
        nearDoor = false;
        interactedWithDoor = false;
        if (dialogManager.type === "door" || dialogManager.type === "doorHint") {
            dialogManager.hide();
        }
    }

    // Interação com escritório no mapa de trabalho
    if (currentMap === "trabalho" && isNearCenter()) {
        nearOffice = true;

        if (!dialogManager.active && !justClosedOfficeDialog) {
            dialogManager.show(
                "officeHint",
                "Escritório de Trabalho",
                "Pressione 'E' para iniciar o expediente."
            );
        }
    } else {
        nearOffice = false;
        interactedWithOffice = false;

        if (dialogManager.type === "office" ||
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
                "Pressione 'E' para interagir."
            );
        }
    } else {
        nearShoppingDoor = false;
        interactedWithShoppingDoor = false;
        if (dialogManager.type === "shoppingDoor" || dialogManager.type === "shoppingDoorHint") {
            dialogManager.hide();
        }
    }

    // Interação com a porta do cassino
    if (currentMap === "casino" && isNearCenter()) {
        nearCasinoDoor = true;
        if (!dialogManager.active && !justClosedCasinoDoorDialog) {
            dialogManager.show(
                "casinoDoorHint",
                "Porta do Cassino!",
                "Pressione 'E' para interagir."
            );
        }
    } else {
        nearCasinoDoor = false;
        interactedWithCasinoDoor = false;
        if (dialogManager.type === "casinoDoor" || dialogManager.type === "casinoDoorHint") {
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
                "Pressione 'E' para dormir."
            );
        }
    } else {
        nearBed = false;
        interactedWithBed = false;
        if (dialogManager.type === "bed" || dialogManager.type === "bedHint") {
            dialogManager.hide();
        }
    }

    // Saída do shopping (lado esquerdo)
    if (currentMap === "shoppingInterno" && pig.x <= 100) {
        nearShoppingExit = true;
        if (!dialogManager.active) {
            dialogManager.show("shoppingExitHint", "", "Pressione 'E' para sair do shopping");
        }
    } else if (dialogManager.type === "shoppingExitHint") {
        nearShoppingExit = false;
        dialogManager.hide();
    }

    // Saída do cassino (lado esquerda)
    if (currentMap === "casinoInterno" && pig.x <= 100) {
        nearCasinoExit = true;
        if (!dialogManager.active) {
            dialogManager.show("casinoExitHint", "", "Pressione 'E' para sair do cassino");
        }
    } else if (dialogManager.type === "casinoExitHint") {
        nearCasinoExit = false;
        dialogManager.hide();
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

    // Desenhar fundo
    ctx.drawImage(assets.background, 0, 0, canvas.width, canvas.height);

    // Desenhar personagem
    if (!hidePig) {
        ctx.save();
        if (pig.direction === "left") {
            ctx.translate(pig.x + pig.width, pig.y);
            ctx.scale(-1, 1);
            ctx.drawImage(assets.pig, 0, 0, pig.width, pig.height);
        } else {
            ctx.drawImage(assets.pig, pig.x, pig.y, pig.width, pig.height);
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
assets.pig.onload = checkAllLoaded;

loadMap('mapa-casa');

window.addEventListener("resize", resizeCanvas);