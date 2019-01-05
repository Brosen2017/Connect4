import React from 'react';
import Board from './Board.jsx';
import Score from './Score.jsx';
import styles from '../styles/Game.css';
import {joinGame, playerTrack, toggleData, lobby, lobbyCheck, toggle, player, updateName, updateBoard, retrieveBoard, updatePlayer, retrievePlayer} from '../socket.js'
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
            test: true,
            loading:true,
            player:[],
            room:''

        }
        this.playGame = this.playGame.bind(this)
    }

    componentDidMount(){
      //playerTrack();
      
      joinGame((data)=>{
        //console.log('join data', data)
        this.setState({
          room: data.room
        })
      lobby(data.room, data.player);  
      })
      //lobby();
      // this.handleLoading();
      //this.createPlayer();
      this.createBoard();
      //this.handleScore();
      retrieveBoard((b)=>{
        //console.log('this is the updated board', b)
        
        if(this.state.gameOver === true){
          this.startingPlayer();
          this.setState({
          board: b,
          //currentPlayer: this.startingPlayer(),
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

    handleLoading(){
      lobbyCheck((b)=>{
        //console.log('lobby full?', b)
        if(b === true){
          this.setState({
            loading: false
          })
        }
        if(b === false){
          this.setState({
            loading: true
          })
        }
      })
        if(this.state.loading === true){
        // return (<div><h1>Waiting for other players</h1></div>)
        return true
        } 
        if(this.state.loading === false){
          return false;
        }
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
        this.startingPlayer();
        this.setState({
            board: board,
            //currentPlayer: this.startingPlayer(),
            gameOver: false,
            message:''
        })
         updateBoard(board, this.state.room)
    }

    handleScore(){
      axios
      .get('/player')
      .then((res)=>{
        // console.log('in score data', res.data)
        this.setState({
          highScore: res.data
        })
      })
      .catch(err=>console.log(err))
    }

    //create player based on user prompt
  //   createPlayer(){
  //     // let playerName = window.prompt('Name your player');
  //     // joinGame(playerName)
  //    if(this.state.name1 === null){
  //       this.setState({
  //         name1: 'Red'//playerName
  //       })
  //     } else if (this.state.name2 === null){
  //       this.setState({
  //         name2: 'Blue' //playerName
  //       })
  //     }
 
  // }

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
    console.log('Ive been triggered')
  toggleData((data)=>{
    //console.log('connected player:', data.player, 'room:', data.room)
    this.setState({
      player: data.player,
      room:data.room
    })
    console.log('the state', this.state.player)
    toggle(data.player, data.room);
  })
  toggle(this.state.player, this.state.room);
    player((currentPlayer)=>{
      
      //  console.log('player toggle', currentPlayer, 'current:',this.state.currentPlayer)
      if(currentPlayer === this.state.currentPlayer){

      // console.log('in player toggle', currentPlayer)
      this.setState({
       currentPlayer: 3, 
      })
       //return this.state.currentPlayer
    }
      if(currentPlayer !== this.state.currentPlayer){
      this.setState({
        currentPlayer: currentPlayer
      })
       //return currentPlayer;
      }
      console.log('player toggle', currentPlayer, 'current:',this.state.currentPlayer)
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
        updateBoard(this.state.board, this.state.room)
        let result = this.checkBoard(board);
        if (result === this.state.player1) {
          updatePlayer(this.state.player1, this.state.room);
          this.handleWins(this.state.player1);
          this.setState({ board, gameOver: true, message: `${this.checkName(this.state.name1)} (red) wins!` });
        } 
        if (result === this.state.player2) {
          updatePlayer(this.state.player2, this.state.room);
          this.handleWins(this.state.player2);
          this.setState({ board, gameOver: true, message: `${this.checkName(this.state.name2)} (blue) wins!` });
        } 
        if (result === 'draw') {
          updatePlayer(null, this.state.room);
          this.setState({ board, gameOver: true, message: 'Draw!' });
        } 
      } else {
        this.setState({ message: 'Game over! Press new game to restart!' });
      }
    }

    //keep track of current wins per player and update database per win based on username and win
    handleWins(player){
      if(player === this.state.player1){
      axios
      .get('/player')
      .then((res)=>{
        // console.log('in score data', res.data)
        if(res.data.length <= 0 || res.data[0].Username === 'Blue' && !res.data[1]){
          this.setState({
            wins1: 1
          })
        } else {
        let updatedWins = (res.data[0].Wins + 1);
        this.setState({
          wins1: updatedWins || 1
        })
      }
        let user = {
          name: 'Red',
          wins: this.state.wins1
        }
        axios
        .patch('/player', {user})
        .then((res)=>{
          console.log(res.data)
        })
        .catch(err=>console.log(err));
      })
      .catch(err=>console.log(err))
      } else if(player === this.state.player2){
        axios
        .get('/player')
        .then((res)=>{
          console.log('in score data', res.data)
          if(res.data.length <= 0 || res.data[0].Username === 'Red' && !res.data[1]){
            this.setState({
              wins2: 1
            })
          } else {
          let updatedWins = (res.data[1].Wins + 1);
          this.setState({
            wins2: updatedWins || 1
          })
        }
          let user = {
            name: 'Blue',
            wins: this.state.wins2
          }
          axios
          .patch('/player', {user})
          .then((res)=>{
            console.log(res.data)
          })
          .catch(err=>console.log(err));
        })
        .catch(err=>console.log(err))
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
      if(this.handleLoading()){
        return <div className={styles.lobby}><div></div><h1 className={styles.lobbyText}>Waiting for other players...</h1><div className={styles.loader}></div></div>
      } else {
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
                  <div className={styles.winBox}>
                {this.state.message}
                </div>
                </div>
         
                </div>
            </div>
        )
      }
    }
}

export default Game;