import React from 'react'

const Input = ({type, name, defaultValue, handler}) => {
  return (
    
    <input 
        type={type} 
        placeholder={defaultValue}
        name={name}
        className = 'm-3 px-2 py-1 h-fit rounded-2xl border-solid border-2 border-themecolor w-full'
        onChange={(e) => {handler(e.target.value)}}
    >
    </input>

  )
}

export default Input