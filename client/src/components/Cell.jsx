import React from 'react';
import styles from '../styles/Cell.css';


let Cell = props =>{
    let color = 'white';
    if (props.cell === 1) {
      color = 'red';
    } else if (props.cell === 2) {
      color = 'blue';
    }

    return(
        <td>
    <div>
        <button style={{'background-color': color}} className={styles.cell} onClick={() => {props.play(props.index)}}></button>
    </div>
    </td>
)
    }

export default Cell;