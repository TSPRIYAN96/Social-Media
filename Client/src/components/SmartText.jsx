import React, { useEffect, useRef } from 'react'

const SmartText = ({text, rerender}) => {

    const textRef = useRef();

    useEffect(() => {
        textRef.current.innerHTML = text.replace(/@[a-zA-Z0-9_-]*/g, (match, ind) => {
            return `<a href='/user/${match.slice(1,)}' class='text-tagcolor font-semibold no-underline'>${match}</a>`;
        }).replace(/&[a-zA-Z0-9_-]*/g, (match, ind) => {
            return `<a href='/group/${match.slice(1,)}' class='text-groupcolor font-semibold no-underline'>${match}</a>`;
        })
    }, [rerender])

  return (
    <div className='m-0' ref={textRef}></div>
  )
}

export default SmartText