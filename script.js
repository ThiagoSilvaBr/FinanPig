document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("startButton").addEventListener("click", function(){
        const screen = document.getElementById("startScreen");
        screen.classList.add("fade-out"); // Adiciona a classe CSS fade-out (transição de opacidade)

        setTimeout(() =>{
            screen.style.display = "none"; // Esconde a tela completamente
        }, 800); // Tempo da transição para esconder a tela. O mesmo colocado no css (0.8s)
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
let groundY = 0;
let sidewalkY = 0;

let currentMap = "casa";
let showBox = false;
let canSwitchMap = true;

const maps = {
    casa: { transitions: { right: "shopping" } },
    shopping: { transitions: { left: "casa", right: "casino" } },
    casino: { transitions: { left: "shopping" } }
};

const lemonadeStand = {
    xPercent: 0.15,
    widthPercent: 0.1,
    height: 30,
    x: 0,
    y: 0,
    updatePosition: function(){
        this.x = canvas.width * this.xPercent;
        this.width = canvas.width * this.widthPercent;
        this.y = sidewalkY - this.height;
    }
}

function resizeCanvas() {
    const navbarHeight = document.getElementById("mainNavbar").offsetHeight;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - navbarHeight;

    // Ajusta dinamicamente a posição vertical da calçada a partir da altura da tela
    sidewalkY = canvas.height - pig.height - (canvas.height * 0.18);

    lemonadeStand.updatePosition();
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
        if (!showBox) {
            // Tenta abrir o balão apenas se o jogador estiver perto da barraca
            if (currentMap === "shopping" && pig.x >= 817 && pig.x <= 1093) {
                showBox = true;
                dialogType = "shopping";
            }

            if (currentMap === "casa" && nearLemonade) {
                showBox = true;
                interactedWithLemonade = true;
                dialogType = "lemonade";
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
    if(keys.ArrowUp && !pig.isJumping){
        pig.velocityY = jumpForce;
        pig.isJumping = true;
    }

    // Física do pulo
    pig.velocityY += gravity;
    pig.y += pig.velocityY;

    // Para na calçada ao pular
    if(pig.y >= sidewalkY){
        pig.y = sidewalkY;
        pig.velocityY = 0;
        pig.isJumping = false;
    }

    if (pig.x + pig.width >= canvas.width - 10) switchMap("right");
    if (pig.x <= 10) switchMap("left");

    // Interação com a barraca de limonada
    if (currentMap === "casa" && pig.x + pig.width > lemonadeStand.x && pig.x < lemonadeStand.x + lemonadeStand.width) {
        nearLemonade = true;
    } else {
        nearLemonade = false;
        interactedWithLemonade = false;
    }
    if (!nearLemonade && dialogType === "lemonade") {
    showBox = false;
    dialogType = null;
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
    // Caixa de diálogo estilo balão com seta
if (showBox || nearLemonade) {
    const balloonWidth = 220;
    const balloonHeight = 100;
    const pointerSize = 20;

    const balloonX = lemonadeStand.x + lemonadeStand.width / 2 - balloonWidth / 2;
    const balloonY = lemonadeStand.y - balloonHeight - pointerSize - 10;

    // Fundo branco com transparência e borda preta
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;

    // Desenha balão arredondado
    drawRoundedRect(balloonX, balloonY, balloonWidth, balloonHeight, 20);
    ctx.fill();
    ctx.stroke();

    // Desenha ponteiro (seta) apontando para a barraca
    ctx.beginPath();
    ctx.moveTo(balloonX + 50, balloonY + balloonHeight); // base da seta
    ctx.lineTo(balloonX + 70, balloonY + balloonHeight + pointerSize); // ponta da seta
    ctx.lineTo(balloonX + 90, balloonY + balloonHeight); // outra base
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Texto
    ctx.fillStyle = "black";
    ctx.font = "20px sans-serif";
    ctx.fillText("Aperte E para", balloonX + 40, balloonY + 45);
    ctx.fillText("Interagir", balloonX + 70, balloonY + 70);
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
    // Pig spawna na frente de casa
    pig.x = (canvas.width - pig.width) / 2;
    pig.y = sidewalkY;
    gameLoop();
    }
}

// Início
assets.background.onload = checkAllLoaded;
assets.pig.onload = checkAllLoaded;

// Primeiro mapa
loadMap('mapa-casa');

window.addEventListener("resize", resizeCanvas);
