import React from 'react'
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <>
        <div className='m-auto text-3xl'>
            <div className='text-red-500 text-4xl m-10'>404 Not Found</div>
            <strong className='block m-10'>The requested resource was not found on our server</strong>
            <Link to="/">Back Home</Link>
        </div>
    </>
  )
}

export default NotFound;