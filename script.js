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

function player(name, id) {
  let score = 0;
  const getScore = () => score;
  const addScore = () => score++;
  return { name, getScore, addScore, id };
}

function game() {
  const board = gameBoard.createBoard();
  console.log(board);

  const player1 = player(prompt('player one name?'), 1);
  console.log(player1);

  const player2 = player(prompt('player two name?'), 2);
  console.log(player2);

  for (let i = 0; i < 5; i++) {
    const indexForX = prompt(`${player1.name}, where to put the X?`);
    board.splice(indexForX, 1, 'X');
    console.log(board);
    if (gameBoard.checkWin('X', board, 'O')) {
      console.log(`${player1.name} wins!`);
    }

    const indexForO = prompt(`${player2.name}, where to put the O?`);
    board.splice(indexForO, 1, 'O');
    console.log(board);
    if (gameBoard.checkWin('O', board, 'X')) {
      console.log(`${player2.name} wins!`);
    }
  }
}

// game();
