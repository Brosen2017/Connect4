import React from 'react';
import Board from './Board.jsx';
import styles from '../styles/Game.css';

class Game extends React.Component{
    constructor(props){
        super(props);
        this.state={
            player1: 1,
            player2: 2,
            name1:null,
            name2:null,
            board:[],
            currentPlayer: null,
            gameOver: false,
            message: ''

        }
        this.playGame = this.playGame.bind(this)
    }

    componentDidMount(){
      this.createPlayer();
       console.log(this.state)
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
            board: board,
            currentPlayer: this.state.player1,
            gameOver: false,
            message:''
        })
        // console.log(this.state.board)
    }

    //create player based on user prompt
    createPlayer(){
      let playerName = window.prompt('Name your player');
      if(this.state.name1 === null){
        this.setState({
          name1: playerName
        })
      } else if (this.state.name2 === null){
        this.setState({
          name2: playerName
        })
      }
  }

  //checkPlayer name to determine winner, if undefined will return default name
  checkName(name){
    if(name === null && this.state.name1 === null){
      return 'player 1'
    }
    if(name === null && this.state.name2 === null){
      return 'player 2'
    } else {
      return name;
    }
  }

    //change player dependendent on who went last
    togglePlayer(){
              if(this.state.currentPlayer === this.state.player1){
                return this.state.player2
              } else{
                return this.state.player1
            }
    }

    //core gameplay functionality and board check implementation
    playGame(c) {
            console.log('Ive been clicked', this.state)
      if (!this.state.gameOver) {
        let board = this.state.board;
        for (let r = 5; r >= 0; r--) {
          if (!board[r][c]) {
            board[r][c] = this.state.currentPlayer;
            break;
          }
        }
        let result = this.checkBoard(board);
        if (result === this.state.player1) {
          this.setState({ board, gameOver: true, message: `${this.checkName(this.state.name1)} wins!` });
        } else if (result === this.state.player2) {
          this.setState({ board, gameOver: true, message: `${this.checkName(this.state.name2)} wins!` });
        } else if (result === 'draw') {
          this.setState({ board, gameOver: true, message: 'Draw!' });
        } else {
          this.setState({ board, currentPlayer: this.togglePlayer() });
        }
      } else {
        this.setState({ message: 'Game over! Press new game to restart!' });
      }
    }


    handleVertical(board) {
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


        handleHorizontal(board) {
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


        handleDiagonalRight(board) {
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


        handleDiagonalLeft(board) {
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

        handleDraw(board) {
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 7; c++) {
          if (board[r][c] === null) {
            return null;
          }
        }
      }
      return 'draw';    
    }
    
    checkBoard(board) {
      return this.handleVertical(board) || this.handleDiagonalRight(board) || this.handleDiagonalLeft(board) || this.handleHorizontal(board) || this.handleDraw(board);
    }

    render(){
        return(
            <div>
                <div className={styles.header}>
                <h1 className={styles.text}>C<span className={styles.extra}>o</span>nnect F<span className={styles.extra}>o</span>ur!</h1>
                </div>
                <button onClick={() => {this.createBoard()}}>New Game</button>
                <table>
                <tbody>
                {this.state.board.map((row, i) => (<Board row={row} key={i} play={this.playGame}/>))}
                </tbody>
                </table>
                <p>{this.state.message}</p>
            </div>
        )
    }
}

export default Game;