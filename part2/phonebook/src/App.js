import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={type}>
      {message}
    </div>
  )
}

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

const Button = ({ id, onClick }) => (
  <button id={id} onClick={onClick}>delete</button>
)

const Persons = ({ persons, onClick }) => persons.map(person => 
    <div key={person.name}>{person.name} {person.number} &nbsp;
    <Button id={person.id} onClick={onClick} /></div>
  )

const App = () => {
  const [ persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ Filter, setFilter ] = useState('')
  const [ notificationMessage, setNotification ] = useState([null, null])

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
  }, [])
    
    
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

  const handleNotificationChange = (message, type) => {
    setNotification([message, type])
    setTimeout(() => {
      setNotification([null, null])
    }, 5000)
  }

  const personsToShow = Filter
      ? persons.filter(person => person.name.toLowerCase().includes(Filter.toLowerCase()))
      : persons

  const userExists = (username) => {
    const personExists = persons.find(person => username.newName === person.name)
    return personExists ? personExists.id : 0
  }

  const addNewName = (event) => {
    event.preventDefault()
    console.log({newName}, userExists(newName))
    const nameObject = {
      name: newName,
      number: newNumber
    }
    const userId = userExists({newName})
    if (userId > 0) {
      console.log(userId)
      if (window.confirm(`${newName} is already added to phonebook, replace old number with new one?`)) {
        personService
          .update(userId, nameObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== userId ? person : returnedPerson))
            handleNotificationChange(`The number of ${newName} has been been changed`, 'info')
          })
          .catch(error => {
            handleNotificationChange(`${newName} was already deleted from server`, 'error')
            setPersons(persons.filter(p => p.id !== userId))
          })
      } 
      
    } else {
      personService
        .create(nameObject)
        .then(data => {
            console.log('adding person to database')
            setPersons(persons.concat(data))
            handleNotificationChange(`${newName} has been added to the database`, 'info')
        })
    }
    setNewName('')
    setNewNumber('')
  }

  const deleteName = (event) => {
    event.preventDefault()
    const persontoDel = persons.find(person => person.id === parseInt(event.target.id))
    if (window.confirm(`Really delete ${persontoDel.name}?`)) {
      personService
        .del(persontoDel.id)
        .then(data => {
          console.log(persons.filter(person => person.id !== persontoDel.id))
          setPersons(persons.filter(person => person.id !== persontoDel.id))
          handleNotificationChange(`${persontoDel.name} has been been deleted`, 'info')
        })
        .catch(error => {
          handleNotificationChange(`${persontoDel.name}' was already deleted from server`, 'error')
          setPersons(persons.filter(person => person.id !== persontoDel.id))
        })
    }  
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage[0]} type={notificationMessage[1]}/>
      <Filterpart value={Filter} onChange={handleFilterChange} />
      <h2>Add a new number</h2>
      <Personform addNewName={addNewName} newName={newName} handleNameChange={handleNameChange}
      newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} onClick={deleteName}/>
    </div>
  )
}

export default App

