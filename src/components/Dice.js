import React from "react"

export default function Dice(props){
    return(
        <h1 className={props.isHeld? "clicked-dice" :"dice"} onClick={props.holdDice} >{props.number}</h1>
    )
}