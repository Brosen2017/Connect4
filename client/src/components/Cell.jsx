import React from 'react';

let Cell = props =>{
    let color = 'white';
    if (props.cell === 1) {
      color = 'red';
    } else if (props.cell === 2) {
      color = 'blue';
    }

    return(
    <div>
        {props.cell}
        <button onClick={() => {props.play(props.index)}}>{color}</button>
    </div>
)
    }

export default Cell;