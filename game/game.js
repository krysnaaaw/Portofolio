const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restartBtn");
const scoreBoard = document.getElementById("scoreboard");
const highScoreBoard = document.getElementById("highscoreboard");
const coinDisplay = document.getElementById("coinDisplay");
const gameOverText = document.getElementById("gameOverText");
const finalScoreText = document.getElementById("finalScore");
const startHint = document.getElementById("startHint");
const shopBtn = document.getElementById("shopBtn");
const shopPanel = document.getElementById("shopPanel");
const birdListDiv = document.getElementById("birdList");
const closeShopBtn = document.getElementById("closeShopBtn");

// --- Game Variables ---
let birdY, birdVelocity, pipes, frame, score, gameOver, gameStarted;
let highScore = parseInt(localStorage.getItem("flappyHighScore")) || 0;
const gravity = 0.5;
const jump = -8;
let birdRadius;
const pipeWidth = 60;
const pipeGap = 150;
let coins = parseInt(localStorage.getItem("flappyCoins")) || 100;
let coinsOnScreen = [];
const coinRadius = 12;

// --- Bird & Shop ---
const birdShopItems = [
  { id: "char1", name: "Red Bird", price: 0, imgPath: "burung/char1/frame-1.png" },
  { id: "char2", name: "Yellow Bird", price: 50, imgPath: "burung/char2/frame-1.png" },
  { id: "char3", name: "Square Bird", price: 80, imgPath: "burung/char3/frame-1.png" },
  { id: "char4", name: "Fat Bird", price: 100, imgPath: "burung/char4/frame-1.png" },
  { id: "char5", name: "Bat Bird", price: 150, imgPath: "burung/char5/frame-1.png" },
  { id: "char6", name: "Horner Bird", price: 200, imgPath: "burung/char6/frame-1.png" },
  { id: "char7", name: "Crow Bird", price: 250, imgPath: "burung/char7/frame-1.png" },
  { id: "char8", name: "Dragon Bird", price: 300, imgPath: "burung/char8/frame-1.png" },
];

let ownedBirds = JSON.parse(localStorage.getItem("ownedBirds")) || ["char1"];
let selectedBirdId = localStorage.getItem("selectedBirdId") || "char1";

let birdImages = [];
let birdFrame = 0;

// --- Sound Effects ---
const jumpSound = new Audio("sound/jump.wav");
const coinSound = new Audio("sound/coin.mp3");
const hitSound = new Audio("sound/hit.mp3");
jumpSound.volume = 0.5;
coinSound.volume = 0.5;
hitSound.volume = 0.7;

// --- Resize Canvas ---
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  birdRadius = Math.max(20, Math.min(canvas.width, canvas.height) * 0.035); // Ukuran burung diperbesar
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// --- Load Bird Images ---
function loadBirdImages(birdId) {
  birdImages = [];
  let i = 1;
  function loadNextFrame() {
    const img = new Image();
    img.src = `burung/${birdId}/frame-${i}.png`;
    img.onload = () => {
      birdImages.push(img);
      i++;
      loadNextFrame();
    };
    img.onerror = () => {
      birdFrame = 0;
      initGame();
    };
  }
  loadNextFrame();
}

// --- Init Game ---
function initGame() {
  birdY = canvas.height / 2;
  birdVelocity = 0;
  pipes = [];
  coinsOnScreen = [];
  frame = 0;
  score = 0;
  gameOver = false;
  gameStarted = false;
  restartBtn.style.display = "none";
  gameOverText.style.display = "none";
  finalScoreText.style.display = "none";
  startHint.style.display = "block";
  scoreBoard.textContent = "Score: 0";
  highScoreBoard.textContent = `High Score: ${highScore}`;
  updateCoinDisplay();
  drawBackground();
  drawBird();
  renderShopItems();
}

function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    startHint.style.display = "none";
    update();
  }
}

function drawBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawBird() {
  if (birdImages.length > 0) {
    const img = birdImages[birdFrame];
    ctx.drawImage(img, 80 - birdRadius, birdY - birdRadius, birdRadius * 2, birdRadius * 2);
  } else {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(80, birdY, birdRadius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPipes() {
  ctx.fillStyle = "#4caf50";
  ctx.strokeStyle = "#388e3c";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.strokeRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height);
    ctx.strokeRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height);
  });
}

