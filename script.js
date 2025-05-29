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
    width: 225,
    height: 225,
    speed: 4,
    velocityY: 0,
    isJumping: false,
    direction: "right"
};

const gravity = 0.5;
const jumpForce = -12;
let groundY = 0;

let currentMap = "casa";
let showBox = false;
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
    groundY = canvas.height - pig.height - 30;
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

document.addEventListener("keydown", e => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = true;

    if (e.key === "e" || e.key === "E") {
    if (currentMap === "shopping" && pig.x >= 817 && pig.x <= 1093) {
        showBox = !showBox;
        dialogType = "shopping";
    }

    if (currentMap === "casa" && nearLemonade) {
        showBox = true;
        interactedWithLemonade = true;
        dialogType = "lemonade";
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
    if (keys.ArrowUp && !pig.isJumping) {
    pig.velocityY = jumpForce;
    pig.isJumping = true;
    }

    pig.velocityY += gravity;
    pig.y += pig.velocityY;

    if (pig.y >= groundY) {
    pig.y = groundY;
    pig.velocityY = 0;
    pig.isJumping = false;
    }

    pig.x = Math.max(0, Math.min(canvas.width - pig.width, pig.x + moveX));

    if (pig.x + pig.width >= canvas.width - 10) switchMap("right");
    if (pig.x <= 10) switchMap("left");

    if (currentMap === "casa" && pig.x >= 30 && pig.x <= 250) {
    nearLemonade = true;
    } else {
    nearLemonade = false;
    interactedWithLemonade = false;
    }
}

let dialogType = null;
let nearLemonade = false;
let interactedWithLemonade = false;

// Função para desenhar uma borda com cantos arredondados ao HUD.
// Precisa chamar ctx.fill() para preencher a caixa e/ou ctx.stroke() para desenhar o contorno.
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

    // Caixa de diálogo
    if (showBox || nearLemonade) {
    const boxWidth = 700;
    const boxHeight = 200;
    const centerX = canvas.width / 2 - boxWidth / 2;
    const centerY = canvas.height - boxHeight - 50;

    ctx.fillStyle = "rgba(101, 157, 90, 0.9)";
    drawRoundedRect(centerX, centerY, boxWidth, boxHeight, 15);
    ctx.fill();

    ctx.strokeStyle = "rgb(80, 130, 70)";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.font = "20px sans-serif";
    ctx.fillText("Pressione 'E' para continuar...", centerX + 20, centerY + 50);

    ctx.font = "18px sans-serif";
    if (dialogType === "shopping") {
        ctx.fillText("Olá, viajante! Bem-vindo ao mundo dos porcos aventureiros.", centerX + 20, centerY + 90);
    } else if (dialogType === "lemonade") {
        ctx.fillText("Olá! Quer uma limonada geladinha por 1 moeda?", centerX + 20, centerY + 90);
    } else {
        ctx.fillText("Interação genérica.", centerX + 20, centerY + 90);
    }
    }

    // HUD (interface gráfica)
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
    pig.x = 50;
    pig.y = groundY;
    gameLoop();
    }
}

// Início
assets.background.onload = checkAllLoaded;
assets.pig.onload = checkAllLoaded;

// Primeiro mapa
loadMap('mapa-casa');

window.addEventListener("resize", resizeCanvas);