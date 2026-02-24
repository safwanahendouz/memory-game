const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

// Items array
const items = [
    { name: "bee", image: "bee.png"},
    { name: "crocodile", image: "crocodile.png"},
    { name: "macaw", image: "macaw.png"},
    { name: "gorilla", image: "gorilla.png"},
    { name:"tiger", image: "tiger.png"},
    { name:"monkey", image: "monkey.png"},
    { name:"chameleon", image: "chameleon.png"},
    { name:"piranha", image: "piranha.png"},
    { name:"anaconda", image: "anaconda.png"},
    { name:"sloth", image: "sloth.png"},
    { name:"cockatoo", image: "cockatoo.png"},
    { name:"toucan", image: "toucan.png"},
];

// initial Time
let seconds = 0,
minutes = 0;

// Initial moves and win count
let movesCount = 0,
winCount = 0;

// For timer
const tomeGenerator = () => {
    seconds += 1;
    // minutes logic
    if(seconds>= 60) {
        minutes+= 1;
        seconds= 0;
    }
};

// format time before displaying
let secondsValue = seconds < 10 ? `0${seconds}` :
seconds;
let minutesValue = minutes < 10 ? `0${seconds}` :
minutes;
timeValue.innerHTML = `<span>Time:</span>$
{minutesValue}:${secondsValue}`;

// For calculating moves
const movesCounter = () => {
    movesCount+= 1;
    moves.innerHTML = `<span>Moves:</span>${movesCount}`;
}

// pick random objects from the items array
const generateRandom = (size = 4) => {
    // temporay array
    let tempArray =[...items];
    // initializes cardValues array
    let cardValues = [];
    // size should be double (4*4 matrix)/2 (with and height) since pairs of objects would selection
    size = (size*size)/2;
    // Random object selection
    for (let i=0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * tempArray.length);
        cardValues.push(tempArray[randomIndex]);
        // Once selected rmovethe object from temp
        tempArray.splice(randomIndex, 1);
    }
    return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
    gameContainer.innerHTML= "";
    cardValues = [...cardValues, ...cardValues];
    // simple shuffle
    cardValues.sort(() => Math.random() - 0.5);
    for (let i=0; i < size * size; i++) {
        // Create Cards
        // before => front side (contains Q mark)
        // after => back side (contains actal image)
        // data-card-values is a custom attribute which stores the names of the cards to match later
        gameContainer.innerHTML += `
        <div class="card-container" data-card-value="$
        {cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
        <img src="${cardValues[i].image}"
        class="image"/></div>
        </div>
        `;
    }
    // Grid ::
    gameContainer.computedStyleMap.gridTemplateColumns = `repeat($
    {size},auto)`;
};

// initialize values and func calls
const initializer = () => {
    result.innerHTML = "";
    winCount = 0;
    let cardValues = generateRandom();
    console.log(cardValues);
    matrixGenerator(cardValues);
};