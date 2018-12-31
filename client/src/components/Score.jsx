import React from 'react';

let Score = props =>(
    <ul >
    <p>
    Player: {props.score.Username}, Wins: {props.score.Wins}
    </p>
    </ul>
)

export default Score;