import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const generateRandom = (max) => {
    return Math.floor(Math.random() * max)
}

const Anecdote = ({ anecdote, votes }) => {
    return (
        <div>
            {anecdote}<br />
            has {votes} votes
        </div>
    )
}

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [votes, setVote] = useState((new Array(anecdotes.length).fill(0)))

  const mostVotes = votes.indexOf(Math.max(...votes))

  const setNextSelected = () => {
      setSelected(generateRandom(anecdotes.length))
  }

  const setUpVote = () => {
      const arraycopy = [...votes]
      arraycopy[selected] += 1
      setVote(arraycopy)
      console.log(arraycopy)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <Anecdote anecdote={props.anecdotes[selected]} votes={votes[selected]} />
      <button onClick={() => setUpVote()}>vote</button>
      <button onClick={() => setNextSelected()}>next anecdote</button>
      <h1>Anecdote with most votes</h1>
      <Anecdote anecdote={props.anecdotes[mostVotes]} votes={votes[mostVotes]} />
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)
