const gameBoard = (function () {
  const createBoard = () => [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];

  const checkWin = function (mark, currentBoard, markToRemove) {
    let win = false;
    const winningScenarios = [
      [3, 4, 5],
      [2, 4, 6],
      [0, 4, 8],
      [0, 1, 2],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [6, 7, 8],
    ];

    let cleanBoard = currentBoard.map((element) =>
      element === markToRemove ? ' ' : element
    );

    for (let scenario of winningScenarios) {
      let count = 0;
      for (let index of scenario) {
        if (cleanBoard[index] === mark) {
          count++;
        }
      }
      if (count === 3) {
        win = true;
        break;
      }
    }

    return win;
  };

  return { createBoard, checkWin };
})();

function player(name, id, mark, playingAgainst) {
  let score = 0;
  const getScore = () => score;
  const addScore = () => score++;
  return { name, getScore, addScore, id, mark, playingAgainst };
}

function gameController() {
  const board = gameBoard.createBoard();
  const player1 = player('Player 1', 1, 'X', 'O');
  const player2 = player('player 2', 2, 'O', 'X');

  let currentTurn = player1;

  const switchActivePlayer = () =>
    (currentTurn = currentTurn === player1 ? player2 : player1);

  const getActivePlayer = () => currentTurn;

  const getBoard = () => board;
  const isCellEmpty = (cellId) => board[cellId] === ' ';

  const playRound = (activePlayer, cellId) => {
    board.splice(cellId, 1, activePlayer.mark);
    let win = gameBoard.checkWin(
      activePlayer.mark,
      board,
      activePlayer.playingAgainst
    );
    if (win) {
      activePlayer.addScore();
    }
    switchActivePlayer();
    return { win, updatedBoard: board };
  };

  return {
    getActivePlayer,
    playRound,
    switchActivePlayer,
    getBoard,
    isCellEmpty,
  };
}

function displayController() {
  const game = gameController();

  const mainBoard = document.querySelector('.main-board');

  let board = gameBoard.createBoard();
  let cellCount = 0;

  for (let x of board) {
    const cell = document.createElement('button');
    cell.classList.add(`main-board-cell`);
    cell.id = cellCount;
    cell.innerText = ' ';
    mainBoard.appendChild(cell);
    cellCount++;
  }

  const currentBoardDom = document.querySelectorAll('.main-board-cell');
  const infoScreen = document.querySelector('.main-info');
  let turn = 0;

  currentBoardDom.forEach((cell) => {
    cell.addEventListener('click', () => {
      const activePlayer = game.getActivePlayer();

      if (!game.isCellEmpty(cell.id)) {
        return;
      }

      const result = game.playRound(activePlayer, cell.id);

      const updatedBoard = result.updatedBoard;
      updatedBoard.forEach((mark, index) => {
        currentBoardDom[index].innerText = mark;
      });

      if (result.win) {
        infoScreen.innerText = `${activePlayer.name} wins!`;
      }
    });
  });
}

displayController();

// game();
