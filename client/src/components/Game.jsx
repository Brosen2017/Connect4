import React from 'react';
import Board from './Board.jsx';
import Score from './Score.jsx';
import styles from '../styles/Game.css';
import {joinGame, toggle, player, updateName, updateBoard, retrieveBoard, updatePlayer, retrievePlayer} from '../socket.js'
import axios from 'axios';

class Game extends React.Component{
    constructor(props){
        super(props);
        this.state={
            player1: 1,
            player2: 2,
            name1:null,
            name2:null,
            wins1:1,
            wins2:1,
            board:[],
            currentPlayer: null,
            gameOver: false,
            highScore:[],
            message: '',
            test: true

        }
        this.playGame = this.playGame.bind(this)
    }

    componentDidMount(){
      //this.startingPlayer();
      this.createPlayer();
      this.createBoard();
      this.handleScore();
      retrieveBoard((b)=>{
        //console.log('this is the updated board', b)
        if(this.state.gameOver === true){
          this.setState({
          board: b,
          currentPlayer: this.startingPlayer(),
          gameOver: false,
          message:''
         })
        } else {
        this.setState({
            board: b
        })
      }
      })
      retrievePlayer((gameMessage)=>{
        console.log('current player', gameMessage)
          this.setState({
            message: gameMessage,
            gameOver: true
          })
      })
    }

    createBoard(){
      this.handleScore();
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
            currentPlayer: this.startingPlayer(),
            gameOver: false,
            message:''
        })
         updateBoard(board)
    }

    handleScore(){
      axios
      .get('/player')
      .then((res)=>{
        this.setState({
          highScore: res.data
        })
      })
      .catch(err=>console.log(err))
    }

    //create player based on user prompt
    createPlayer(){
      // let playerName = window.prompt('Name your player');
      // joinGame(playerName)
     if(this.state.name1 === null){
        this.setState({
          name1: 'Red'//playerName
        })
      } else if (this.state.name2 === null){
        this.setState({
          name2: 'Blue' //playerName
        })
      }
 
  }

  //checkPlayer name to determine winner, if undefined will return default name
  checkName(name){
    if(name === null && this.state.name1 === null || name === ''){
      return 'Red'
    }
    if(name === null && this.state.name2 === null || name === ''){
      return 'Blue'
    } else {
      return name;
    }
  }

  startingPlayer(){
  toggle();
    player((currentPlayer)=>{
      console.log('player toggle', currentPlayer, 'current:',this.state.currentPlayer)
      if(currentPlayer === this.state.currentPlayer){

      // console.log('in player toggle', currentPlayer)
      this.setState({
       currentPlayer: 3, 
      })
    }
      if(currentPlayer !== this.state.currentPlayer){
      this.setState({
        currentPlayer: currentPlayer
      })
      }
     })
  }

    //change player dependendent on who went last
    togglePlayer(){
      this.startingPlayer();
    }

    show(){
      console.log('current state', this.state)
    }


    //core gameplay functionality and board check implementation
    playGame(c) {
      if (!this.state.gameOver) {
        let board = this.state.board;
        for (let r = 5; r >= 0; r--) {
          if (!board[r][c]) {
            board[r][c] = this.state.currentPlayer;
            break;
          }
        }
        this.setState({ board, currentPlayer: this.togglePlayer() });
        updateBoard(this.state.board)
        let result = this.checkBoard(board);
        if (result === this.state.player1) {
          updatePlayer(this.state.player1);
          this.handleWins(this.state.player1);
          this.setState({ board, gameOver: true, message: `${this.checkName(this.state.name1)} (red) wins!` });
        } 
        if (result === this.state.player2) {
          updatePlayer(this.state.player2);
          this.handleWins(this.state.player2);
          this.setState({ board, gameOver: true, message: `${this.checkName(this.state.name2)} (blue) wins!` });
        } 
        if (result === 'draw') {
          updatePlayer(null);
          this.setState({ board, gameOver: true, message: 'Draw!' });
        } 
      } else {
        this.setState({ message: 'Game over! Press new game to restart!' });
      }
    }

    //keep track of current wins per player and update database per win based on username and win
    handleWins(player){
      if(player === this.state.player1){
        this.setState({
          wins1: (this.state.wins1 + 1)
        })
        let name = this.checkName(this.state.name1)
        let user = {
          name: name,
          wins: this.state.wins1
        }
        axios
        .patch('/player', {user})
        .then((res)=>{
          console.log(res.data)
        })
        .catch(err=>console.log(err));
      } else if(player === this.state.player2){
        this.setState({
          wins2: this.state.wins2 + 1
        })
        let name = this.checkName(this.state.name2)
        let user = {
          name: name,
          wins: this.state.wins2
        }
        axios
        .patch('/player', {user})
        .then((res)=>{
          console.log(res.data)
        })
        .catch(err=>console.log(err));
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
                <button onClick={()=>{this.show()}}>show state</button>
                <div className={styles.main}>
                <table>
                <tbody>
                {this.state.board.map((row, i) => (<Board row={row} key={i} play={this.playGame}/>))}
                </tbody>
                </table>
                <div className={styles.score}>
                <div className={styles.scoreBox}>
                <h1 className={styles.highScore}><span className={styles.red}>Red</span> vs <span className={styles.blue}>Blue</span></h1>
                </div>
                <div className={styles.list}>
                  {this.state.highScore.map((score, i)=><Score score={score} key={i}/>)}
                  </div>
                </div>
                <div>
                <p>{this.state.message}</p>
                </div>
                </div>
            </div>
        )
    }
}

export default Game;