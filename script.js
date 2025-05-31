document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("startButton").addEventListener("click", function(){
        const screen = document.getElementById("startScreen");
        screen.classList.add("fade-out");// Adiciona a classe CSS fade-out (transição de opacidade)

        setTimeout(() =>{
            screen.style.display = "none";// Esconde a tela completamente
        }, 800);// Tempo da transição para esconder a tela. O mesmo colocado no css (0.8s)
    });
});

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const assets = {
    background: new Image(),
    pig: new Image()
};

assets.pig.src = "./Imagens/Personagem/personagem-lateral-direita.png";

function loadMap(mapName) {
    assets.background.src = `./Imagens/Mapas/${mapName}.png`;
}

const pig = {
    x: 0,
    y: 0,
    width: 200,
    height: 200,
    speed: 4,
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
    casa: { transitions: { right: "shopping" } },
    shopping: { transitions: { left: "casa", right: "casino" } },
    casino: { transitions: { left: "shopping" } }
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
        currentMap = nextMap;
        canSwitchMap = false;

        const mapFileNames = {
            casa: "mapa-casa",
            shopping: "mapa-shopping",
            casino: "mapa-cassino-dia"
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
let interactedWithDoor = false;
let justClosedDoorDialog = false;

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
            ctx.fillText(this.subtext, centerX + 20, centerY + 90);
        }

        ctx.restore();
    }
};

document.addEventListener("keydown", e => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = true;

    if (e.key === "e" || e.key === "E") {
        if (currentMap === "shopping" && pig.x >= 817 && pig.x <= 1093) {
            if (!dialogManager.active) {
                dialogManager.show(
                    "shopping",
                    "Olá, viajante! Bem-vindo ao mundo dos porcos aventureiros.",
                    "Pressione 'E' para fechar."
                );
            } else {
                dialogManager.hide();
            }
        }

        if (currentMap === "casa" && nearLemonade) {
            if (dialogManager.active && dialogManager.type === "lemonade") {
                dialogManager.hide();
                justClosedLemonadeDialog = true;
                setTimeout(() => {
                    justClosedLemonadeDialog = false;// Depois de 500ms libera o lemonade hint de novo
                }, 500);
            } else {
            // Caso contrário, sempre mostra o diálogo da limonada
                dialogManager.show(
                    "lemonade",
                    "Gostaria de uma limonada geladinha por 25 moedas?",
                    "Pressione 'E' para fechar."
                );
                interactedWithLemonade = true;
            }
        }

        if (currentMap === "casa" && nearDoor) {
            if (dialogManager.active && dialogManager.type === "door") {
                dialogManager.hide();
                justClosedDoorDialog = true;
                setTimeout(() => {
                    justClosedDoorDialog = false;
                }, 500);
            } else {
                dialogManager.show(
                    "door",
                    "Você deseja entrar na casa?",
                    "Pressione 'E' para fechar."
                );
                interactedWithDoor = true;
            }
        }
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

    if (pig.x + pig.width >= canvas.width - 10) switchMap("right");
    if (pig.x <= 10) switchMap("left");

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
        if (dialogManager.type === "lemonade" || dialogManager.type === "lemonadeHint") {
            dialogManager.hide();
        }    
    }

    // Interação com a porta
    if (currentMap === "casa" && pig.x >= 344 && pig.x <= 480) {
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
    ctx.save();
    if (pig.direction === "left") {
        ctx.translate(pig.x + pig.width, pig.y);
        ctx.scale(-1, 1);
        ctx.drawImage(assets.pig, 0, 0, pig.width, pig.height);
    } else {
        ctx.drawImage(assets.pig, pig.x, pig.y, pig.width, pig.height);
    }
    ctx.restore();

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
