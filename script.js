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

  let currentTurn = player2;

  const switchActivePlayer = () =>
    (currentTurn = currentTurn === player1 ? player2 : player1);

  const getActivePlayer = () => currentTurn;

  const playRound = (activePlayer, cellId) => {
    board.splice(cellId, 1, activePlayer.mark);
    if (
      gameBoard.checkWin(activePlayer.mark, board, activePlayer.playingAgainst)
    ) {
      activePlayer.addScore();
    }
  };

  return { getActivePlayer, playRound, switchActivePlayer };
}

function displayController() {
  const game = gameController();

  const mainBoard = document.querySelector('.main-board');
  // const mainTurn = document.querySelector('.main-turn');

  let board = gameBoard.createBoard();
  console.log(board);
  let cellCount = 0;

  for (let x of board) {
    // try reading the array with the symbols on it, abd then displaying it in the DOM.
    //this code should be used as a refresh dome, clicking the cell
    const cell = document.createElement('button');
    if (x === 'X') {
      console.log(cellCount);
    }
    cell.classList.add(`main-board-cell`);
    cell.id = cellCount;
    cell.innerText = ' ';
    mainBoard.appendChild(cell);
    cellCount++;
  }

  // read the dom, so now i a can put this in a function and in a for loop
  const currentBoardDom = document.querySelectorAll('.main-board-cell');
  let turn = 0;

  currentBoardDom.forEach((cell) => {
    cell.addEventListener('click', () => {
      const activePlayer = game.getActivePlayer();
      console.log(`clicked on cell: ` + cell.id);
      cell.innerText = activePlayer.mark;

      const currentBoardDom = document.querySelectorAll('.main-board-cell');
      const array = Array.from(currentBoardDom);
      board = array.map((x) => x.textContent);
      console.log(board);

      game.playRound(activePlayer, cell.id);

      game.switchActivePlayer();
      turn++;

      console.log(
        'score: ' + activePlayer.getScore() + ' ' + activePlayer.name
      );
    });
  });
}

displayController();

// game();
