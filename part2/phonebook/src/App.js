import React, { useState, useEffect } from 'react'
import axios from 'axios'


const Filterpart = ({ value, onChange}) => (
    <div>filter shown with <input value={value} onChange={onChange} /></div>
)

const Personform = (props) => {
  return (
    <form onSubmit={props.addNewName}>
    <div>name: <input value={props.newName} onChange={props.handleNameChange} /></div>
    <div>number: <input value={props.newNumber} onChange={props.handleNumberChange} /></div>
    <div><button type="submit">add</button></div>
  </form>  
  )
}

const Persons = ({ persons }) => persons.map(person => 
    <div key={person.name}>{person.name} {person.number}</div>
  )

const App = () => {
  const [ persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ Filter, setFilter ] = useState('')

  const hook = () => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }
  
  useEffect(hook, [])
    
    
  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }
  
  const personsToShow = Filter
      ? persons.filter(person => person.name.toLowerCase().includes(Filter.toLowerCase()))
      : persons

  const userExists = (username) => persons.some((person) => username.newName === person.name)

  const addNewName = (event) => {
    event.preventDefault()
    console.log({newName}, userExists(newName))
    if (userExists({newName})) {
      window.alert(`${newName} is already added to phonebook`)
      console.log(newName, 'is already added to phonebook' )
    } else {
      const nameObject = {
        name: newName,
        number: newNumber
      }
      setPersons(persons.concat(nameObject))
    }
    setNewName('')
    setNewNumber('')
 
  }

    
  return (
    <div>
      <h2>Phonebook</h2>
      <Filterpart value={Filter} onChange={handleFilterChange} />
      <h2>Add a new number</h2>
      <Personform addNewName={addNewName} newName={newName} handleNameChange={handleNameChange}
      newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} />
    </div>
  )
}

export default App

