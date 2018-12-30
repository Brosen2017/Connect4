import React from 'react';
import Board from './Board.jsx';
import styles from '../styles/Game.css';

class Game extends React.Component{
    constructor(props){
        super(props);
        this.state={
            player1: 1,
            player2: 2,
            board:[],
            currentPlayer: null,
            gameOver: false,
            message: ''

        }
        this.playGame = this.playGame.bind(this)
    }

    createBoard(){
        let board = [];
        for(var r = 0; r < 6; r++){
            let row =[];
            for(var c =0; c < 7; c++){
                row.push(null);
            }
            board.push(row);
        }
        this.setState({
            board: board
        })
        console.log(this.state.board)
    }


    togglePlayer() {
              return (this.state.currentPlayer === this.state.player1) ? this.state.player2 : this.state.player1;
            }

    //core gameplay functionality and board check implementation
    playGame(c) {
            console.log('Ive been clicked', this.state.board)
      if (!this.state.gameOver) {
        let board = this.state.board;
        for (let r = 5; r >= 0; r--) {
          if (!board[r][c]) {
            board[r][c] = this.state.currentPlayer;
            break;
          }
        }
        let result = this.checkAll(board);
        if (result === this.state.player1) {
          this.setState({ board, gameOver: true, message: 'Red wins!' });
        } else if (result === this.state.player2) {
          this.setState({ board, gameOver: true, message: 'Blue wins!' });
        } else if (result === 'draw') {
          this.setState({ board, gameOver: true, message: 'Draw game.' });
        } else {
          this.setState({ board, currentPlayer: this.togglePlayer() });
        }
      } else {
        this.setState({ message: 'Game over. Please start a new game.' });
      }
    }


    checkVertical(board) {
      for (let r = 3; r < 6; r++) {
        for (let c = 0; c < 7; c++) {
          if (board[r][c]) {
            if (board[r][c] === board[r - 1][c] &&
                board[r][c] === board[r - 2][c] &&
                board[r][c] === board[r - 3][c]) {
              return board[r][c];    
            }
          }
        }
      }
    }


        checkHorizontal(board) {
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 4; c++) {
          if (board[r][c]) {
            if (board[r][c] === board[r][c + 1] && 
                board[r][c] === board[r][c + 2] &&
                board[r][c] === board[r][c + 3]) {
              return board[r][c];
            }
          }
        }
      }
    }


        checkDiagonalRight(board) {
      for (let r = 3; r < 6; r++) {
        for (let c = 0; c < 4; c++) {
          if (board[r][c]) {
            if (board[r][c] === board[r - 1][c + 1] &&
                board[r][c] === board[r - 2][c + 2] &&
                board[r][c] === board[r - 3][c + 3]) {
              return board[r][c];
            }
          }
        }
      }
    }


        checkDiagonalLeft(board) {
      for (let r = 3; r < 6; r++) {
        for (let c = 3; c < 7; c++) {
          if (board[r][c]) {
            if (board[r][c] === board[r - 1][c - 1] &&
                board[r][c] === board[r - 2][c - 2] &&
                board[r][c] === board[r - 3][c - 3]) {
              return board[r][c];
            }
          }
        }
      }
    }

        checkDraw(board) {
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 7; c++) {
          if (board[r][c] === null) {
            return null;
          }
        }
      }
      return 'draw';    
    }
    
    checkAll(board) {
      return this.checkVertical(board) || this.checkDiagonalRight(board) || this.checkDiagonalLeft(board) || this.checkHorizontal(board) || this.checkDraw(board);
    }

    render(){
        return(
            <div>
                <div className={styles.header}>
                <h1 className={styles.text}>C<span className={styles.extra}>o</span>nnect F<span className={styles.extra}>o</span>ur!</h1>
                </div>
                <button onClick={() => {this.createBoard()}}>New Game</button>
                <table>
                <div>
                {this.state.board.map((row, i) => (<Board row={row} key={i} play={this.playGame}/>))}
                </div>
                </table>
                <p>{this.state.message}</p>
            </div>
        )
    }
}

export default Game;