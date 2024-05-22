document.addEventListener('DOMContentLoaded', () => {
    const board = Array(9).fill(null);
    const cells = document.querySelectorAll('.cell');
    const message = document.querySelector('.message');
    let isGameOver = false;
  
    const checkWinner = (board) => {
      const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
      ];
  
      for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return board[a];
        }
      }
  
      return board.includes(null) ? null : 'Draw';
    };
  
    const minimax = (newBoard, player) => {
      const availSpots = newBoard.map((cell, index) => cell === null ? index : null).filter(val => val !== null);
  
      const winner = checkWinner(newBoard);
      if (winner === 'X') {
        return { score: -10 };
      } else if (winner === 'O') {
        return { score: 10 };
      } else if (availSpots.length === 0) {
        return { score: 0 };
      }
  
      const moves = [];
      for (let i = 0; i < availSpots.length; i++) {
        const move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;
  
        if (player === 'O') {
          const result = minimax(newBoard, 'X');
          move.score = result.score;
        } else {
          const result = minimax(newBoard, 'O');
          move.score = result.score;
        }
  
        newBoard[availSpots[i]] = null;
        moves.push(move);
      }
  
      let bestMove;
      if (player === 'O') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
          if (moves[i].score > bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
          }
        }
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
          if (moves[i].score < bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
          }
        }
      }
  
      return moves[bestMove];
    };
  
    const handleClick = (e) => {
      const index = e.target.dataset.index;
      if (board[index] || isGameOver) return;
  
      board[index] = 'X';
      e.target.textContent = 'X';
  
      const winner = checkWinner(board);
      if (winner) {
        endGame(winner);
      } else {
        computerMove();
      }
    };
  
    const computerMove = () => {
      const bestSpot = minimax(board, 'O').index;
      board[bestSpot] = 'O';
      cells[bestSpot].textContent = 'O';
  
      const winner = checkWinner(board);
      if (winner) {
        endGame(winner);
      }
    };
  
    const endGame = (winner) => {
      isGameOver = true;
      if (winner === 'Draw') {
        message.textContent = 'Empate';
      } else {
        message.textContent = `Ganador: ${winner}`;
      }
    };
  
    cells.forEach(cell => cell.addEventListener('click', handleClick));
  });
  