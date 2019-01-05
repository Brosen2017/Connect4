
    function handleVertical(board) {
        for (let r = 3; r < 6; r++) {
          for (let c = 0; c < 7; c++) {
            if (board[r][c]) {
              if (board[r][c] === board[r - 1][c] && board[r][c] === board[r - 2][c] && board[r][c] === board[r - 3][c]) {
                return board[r][c];    
              }
            }
          }
        }
      }
  
  
    function handleHorizontal(board) {
        for (let r = 0; r < 6; r++) {
          for (let c = 0; c < 4; c++) {
            if (board[r][c]) {
              if (board[r][c] === board[r][c + 1] && board[r][c] === board[r][c + 2] && board[r][c] === board[r][c + 3]) {
                return board[r][c];
              }
            }
          }
        }
      }
  
  
    function handleDiagonalRight(board) {
        for (let r = 3; r < 6; r++) {
          for (let c = 0; c < 4; c++) {
            if (board[r][c]) {
              if (board[r][c] === board[r - 1][c + 1] && board[r][c] === board[r - 2][c + 2] && board[r][c] === board[r - 3][c + 3]) {
                return board[r][c];
              }
            }
          }
        }
      }
  
  
    function handleDiagonalLeft(board) {
        for (let r = 3; r < 6; r++) {
          for (let c = 3; c < 7; c++) {
            if (board[r][c]) {
              if (board[r][c] === board[r - 1][c - 1] && board[r][c] === board[r - 2][c - 2] && board[r][c] === board[r - 3][c - 3]) {
                return board[r][c];
              }
            }
          }
        }
      }
  
    function handleDraw(board) {
        for (let r = 0; r < 6; r++) {
          for (let c = 0; c < 7; c++) {
            if (board[r][c] === null) {
              return null;
            }
          }
        }
        return 'draw';    
      }

export {handleVertical, handleHorizontal, handleDiagonalLeft, handleDiagonalRight, handleDraw}