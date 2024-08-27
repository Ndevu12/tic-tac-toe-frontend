import confetti from 'canvas-confetti';

function triggerConfetti() {
	confetti ({
		particleCount: 100,
		spread: 70,
		origin: { y: 0.6}
	});
}

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let isSinglePlayer = false;

const cells = document.querySelectorAll('.cell');
const statusMessage = document.querySelector('.status-message');

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function handleCellClick(clickedCell, index) {
  if (board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;
  clickedCell.classList.add(currentPlayer.toLowerCase());
  clickedCell.innerText = currentPlayer;

  checkResult();

  if (isSinglePlayer && gameActive && currentPlayer === "X") {
    setTimeout(handleComputerMove, 500);
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  }
}

function handleComputerMove() {
  let availableCells = board.map((val, index) => (val === "" ? index : null)).filter(val => val !== null);
  let randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
  const cell = document.querySelector(`[data-index='${randomIndex}']`);
  
  board[randomIndex] = "O";
  cell.classList.add("o");
  cell.innerText = "O";

  checkResult();
  currentPlayer = "X";
}

function checkResult() {
  let roundWon = false;

  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (board[a] === board[b] && board[a] === board[c] && board[a] !== "") {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusMessage.innerText = `🎉 Player ${currentPlayer} has won! 🎉`;
    triggerConfetti();
    gameActive = false;
    return;
  }

  let roundDraw = !board.includes("");
  if (roundDraw) {
    statusMessage.innerText = "It's a draw!";
    gameActive = false;
    return;
  }
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  cells.forEach(cell => {
    cell.innerText = "";
    cell.classList.remove("x", "o");
  });
  statusMessage.innerText = "New game started!";
}

function startGame(mode) {
  isSinglePlayer = mode === "single";
  resetGame();
}

cells.forEach((cell, index) => {
  cell.addEventListener('click', () => handleCellClick(cell, index));
});
