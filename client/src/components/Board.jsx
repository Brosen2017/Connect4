import React from 'react';
import Cell from './Cell.jsx';

let Board = props =>(
    <tr>
    <div>
        {props.row.map((cell, i) => <Cell cell={cell} key={i} index={i} play={props.play}/>)}
    </div>
    </tr>
)

export default Board;