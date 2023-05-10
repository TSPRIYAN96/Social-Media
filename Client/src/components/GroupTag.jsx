import React from 'react'
import { useNavigate } from 'react-router-dom'

const GroupTag = ({tagName}) => {

    const navigate = useNavigate();

  return (
    <span className='m-2 text-groupcolor font-semibold' onClick={() => navigate(`/group/${tagName}`)}>&{tagName}</span>
  )
}

export default GroupTag