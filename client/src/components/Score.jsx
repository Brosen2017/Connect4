import React from 'react';
import styles from '../styles/Score.css';

let Score = props =>(
    <ul >
    <p>
    <span className={styles.headers}>Player: </span>{props.score.Username}, <span className={styles.headers}>Wins: </span>{props.score.Wins}
    </p>
    </ul>
)

export default Score;