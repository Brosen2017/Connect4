import React from 'react';

class Game extends React.Component{
    constructor(props){
        super(props);
        this.state={
            temp:'',
            board:[]
        }
    }

    createBoard(){
        let board = [];
        for(var r = 0; r < 6; r++){
            let row =[];
            for(var c =0; c < 7; c++){
                row.push(0);
            }
            board.push(row);
        }
        this.setState({
            board: board
        })
        console.log(this.state.board)
    }

    render(){
        return(
            <div>
                <h1>Hello from React!</h1>
                <button onClick={() => {this.createBoard()}}>New Game</button>
            </div>
        )
    }
}

export default Game;