import React, { useState, useEffect } from 'react'
import personService from './services/persons'


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
  
  const personsToShow = Filter
      ? persons.filter(person => person.name.toLowerCase().includes(Filter.toLowerCase()))
      : persons

  const userExists = (username) => {
    const personExists = persons.find(person => username.newName === person.name)
    return personExists ? personExists.id : 0
  }

  // const addNewName = (event) => {
  //   event.preventDefault()
  //   console.log({newName}, userExists(newName))
  //   const nameObject = {
  //     name: newName,
  //     number: newNumber
  //   }
  //   if (userExists({newName})) {
  //     window.alert(`${newName} is already added to phonebook`)
  //   } else {
  
  //     personService
  //       .create(nameObject)
  //       .then(data => {
  //           console.log('adding person to database')
  //           setPersons(persons.concat(data))
  //           setNewName('')
  //           setNewNumber('')
  //       })
  //   }
  // }

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
          })
          .catch(error => {
            alert(
              `the person '${newName}' was already deleted from server`
            )
            setPersons(persons.filter(p => p.id !== userId))
          })
      } 
      setNewName('')
      setNewNumber('')
      
    } else {
      personService
        .create(nameObject)
        .then(data => {
            console.log('adding person to database')
            setPersons(persons.concat(data))
            setNewName('')
            setNewNumber('')
        })
    }
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
        })
        .catch(error => {
          alert(
            `the note '${persontoDel.id}' was already deleted from server`
          )
          setPersons(persons.filter(person => person.id !== persontoDel.id))
        })
    }  
  }

  return (
    <div>
      <h2>Phonebook</h2>
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

