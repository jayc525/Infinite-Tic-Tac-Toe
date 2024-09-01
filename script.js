const board = document.getElementById('board');
const cells = Array.from(document.querySelectorAll('.cell'));
const statusDisplay = document.getElementById('status');
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popup-message');
const closePopup = document.getElementById('close-popup');

let currentPlayer = 'X';
let gameActive = true;
let gameState = Array(9).fill('');
let moveHistory = [];
let lastClickTime = 0;
const clickDelayThreshold = 200;
const clickSound = new Audio('click-sound.mp3');

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function handleCellClick(event) {
    const currentTime = Date.now();
    if (currentTime - lastClickTime < clickDelayThreshold) {
        alert('You are clicking too fast! Please slow down.');
        return;
    }

    lastClickTime = currentTime;
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] || !gameActive) {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer);
    moveHistory.push(clickedCellIndex);
    clickSound.play();

    checkResult();

    if (gameActive && moveHistory.length === 6) {
        fadeOutFirstMove();
        setTimeout(handleDrawAtSixthMove, 200);
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatusDisplay();
}

function checkResult() {
    const roundWon = winningConditions.some(condition => {
        const [a, b, c] = condition.map(index => gameState[index]);
        return a && a === b && a === c;
    });

    if (roundWon) {
        showPopup(`Player ${currentPlayer} wins!`);
        gameActive = false;
    } else if (!gameState.includes('') && moveHistory.length < 6) {
        statusDisplay.textContent = "It's a draw!";
        gameActive = false;
    }
}

function fadeOutFirstMove() {
    const firstMoveIndex = moveHistory[0];
    cells[firstMoveIndex].classList.add('fade-out');
}

function handleDrawAtSixthMove() {
    const firstMoveIndex = moveHistory.shift();
    gameState[firstMoveIndex] = '';
    const firstCell = cells[firstMoveIndex];
    firstCell.textContent = '';
    firstCell.classList.remove('X', 'O', 'fade-out');
}

function showPopup(message) {
    popupMessage.textContent = message;
    popup.classList.remove('hidden');
}

function hidePopup() {
    popup.classList.add('hidden');
}

function resetGame() {
    gameActive = true;
    currentPlayer = 'X';
    gameState.fill('');
    moveHistory = [];
    lastClickTime = 0;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('X', 'O', 'fade-out');
    });
    statusDisplay.textContent = '';
    updateStatusDisplay();
    hidePopup(); 
}

function updateStatusDisplay() {
    if (gameActive) {
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
    }
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
document.getElementById('reset').addEventListener('click', resetGame);
closePopup.addEventListener('click', hidePopup);

updateStatusDisplay();