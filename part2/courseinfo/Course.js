import React from 'react'

const Course = ({ course }) => {
    const total = course.parts.reduce((i, j) => i + j.exercises, 0)
  
    return (
      <div>
        <Header header={course.name} />
        <Content parts={course.parts} />
        <b>Total number of exercises: {total}</b>
      </div>
    )
  }
  
  const Header = ({ header }) =>
    <h1>{header}</h1>
    
  const Content = ({ parts }) => {
    const rows = () => parts.map(part => 
      <Part key={part.id} part={part} />
    )
  
    return (
    <div>
      {rows()}
    </div>
    )
  }
  
  const Part = ({ part }) =>
    <p>{part.name} {part.exercises}</p>
  

export default Course