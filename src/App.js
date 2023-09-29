import React from "react"
import Dice from "./components/Dice"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"

export default function App() {

  const [dice, setDice] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)
  const [rolls, setRolls] = React.useState(1)
  const [highScore, setHighScore] = React.useState(getSavedHighScore() || null); // Initialize high score state with the saved high score or null

  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const holdedValue = dice[0].value
    const allHoldedValues = dice.every(die => die.value === holdedValue)
    if (allHeld && allHoldedValues) {
      setTenzies(true)
      if (highScore === null || rolls < highScore) { // Check if the current game's rolls are fewer than the previous high score
        setHighScore(rolls); // Update the high score state
        saveHighScore(rolls); // Save the high score to local storage
      }
    }
  }, [dice , rolls])

  function getSavedHighScore() {
    return parseInt(localStorage.getItem("highScore")) || null;
  }

  function saveHighScore(score) {
    localStorage.setItem("highScore", score);
  }

  function eraseHighScore() {
    localStorage.removeItem("highScore");
    setHighScore(null);
  }

  function allNewDice() {
    const numbersArray = []
    for (let i = 0; i < 10; i++) {
      numbersArray.push({
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: nanoid()
      })
    }
    return numbersArray
  }

  function rollDice() {
    if (tenzies) {
      setDice(allNewDice())
      setTenzies(false)
      setRolls(1)
    }
    else {
      setDice(oldDice => oldDice.map(die => {
        return die.isHeld ? die : {
          value: Math.ceil(Math.random() * 6),
          isHeld: false,
          id: nanoid()
        }
      }))
      setRolls(rolls + 1)
    }
  }

  function holdDice(id) {
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ? { ...die, isHeld: !die.isHeld } : die
    }))
  }

  const diceElements = dice.map(die => (
    <Dice key={die.id} number={die.value} isHeld={die.isHeld} holdDice={() => holdDice(die.id)} />
  ))

  return (
    <main className="white">
      <div className="petrol">
        <div className="grey">
          {tenzies && <Confetti />}
          <h1 className="tenzies">Tenzies</h1>
          <h3 className="description">Roll untill all dice are the same. Click each die to freeze it at its current value between rolls.</h3>
          <div className="dice-container">
            <div className="dices"> {diceElements} </div>
          </div>
          <button className="roll-button" onClick={rollDice} >{tenzies ? "New Game" : "Roll"}</button>
          {tenzies && rolls && <h4>Congrats! You Won in {rolls} Rolls</h4>}
          <div className="footer">
            <h5>Your Highest Score is: {highScore}</h5>
            <button className="reset-button" onClick={eraseHighScore}>Reset High Score</button>
          </div>
        </div>
      </div>
    </main>
  )
}