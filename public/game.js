const playerDisplay = document.getElementById("player-turn");
const newGameButton = document.getElementById("new-game-button");
const currentPlayerArea = document.getElementById("current-player");
const gameBoard = document.getElementById("board");
const toggleNPC = document.getElementById("toggleNPC");

let isPlayerXTurn = true;
let gameActive = true;
let playAgainstComputer = false;
let gameState = ["", "", "", "", "", "", "", "", ""];
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// player symbols
const xSymbol = `<i class="bi bi-x-lg" style="color: #ffa02e"></i>`;
const oSymbol = `<i class="bi bi-circle" style="color: #62fffc"></i>`;


// start a new game
// this resets everything to "normal"
newGame();

// Event listeners
newGameButton.addEventListener("click", newGame);
const cellElements = document.querySelectorAll('.grid-container div');
cellElements.forEach(cell => {
    cell.addEventListener('click', handleCellClick)
});
toggleNPC.addEventListener("click", setNPC);

// Activate Computer Player, based on user's choice
function setNPC() {
    if (toggleNPC.checked) {
        playAgainstComputer = true;
    } else {
        playAgainstComputer = false;
    }
}

// newGame Function
function newGame() {
    // gameBoard.style.opacity = 1;
    currentPlayerArea.style.visibility = "visible";

    gameState = ["", "", "", "", "", "", "", "", ""];
    isPlayerXTurn = true;
    gameActive = true;

    document.querySelectorAll('.grid-container div').forEach(cell => {
        cell.innerHTML = "";
    });

    const x = document.getElementById("player-x-turn");
    const o = document.getElementById("player-o-turn");
    x.classList.add("green-bg-highlight")
    o.classList.remove("green-bg-highlight")

}


function handleCellClick(e) {

    // if the game is over (tie or win), the player should not be able to do anything
    if (!gameActive) return;

    // if the current cell is already filled, don't let the player do anything with the cell
    if (e.currentTarget.innerHTML !== "") {
        shake(document.getElementById(e.currentTarget.id), 6);
        // updateDisplay(errorDisplay, "Field already taken!")
        return;
    }

    // depending on the player, fill the chosen cell with the corresponding icon
    if (isPlayerXTurn) {
        e.currentTarget.innerHTML = xSymbol;
    } else {
        e.currentTarget.innerHTML = oSymbol;
    }

    // fill the gameState array with the current player tag
    // depending on which cell was clicked, fill the corresponding index + 1
    const clickedCellID = parseInt(e.currentTarget.id);
    if (isPlayerXTurn) {
        gameState[clickedCellID - 1] = "X";
    } else {
        gameState[clickedCellID - 1] = "O";
    }

    // check the state of the game (win, tie)
    if (handleResultValidation()) return;

    nextTurn();

    if (playAgainstComputer) {
        npc();
    }
}

function nextTurn() {
    isPlayerXTurn = !isPlayerXTurn;
    const x = document.getElementById("player-x-turn");
    const o = document.getElementById("player-o-turn");
    if (isPlayerXTurn) {
        x.classList.add("green-bg-highlight")
        o.classList.remove("green-bg-highlight")
    } else {
        o.classList.add("green-bg-highlight");
        x.classList.remove("green-bg-highlight");
    }
}

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningCombinations[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        // if one of the elements is empty, continue with the next iteration of the loop
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            gameActive = false;
            currentPlayerArea.style.visibility = "hidden";

            // confetti animation
            confetti({
                particleCount: 150,
                spread: 180,
                zIndex: 9000,
            });

            // popup saying who won
            popMessage(`Player ${isPlayerXTurn ? "X" : "O"} has won the game.`);

            // if the round is won, break out of the loop
            break;
        }
    }
    if (gameState.indexOf("") === -1 && !roundWon) {
        currentPlayerArea.style.visibility = "hidden";
        popMessage("Tie.")
    }

    return roundWon;
}

function popMessage(text) {
    Swal.fire({
        title: text,
        backdrop: true,
        color: "white",
        heightAuto: false,
        background: "#222",
        confirmButtonText: "New Game",
        showCancelButton: true,
    }).then(result => {
        if (result.isConfirmed) newGame();
    });
}

function npc() {
    const emptyCells = []

    for (const n of document.querySelectorAll('.grid-container div')) {
        if (n.innerHTML === "") {
            emptyCells.push(n.id)
        }
    }

    const rnd = Math.floor(Math.random() * emptyCells.length);


    clickedCellID = parseInt(emptyCells[rnd]);

    if (isPlayerXTurn) {
        gameState[clickedCellID - 1] = "X";
    } else {
        gameState[clickedCellID - 1] = "O";
    }



    if (isPlayerXTurn) {
        document.getElementById(clickedCellID).innerHTML = xSymbol;
    } else {
        document.getElementById(clickedCellID).innerHTML = oSymbol;
    }


    handleResultValidation();
    nextTurn();
}