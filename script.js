const gameBoard = (function () {
  const createBoard = () => [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];

  const checkWin = function (mark, currentBoard, markToRemove) {
    let win = false;
    const winningScenarios = [
      [' ', ' ', ' ', mark, mark, mark, ' ', ' ', ' '],
      [' ', ' ', mark, ' ', mark, ' ', mark, ' ', ' '],
      [mark, ' ', ' ', ' ', mark, ' ', ' ', ' ', mark],
      [mark, mark, mark, ' ', ' ', ' ', ' ', ' ', ' '],
      [mark, ' ', ' ', mark, ' ', ' ', mark, ' ', ' '],
      [' ', mark, ' ', ' ', mark, ' ', ' ', mark, ' '],
      [' ', ' ', mark, ' ', ' ', mark, ' ', ' ', mark],
      [' ', ' ', ' ', ' ', ' ', ' ', mark, mark, mark],
    ];

    let cleanBoard = currentBoard.map((element) => (element === markToRemove ? ' ' : element));

    for (scenario of winningScenarios) {
      if (scenario.join('') === cleanBoard.join('')) {
        win = true;
        break;
      } else {
        win = false;
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

function game() {
  const board = gameBoard.createBoard();
  console.log(board);

  const player1 = player(prompt('player one name?'), 1, 'X', 'O');
  console.log(player1);

  const player2 = player(prompt('player two name?'), 2, 'O', 'X');
  console.log(player2);

  let currentTurn = player2;

  for (let i = 0; i < 9; i++) {
    currentTurn = currentTurn === player1 ? player2 : player1;
    console.log(currentTurn);
    const indexForMark = prompt(`${currentTurn.name}, where to put the ${currentTurn.mark}?`);
    board.splice(indexForMark, 1, currentTurn.mark);
    console.log(board);
    console.log(i);
    if (gameBoard.checkWin(currentTurn.mark, board, currentTurn.playingAgainst)) {
      console.log(`${currentTurn.name} wins! point given!`);
      currentTurn.addScore();
      console.log(`${player1.name} score: ${player1.getScore()}`);
      console.log(`${player2.name} score: ${player2.getScore()}`);
      break;
    }
    if (i === 9) {
      console.log('tie');
    }
  }
}

// game();
