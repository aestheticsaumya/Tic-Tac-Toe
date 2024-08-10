const board = document.getElementById('board');
const status = document.getElementById('status');
let currentPlayer = 'X';
let gameBoard = Array(9).fill(null);
let gameActive = true;

// Create the board
function createBoard() {
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleClick);
        board.appendChild(cell);
    }
}

// Handle cell click
function handleClick(event) {
    const index = event.target.dataset.index;

    if (!gameActive || gameBoard[index]) return;

    gameBoard[index] = currentPlayer;
    event.target.textContent = currentPlayer;
    event.target.classList.add(currentPlayer);
    event.target.style.transform = 'scale(1.1)';
    setTimeout(() => event.target.style.transform = 'scale(1)', 150);

    if (checkWinner()) {
        status.textContent = `${currentPlayer === 'X' ? 'You' : 'Computer'} win!`;
        gameActive = false;
    } else if (gameBoard.every(cell => cell)) {
        status.textContent = 'It\'s a draw!';
        gameActive = false;
    } else {
        currentPlayer = 'O';
        status.textContent = `Computer's Turn`;
        setTimeout(computerMove, 500);
    }
}

// Computer move
function computerMove() {
    let move = getBestMove();

    if (move === null) {
        const availableMoves = gameBoard
            .map((cell, index) => cell === null ? index : null)
            .filter(index => index !== null);
        move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    gameBoard[move] = 'O';
    const cell = document.querySelector(`.cell[data-index="${move}"]`);
    cell.textContent = 'O';
    cell.classList.add('O');
    cell.style.transform = 'scale(1.1)';
    setTimeout(() => cell.style.transform = 'scale(1)', 150);

    if (checkWinner()) {
        status.textContent = 'Computer wins!';
        gameActive = false;
    } else if (gameBoard.every(cell => cell)) {
        status.textContent = 'It\'s a draw!';
        gameActive = false;
    } else {
        currentPlayer = 'X';
        status.textContent = `Your Turn`;
    }
}

// Get the best move for the computer
function getBestMove() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === null) {
            return c;
        }
        if (gameBoard[b] && gameBoard[b] === gameBoard[c] && gameBoard[b] === null) {
            return a;
        }
        if (gameBoard[a] && gameBoard[a] === gameBoard[c] && gameBoard[a] === null) {
            return b;
        }
    }

    return null;
}

// Check for a winner
function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
    });
}

// Reset the game
function resetGame() {
    gameBoard.fill(null);
    Array.from(document.querySelectorAll('.cell')).forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('X', 'O');
        cell.style.transform = 'scale(1)';
    });
    currentPlayer = 'X';
    status.textContent = `Your Turn`;
    gameActive = true;
}

// Initialize the game
createBoard();