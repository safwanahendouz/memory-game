// === DOM References ===
const movesEl = document.getElementById("moves-count");
const timeEl = document.getElementById("time");
const pairsEl = document.getElementById("pairs-count");
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const gameContainer = document.getElementById("game-container");
const resultEl = document.getElementById("result");
const modal = document.getElementById("modal");
const modalStats = document.getElementById("modal-stats");
const playAgainBtn = document.getElementById("play-again");
const sizeBtns = document.querySelectorAll(".size-btn");

// === Animal Data (emoji-based, no images needed) ===
const animals = [
    { name: "Bee",       emoji: "🐝" },
    { name: "Croc",      emoji: "🐊" },
    { name: "Macaw",     emoji: "🦜" },
    { name: "Gorilla",   emoji: "🦍" },
    { name: "Tiger",     emoji: "🐯" },
    { name: "Monkey",    emoji: "🐒" },
    { name: "Chameleon", emoji: "🦎" },
    { name: "Piranha",   emoji: "🐟" },
    { name: "Snake",     emoji: "🐍" },
    { name: "Sloth",     emoji: "🦥" },
    { name: "Cockatoo",  emoji: "🦚" },
    { name: "Toucan",    emoji: "🦅" },
    { name: "Frog",      emoji: "🐸" },
    { name: "Parrot",    emoji: "🦩" },
    { name: "Panther",   emoji: "🐆" },
    { name: "Elephant",  emoji: "🐘" },
    { name: "Hippo",     emoji: "🦛" },
    { name: "Flamingo",  emoji: "🦢" },
];

// === State ===
let gridSize = 4;
let seconds = 0, minutes = 0;
let movesCount = 0, winCount = 0, totalPairs = 0;
let interval = null;
let firstCard = null, secondCard = null;
let lockBoard = false;
let gameActive = false;

// === Timer ===
function tickTimer() {
    seconds++;
    if (seconds >= 60) { minutes++; seconds = 0; }
    const ss = String(seconds).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    timeEl.textContent = `${mm}:${ss}`;
}

function startTimer() {
    clearInterval(interval);
    seconds = 0; minutes = 0;
    timeEl.textContent = "00:00";
    interval = setInterval(tickTimer, 1000);
}

function stopTimer() {
    clearInterval(interval);
    interval = null;
}

// === Random card selection ===
function generateRandom(size) {
    const needed = (size * size) / 2;
    const shuffled = [...animals].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, needed);
}

// === Build the grid ===
function buildGrid(size) {
    const pairs = generateRandom(size);
    totalPairs = pairs.length;
    winCount = 0;
    pairsEl.textContent = `Pairs: 0/${totalPairs}`;

    let deck = [...pairs, ...pairs].sort(() => Math.random() - 0.5);

    gameContainer.innerHTML = "";
    // Card size adapts to grid
    const cardPx = size === 4 ? "calc(min(17vw, 110px))" : "calc(min(11vw, 80px))";
    gameContainer.style.gridTemplateColumns = `repeat(${size}, ${cardPx})`;

    deck.forEach((animal) => {
        const card = document.createElement("div");
        card.className = "card-container";
        card.dataset.value = animal.name;
        card.style.width = cardPx;
        card.style.height = cardPx;

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-before"></div>
                <div class="card-after">
                    <span class="card-emoji">${animal.emoji}</span>
                    <span class="card-label">${animal.name}</span>
                </div>
            </div>`;

        card.addEventListener("click", onCardClick);
        gameContainer.appendChild(card);
    });
}

// === Card click logic ===
function onCardClick(e) {
    if (!gameActive || lockBoard) return;
    const card = e.currentTarget;
    if (card.classList.contains("flipped") || card.classList.contains("matched")) return;

    card.classList.add("flipped");

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    movesCount++;
    movesEl.textContent = `Moves: ${movesCount}`;

    checkMatch();
}

function checkMatch() {
    const isMatch = firstCard.dataset.value === secondCard.dataset.value;
    if (isMatch) {
        winCount++;
        pairsEl.textContent = `Pairs: ${winCount}/${totalPairs}`;
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        resultEl.textContent = winCount === totalPairs ? "" : `✅ Match! Keep going!`;
        resetPick();
        if (winCount === totalPairs) setTimeout(onWin, 500);
    } else {
        lockBoard = true;
        resultEl.textContent = "❌ No match, try again!";
        const a = firstCard, b = secondCard;
        a.classList.add("wrong");
        b.classList.add("wrong");
        setTimeout(() => {
            a.classList.remove("flipped", "wrong");
            b.classList.remove("flipped", "wrong");
            resetPick();
        }, 900);
    }
}

function resetPick() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

// === Win ===
function onWin() {
    stopTimer();
    gameActive = false;
    stopBtn.classList.add("hide");
    startBtn.classList.remove("hide");

    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    modalStats.innerHTML = `⏱ Time: <strong>${mm}:${ss}</strong> &nbsp;|&nbsp; 👣 Moves: <strong>${movesCount}</strong>`;
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    spawnConfetti();
}

// === Confetti ===
function spawnConfetti() {
    const colors = ["#f4c531","#4caf50","#ff6b6b","#61dafb","#ffffff","#ff9800"];
    for (let i = 0; i < 70; i++) {
        const el = document.createElement("div");
        el.className = "confetti";
        el.style.setProperty("--dur", `${1.5 + Math.random() * 2}s`);
        el.style.setProperty("--delay", `${Math.random() * 0.8}s`);
        el.style.left = `${Math.random() * 100}vw`;
        el.style.top = "0";
        el.style.background = colors[Math.floor(Math.random() * colors.length)];
        el.style.width = `${6 + Math.random() * 6}px`;
        el.style.height = `${6 + Math.random() * 6}px`;
        document.body.appendChild(el);
        el.addEventListener("animationend", () => el.remove());
    }
}

// === Initialize / Start ===
function startGame() {
    movesCount = 0;
    movesEl.textContent = "Moves: 0";
    resultEl.textContent = "";
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    gameActive = true;

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");

    buildGrid(gridSize);
    startTimer();

    startBtn.classList.add("hide");
    stopBtn.classList.remove("hide");
}

function stopGame() {
    stopTimer();
    gameActive = false;
    resultEl.textContent = "Game stopped. Ready when you are!";
    startBtn.classList.remove("hide");
    stopBtn.classList.add("hide");
    gameContainer.innerHTML = "";
    timeEl.textContent = "00:00";
    movesEl.textContent = "Moves: 0";
    pairsEl.textContent = "Pairs: 0/8";
}

// === Event Listeners ===
startBtn.addEventListener("click", startGame);
stopBtn.addEventListener("click", stopGame);
playAgainBtn.addEventListener("click", startGame);

sizeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        sizeBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        gridSize = parseInt(btn.dataset.size);
        if (gameActive) startGame();
    });
});