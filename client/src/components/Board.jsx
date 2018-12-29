import React from 'react';
import Cell from './Cell.jsx';

let Board = props =>(
    <div>
        {props.row.map((cell, i) => <Cell cell={cell} key={i} index={i} play={props.play}/>)}
    </div>
)

export default Board;