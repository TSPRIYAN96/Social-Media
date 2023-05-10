import React from 'react'
import { useNavigate } from 'react-router-dom'

const Tag = ({tagName}) => {

    const navigate = useNavigate();

  return (
    <span className='m-2 text-tagcolor font-semibold' onClick={() => navigate(`/user/${tagName}`)}>@{tagName}</span>
  )
}

export default Tag