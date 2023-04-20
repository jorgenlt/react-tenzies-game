import Head from 'next/head'
import Die from './Die'
import { useState, useEffect, use } from 'react'
import {nanoid} from 'nanoid'
import Confetti from 'react-confetti'

export default function Home() {

  const [dice, setDice] = useState([{value: 1, isHeld:false, id: nanoid()}])
  const [tenzies, setTenzies] = useState(false)

  useEffect(() => setDice(() => allNewDice()), [])

  useEffect(() => {
    // Check if all objects have isHeld: true
    const allHeld = dice.every(die => die.isHeld);

    // Check if all objects have the same value
    const firstValue = dice[0].value;
    const allSameValue = dice.every(die => die.value === firstValue);

    if(allHeld && allSameValue) {
      setTenzies(true);
      console.log('winner');
    }
  }, [dice])

  const newDie = () => {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    };
  }

  const allNewDice = () => {
    return Array.from({ length: 10 }).map(() => newDie());
  }

  const diceElements = dice.map(die => (
    <Die 
      key={die.id} 
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ))

  const rollDice = () => {
    setDice(prevDice => prevDice.map(die => {
      return die.isHeld
      ? die
      : newDie()
    }))
  }

  const holdDice = id => {
    setDice(prevDice => prevDice.map(die => {
      return die.id === id
      ? { ...die, isHeld: !die.isHeld }
      : die
    }))
  }

  const newGame = () => {
    setDice(() => allNewDice())
    setTenzies(false)
  }

  // roll with space key
  const handleSpaceKeyPress = (event) => {
    if (event.code === 'Space') {
      rollDice()
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleSpaceKeyPress);
  }, [])

  return (
    <>
      <Head>
        <title>Tenzies Game</title>
        <meta name="description" content="Tenzies Game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='container' onKeyDown={handleSpaceKeyPress}>
        <div className='title-wrapper'>
          <h1 className='title'>Tenzies Game</h1>
          <p className='instructions'>Roll until all dice are equal. Click to hold.</p>
        </div>
        <div className='dies'>
          {diceElements}
        </div>
        <button className={tenzies ? 'roll-dice-btn blue' : 'roll-dice-btn'} onClick={tenzies ? newGame : rollDice}>{tenzies ? 'New game' : 'Roll'}</button>
        {tenzies && <Confetti />}
      </main>
    </>
  )
}
