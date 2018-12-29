import React from 'react';
import Board from './Board.jsx';

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
        for(let r = 0; r < 6; r++){
            let row =[];
            for(let c =0; c < 7; c++){
                row.push(null);
            }
            board.push(row);
        }
        this.setState({
            board: board
        })
        console.log(this.state.board)
    }

    //toggle player based on current state
    togglePlayer() {
              if(this.state.currentPlayer === this.state.player1){
                  return this.state.player2
              } else {
                  return this.state.player1
              }
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
    }
}
 

    render(){
        return(
            <div>
                <h1>Hello from React!</h1>
                <button onClick={() => {this.createBoard()}}>New Game</button>
                <div>
                {this.state.board.map((row, i) => (<Board row={row} key={i} play={this.playGame}/>))}
                </div>
                <p>{this.state.message}</p>
            </div>
        )
    }
}

export default Game;