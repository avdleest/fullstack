import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>

)


// is it always neccessary to use <div> when defining a component?
const Statistic = ({ text, value }) => {
  return (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
  )
}

const Statistics = ({ good, neutral, bad}) => {
  const all = good + neutral + bad
  const avg = (all === 0) ? 0 : (good - bad) / all
  const pos = (all === 0) ? 0 : (good / all) * 100

  if (!all) {
    return (
      <div>
        No feedback given
      </div>
    )
    }
  else {
    return (
      <div>
        <table>
          <tbody>
          <Statistic text='good' value={good} />
          <Statistic text='neutral' value={neutral} />
          <Statistic text='bad' value={bad} />
          <Statistic text='all' value={all} />
          <Statistic text='avg' value={avg} />
          <Statistic text='pos' value={pos} />
          </tbody>
        </table>
      </div>
    )

  }
}

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  // not quite happy with this solution, bit didn't know how to wrap this in one function
  const increaseGood = () => setGood(good + 1)
  const increaseNeutral = () => setNeutral(neutral + 1)
  const increaseBad = () => setBad(bad + 1)

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => increaseGood(setGood, good + 1)} text='good' />
      <Button handleClick={() => increaseNeutral(setNeutral, neutral + 1)} text='neutral' />
      <Button handleClick={() => increaseBad(setBad, bad + 1)} text='bad' />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />

    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)
