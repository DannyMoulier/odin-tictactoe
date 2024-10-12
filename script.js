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
  const zeroScore = () => (score = 0);
  return { name, getScore, addScore, id, mark, playingAgainst, zeroScore };
}

function gameController() {
  // const player1 = player('Player 1', 1, 'X', 'O');
  // const player2 = player('player 2', 2, 'O', 'X');

  let player1;
  let player2;
  let currentTurn;

  const createPlayers = (p1SignChoice) => {
    let playingAgainst;
    if (p1SignChoice === 'X') {
      playingAgainst = 'O';
    } else {
      playingAgainst = 'X';
    }
    player1 = player('player 1', 1, p1SignChoice, playingAgainst);
    player2 = player('player 2', 1, playingAgainst, p1SignChoice);
    currentTurn = player1.mark === 'X' ? player1 : player2;
  };

  let board = gameBoard.createBoard();
  // let currentTurn = player1;

  let round = 0;

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
    round++;
    switchActivePlayer();
    let tie = false;
    if (win) {
      activePlayer.addScore();
      currentTurn = player1.mark === 'X' ? player1 : player2;
    } else if (round === 9) {
      tie = true;
      round = 0;
      currentTurn = player1.mark === 'X' ? player1 : player2;
    }

    return { win, updatedBoard: board, tie };
  };

  const resetBoard = () => {
    board = gameBoard.createBoard();
    round = 0;
    return board;
  };

  const getPlayer1 = () => player1;
  const getPlayer2 = () => player2;

  const endGame = () => {
    player1.zeroScore();
    player2.zeroScore();
  };

  return {
    createPlayers,
    getActivePlayer,
    playRound,
    switchActivePlayer,
    getBoard,
    isCellEmpty,
    resetBoard,
    getPlayer1,
    getPlayer2,
    endGame,
  };
}

function displayController() {
  const game = gameController();

  const resetGameDisplay = () => {
    mainBoard.innerHTML = '';
    const board = game.resetBoard();

    let cellCount = 0;
    for (let x of board) {
      const cell = document.createElement('button');
      cell.classList.add(`main-board-cell`);
      cell.id = cellCount;
      cell.innerText = ' ';
      mainBoard.appendChild(cell);
      cellCount++;
    }

    updateScores();

    resetBoardListener();
  };

  const updateScores = () => {
    player1Score.innerText = `player 1 score: ${game.getPlayer1().getScore()}`;
    player2Score.innerText = `player 2 score: ${game.getPlayer2().getScore()}`;
  };

  let mainBoard = document.querySelector('.main-board');
  const player1Score = document.querySelector('.main-players-player1');
  const player2Score = document.querySelector('.main-players-player2');

  const endGameDialog = document.querySelector('.end-game-modal');
  const endGameInfo = document.querySelector('.end-game-dialog-box-text');
  const quitButton = document.querySelector(
    '.end-game-dialog-box-controls-quit'
  );
  const continueButton = document.querySelector(
    '.end-game-dialog-box-controls-continue'
  );

  const startGameDialog = document.querySelector('.start-game-modal');
  const startGameButton = document.querySelector(
    '.start-game-dialog-box-controls-start'
  );

  const resetBoardListener = () => {
    const currentBoardDom = document.querySelectorAll('.main-board-cell');

    currentBoardDom.forEach((cell) => {
      cell.addEventListener('click', () => {
        const activePlayer = game.getActivePlayer();

        if (!game.isCellEmpty(cell.id)) {
          return;
        }

        let result = game.playRound(activePlayer, cell.id);
        const updatedBoard = result.updatedBoard;

        updatedBoard.forEach((mark, index) => {
          currentBoardDom[index].innerText = mark;
        });

        if (result.win) {
          currentBoardDom.forEach((cell) => {
            cell.disabled = true;
          });

          endGameInfo.innerText = `${activePlayer.name} wins!`;

          setTimeout(() => {
            endGameDialog.showModal();
          }, 1000);
        } else if (result.tie) {
          currentBoardDom.forEach((cell) => {
            cell.disabled = true;
          });

          endGameInfo.innerText = `its a tie!`;

          setTimeout(() => {
            endGameDialog.showModal();
          }, 1000);
        }

        updateScores();
      });
    });
  };

  startGameDialog.showModal();
  startGameButton.addEventListener('click', () => {
    const player1ChoiceX = document.getElementById('X');
    const player1ChoiceO = document.getElementById('O');

    if (player1ChoiceO.checked === true) {
      game.createPlayers('O');
    } else if (player1ChoiceX.checked === true) {
      game.createPlayers('X');
    }

    resetGameDisplay();
    startGameDialog.close();
  });

  quitButton.addEventListener('click', () => {
    game.endGame();
    updateScores();
    mainBoard.innerHTML = '';
    player1Score.innerHTML = '';
    player2Score.innerHTML = '';

    endGameDialog.close();
    startGameDialog.showModal();
  });

  continueButton.addEventListener('click', () => {
    endGameDialog.close();
    resetGameDisplay();
  });
}

displayController();