function updatePipes() {
  if (frame % 90 === 0) {
    let top = Math.random() * (canvas.height - pipeGap - 150) + 50;
    pipes.push({ x: canvas.width, top, passed: false });
  }
  pipes.forEach(pipe => {
    pipe.x -= 5;
    if (
      80 + birdRadius > pipe.x &&
      80 - birdRadius < pipe.x + pipeWidth &&
      (birdY - birdRadius < pipe.top || birdY + birdRadius > pipe.top + pipeGap)
    ) {
      gameOver = true;
      hitSound.play();
    }
    if (!pipe.passed && pipe.x + pipeWidth < 80 - birdRadius) {
      pipe.passed = true;
      score++;
    }
  });
  pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
}

function drawCoins() {
  coinsOnScreen.forEach(coin => {
    ctx.beginPath();
    ctx.fillStyle = "gold";
    ctx.shadowColor = "orange";
    ctx.shadowBlur = 10;
    ctx.arc(coin.x, coin.y, coinRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "darkgoldenrod";
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

function updateCoins() {
  if (frame % 90 === 0) {
    const lastPipe = pipes[pipes.length - 1];
    if (lastPipe) {
      const coinX = lastPipe.x + pipeWidth / 2;
      const coinY = lastPipe.top + pipeGap / 2;
      coinsOnScreen.push({ x: coinX, y: coinY });
    }
  }
  coinsOnScreen.forEach((coin, i) => {
    coin.x -= 5;
    const distX = Math.abs(coin.x - 80);
    const distY = Math.abs(coin.y - birdY);
    const dist = Math.sqrt(distX * distX + distY * distY);
    if (dist < coinRadius + birdRadius) {
      coinSound.play();
      coins++;
      localStorage.setItem("flappyCoins", coins);
      updateCoinDisplay();
      coinsOnScreen.splice(i, 1);
    }
  });
  coinsOnScreen = coinsOnScreen.filter(coin => coin.x + coinRadius > 0);
}

function updateCoinDisplay() {
  if (coinDisplay) {
    coinDisplay.textContent = `Coins: ${coins}`;
  }
}

function update() {
  if (gameOver) {
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("flappyHighScore", highScore);
    }
    gameOverText.style.display = "block";
    finalScoreText.style.display = "block";
    finalScoreText.innerHTML = `Your Score: ${score} <br> High Score: ${highScore}`;
    restartBtn.style.display = "block";
    gameStarted = false;
    return;
  }
  frame++;
  if (gameStarted) {
    birdVelocity += gravity;
    birdY += birdVelocity;
    updatePipes();
    updateCoins();
  }
  if (birdY + birdRadius > canvas.height || birdY - birdRadius < 0) {
    gameOver = true;
    hitSound.play();
  }
  drawBackground();
  if (frame % 5 === 0) {
    birdFrame = (birdFrame + 1) % birdImages.length;
  }
  drawBird();
  drawPipes();
  drawCoins();
  scoreBoard.textContent = `Score: ${score}`;
  highScoreBoard.textContent = `High Score: ${highScore}`;
  requestAnimationFrame(update);
}

function renderShopItems() {
  birdListDiv.innerHTML = "";
  birdShopItems.forEach(item => {
    const owned = ownedBirds.includes(item.id);
    const isSelected = selectedBirdId === item.id;
    const birdDiv = document.createElement("div");
    const img = document.createElement("img");
    img.src = item.imgPath;
    if (isSelected) img.classList.add("selected");
    birdDiv.appendChild(img);
    const nameDiv = document.createElement("div");
    nameDiv.textContent = item.name;
    birdDiv.appendChild(nameDiv);
    const btn = document.createElement("button");
    if (owned) {
      btn.textContent = isSelected ? "Selected" : "Select";
      btn.disabled = isSelected;
      btn.addEventListener("click", () => {
        selectedBirdId = item.id;
        localStorage.setItem("selectedBirdId", selectedBirdId);
        loadBirdImages(selectedBirdId);
        renderShopItems();
      });
    } else {
      btn.textContent = `Buy (${item.price} coins)`;
      btn.disabled = coins < item.price;
      btn.addEventListener("click", () => {
        if (coins >= item.price) {
          coins -= item.price;
          ownedBirds.push(item.id);
          localStorage.setItem("ownedBirds", JSON.stringify(ownedBirds));
          localStorage.setItem("flappyCoins", coins);
          updateCoinDisplay();
          renderShopItems();
        }
      });
    }
    birdDiv.appendChild(btn);
    birdListDiv.appendChild(birdDiv);
  });
}

restartBtn.addEventListener("click", () => {
  loadBirdImages(selectedBirdId);
});

shopBtn.addEventListener("click", () => {
  shopPanel.style.display = "block";
});

closeShopBtn.addEventListener("click", () => {
  shopPanel.style.display = "none";
});

window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    if (!gameStarted && !gameOver) {
      startGame();
    }
    birdVelocity = jump;
    jumpSound.play();
  }
});

loadBirdImages(selectedBirdId);
