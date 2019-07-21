import React, { useState, useEffect } from 'react'
import axios from 'axios'


const Filterpart = ({ value, onChange}) => (
    <div>find countries <input value={value} onChange={onChange} /></div>
)

const Country = ({ country }) => {
  return (
    <div>
      <h2>{country.name}</h2>
      Capital: {country.capital} <br />
      Population: {country.population}
      <h3>Languages</h3>
      <ul>
        {country.languages.map(lang => <li key={lang.name}>{lang.name}</li>)}
      </ul>
      <img src={country.flag} width='200' alt={country.demonym + " flag"}/>
    </div>
  )

}

const Countries = ({ countries }) => {
  if (countries.length > 10) {
    return (
      <div>Too many matches ({countries.length}), narrow your search</div>
    )
    } else if (countries.length === 1) {
      console.log(countries[0])
      return <Country country = {countries[0]} />
    } else { 
        return countries.map(country => <div key={country.name}>{country.name}</div>)
    }
  } 


const App = () => {
  const [ Filter, setFilter] = useState('')
  const [ countryList, setCountryList ] = useState([])


  const hook = () => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountryList(response.data)
      })
  }
  
  useEffect(hook, [])

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }
  
  const countriesToShow = Filter
  ? countryList.filter(country => country.name.toLowerCase().includes(Filter.toLowerCase()))
  : countryList
    
  return (
    <div>
        <Filterpart value={Filter} onChange={handleFilterChange} />
        <Countries countries={countriesToShow} />
    </div>
  )
}

export default App

