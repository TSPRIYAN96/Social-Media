import React from 'react'
import { Link } from 'react-router-dom'

const NeedsAuthentication = ({message}) => {
  return (
    <div className='bg-bglight p-5 m-auto text-2xl round-xl'>
        <div className='text-fgcolor text-4xl m-5'>{message ? message : 'You need to be authenticated to view this page'}</div>
        <Link to='/login'>Login</Link>
    </div>
  )
}

export default NeedsAuthentication