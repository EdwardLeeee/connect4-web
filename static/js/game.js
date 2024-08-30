const ROW_COUNT = 6;
const COLUMN_COUNT = 7;
const PLAYER1 = 1;
const PLAYER2 = 2;

let board = createBoard();
let currentPlayer = PLAYER1;
let gameOver = false;

function createBoard() {
    const board = [];
    for (let r = 0; r < ROW_COUNT; r++) {
        board.push(new Array(COLUMN_COUNT).fill(0));
    }
    return board;
}

function drawBoard(board) {
    const boardElement = document.querySelector('.game-board');
    boardElement.innerHTML = '';

    for (let r = 0; r < ROW_COUNT; r++) {
        for (let c = 0; c < COLUMN_COUNT; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            const piece = document.createElement('div');
            piece.classList.add('piece');

            if (board[r][c] === PLAYER1) {
                piece.classList.add('player1');
            } else if (board[r][c] === PLAYER2) {
                piece.classList.add('player2');
            }

            cell.appendChild(piece);
            cell.addEventListener('click', () => handleClick(c));
            boardElement.appendChild(cell);
        }
    }
}

function isValidLocation(board, col) {
    return board[ROW_COUNT - 1][col] === 0;
}

function getNextOpenRow(board, col) {
    for (let r = 0; r < ROW_COUNT; r++) {
        if (board[r][col] === 0) {
            return r;
        }
    }
}

function dropPiece(board, row, col, piece) {
    board[row][col] = piece;
}

function winningMove(board, piece) {
    // 检查水平
    for (let c = 0; c < COLUMN_COUNT - 3; c++) {
        for (let r = 0; r < ROW_COUNT; r++) {
            if (
                board[r][c] === piece &&
                board[r][c + 1] === piece &&
                board[r][c + 2] === piece &&
                board[r][c + 3] === piece
            ) {
                return [[r, c], [r, c + 1], [r, c + 2], [r, c + 3]];
            }
        }
    }

    // 检查垂直
    for (let c = 0; c < COLUMN_COUNT; c++) {
        for (let r = 0; r < ROW_COUNT - 3; r++) {
            if (
                board[r][c] === piece &&
                board[r + 1][c] === piece &&
                board[r + 2][c] === piece &&
                board[r + 3][c] === piece
            ) {
                return [[r, c], [r + 1, c], [r + 2, c], [r + 3, c]];
            }
        }
    }

    // 检查斜线（从左下到右上）
    for (let c = 0; c < COLUMN_COUNT - 3; c++) {
        for (let r = 0; r < ROW_COUNT - 3; r++) {
            if (
                board[r][c] === piece &&
                board[r + 1][c + 1] === piece &&
                board[r + 2][c + 2] === piece &&
                board[r + 3][c + 3] === piece
            ) {
                return [[r, c], [r + 1, c + 1], [r + 2, c + 2], [r + 3, c + 3]];
            }
        }
    }

    // 检查斜线（从左上到右下）
    for (let c = 0; c < COLUMN_COUNT - 3; c++) {
        for (let r = 3; r < ROW_COUNT; r++) {
            if (
                board[r][c] === piece &&
                board[r - 1][c + 1] === piece &&
                board[r - 2][c + 2] === piece &&
                board[r - 3][c + 3] === piece
            ) {
                return [[r, c], [r - 1, c + 1], [r - 2, c + 2], [r - 3, c + 3]];
            }
        }
    }

    return null;
}


function handleClick(col) {
    if (gameOver) return;

    for (let row = ROW_COUNT - 1; row >= 0; row--) {
        if (board[row][col] === 0) {
            dropPiece(board, row, col, currentPlayer);

            const winningCoordinates = winningMove(board, currentPlayer);
            if (winningCoordinates) {
                drawBoard(board);

                // 在获胜的棋子上打X
                for (const [r, c] of winningCoordinates) {
                    const cell = document.querySelector(`.game-board .cell:nth-child(${r * COLUMN_COUNT + c + 1})`);
                    const piece = cell.querySelector('.piece');
                    const xMark = document.createElement('div');
                    xMark.classList.add('x-mark');
                    xMark.textContent = 'X';
                    piece.appendChild(xMark);
                }

                gameOver = true;

                setTimeout(() => {
                    alert(`Player ${currentPlayer} wins!`);
                }, 500); // 延迟显示胜利提示，以便先显示 X 标记
            } else {
                currentPlayer = currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1;
                drawBoard(board);
            }
            break;
        }
    }
}

document.getElementById('restart-button').addEventListener('click', () => {
    board = createBoard();
    currentPlayer = PLAYER1;
    gameOver = false;
    drawBoard(board);
});

drawBoard(board);
