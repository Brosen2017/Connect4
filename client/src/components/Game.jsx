import React from 'react';
import Board from './Board.jsx';
import Score from './Score.jsx';
import styles from '../styles/Game.css';
import {joinGame, disconnect, toggleData, lobby, lobbyCheck, toggle, player, updateBoard, retrieveBoard, updatePlayer, retrievePlayer} from '../socket.js'
import {handleVertical, handleHorizontal, handleDiagonalLeft, handleDiagonalRight, handleDraw} from '../boardCheck.js'
import axios from 'axios';

class Game extends React.Component{
    constructor(props){
        super(props);
        this.state={
            player1: 1,
            player2: 2,
            wins1:1,
            wins2:1,
            board:[],
            currentPlayer: null,
            gameOver: false,
            highScore:[],
            message: '',
            loading:true,
            disconnect: false,
            player:[],
            room:''

        }
        this.playGame = this.playGame.bind(this)
    }

    componentDidMount(){
      joinGame((data)=>{
        this.setState({
          room: data.room
        })
      lobby(data.room, data.player);  
      })
      disconnect((b)=>{
        this.setState({
          disconnect: b
        })
      })
      this.createBoard();
      retrieveBoard((b)=>{
        
        if(this.state.gameOver === true){
          this.startingPlayer();
          this.setState({
          board: b,
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
          this.setState({
            message: gameMessage,
            gameOver: true
          })
      })
    }

    //conditional lobby loading
    handleLoading(){
      lobbyCheck((b)=>{
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
        return true
        } 
        if(this.state.loading === false){
          return false;
        }
    }

    //conditional disconnect response
    handleDisconnect(){
      disconnect((b)=>{
        this.setState({
          disconnect: b
        })
      })
      if(this.state.disconnect === true){
        return true;
      } else {
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
            gameOver: false,
            message:''
        })
         updateBoard(board, this.state.room)
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

  //change player dependendent on who went last
  startingPlayer(){
  toggleData((data)=>{
    this.setState({
      player: data.player,
      room:data.room
    })
    toggle(data.player, data.room);
  })
  toggle(this.state.player, this.state.room);
    player((currentPlayer)=>{

      if(currentPlayer === this.state.currentPlayer){

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
        this.setState({ board, currentPlayer: this.startingPlayer() });
        updateBoard(this.state.board, this.state.room)
        let result = this.checkBoard(board);
        if (result === this.state.player1) {
          updatePlayer(this.state.player1, this.state.room);
          this.handleWins(this.state.player1);
        } 
        if (result === this.state.player2) {
          updatePlayer(this.state.player2, this.state.room);
          this.handleWins(this.state.player2);
        } 
        if (result === 'draw') {
          updatePlayer(null, this.state.room);
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
        if(res.data.length <= 0 || res.data[0].Username === 'Blue' && res.data[1] === undefined){
          this.setState({
            wins1: 1
          })
        } else if(res.data[0].Username === 'Red'){
        let updatedWins = (res.data[0].Wins + 1);
        this.setState({
          wins1: updatedWins || 1
        })
      } else {
        let updatedWins = (res.data[1].Wins + 1);
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
          // console.log(res.data)
        })
        .catch(err=>console.log(err));
      })
      .catch(err=>console.log(err))
      } else if(player === this.state.player2){
        axios
        .get('/player')
        .then((res)=>{
          if(res.data.length <= 0 || res.data[0].Username === 'Red' && res.data[1] === undefined){
            this.setState({
              wins2: 1
            })
          } else if(res.data[0].Username === 'Blue') {
          let updatedWins = (res.data[0].Wins + 1);
          this.setState({
            wins2: updatedWins || 1
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
            // console.log(res.data)
          })
          .catch(err=>console.log(err));
        })
        .catch(err=>console.log(err))
      }
    }
  
    checkBoard(board) {
      return handleVertical(board) || handleDiagonalRight(board) || handleDiagonalLeft(board) || handleHorizontal(board) || handleDraw(board);
    }

    render(){
      if(this.handleLoading()){
        return <div className={styles.lobby}><div></div><h1 className={styles.lobbyText}>Waiting for other players...</h1><div className={styles.loader}></div></div>
      } 
      if(this.handleDisconnect()){
        return <div className={styles.disconnect}><div></div><h1 className={styles.errorText}>Error Player disconnected, please exit the page and restart browser</h1></div>
      }else{
        return(
            <div>
                <div className={styles.header}>
                <h1 className={styles.text}>C<span className={styles.extra}>o</span>nnect F<span className={styles.extra}>o</span>ur!</h1>
                </div>
                <button onClick={() => {this.createBoard()}}>New Game</button>
                {/* <button onClick={()=>{this.show()}}>show state</button> */}
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