import React from 'react'
import { Link } from 'react-router-dom'
import logo from '/src/social_network_logo.png'

const Navbar = () => {
  return (
    <div className='w-full h-20 sm:h-16 md:h-16 lg:h-20 xl:h-24 fixed p-4 bg-themecolor mb-5 flex flex-row justify-between items-center text-2xl'>
      <div className='flex flex-row justify-start items-center'>
        <img src={logo} alt='logo' className='w-12 ml-1 sm:w-8 md:w-12 lg:w-16 xl:w-16 md:ml-3 sm:ml-2'></img>
        <span className='text-themecolor sm:text-black text-xs/4 sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold ml-2 md:ml-5 sm:ml-2'>Social Network</span>
      </div>
      <div className='text-xs sm:text-sm md:text-md lg:text-lg xl:text-xl'>
        <Link className='text-black hover:text-blurcolor no-underline font-bold' to="/">Home</Link>
        <Link className='text-black no-underline mx-12 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-20 font-bold hover:text-blurcolor' to="/login">Login</Link>
        <Link className='text-black no-underline mr-10 font-bold hover:text-blurcolor sm:mr-3 md:mr-5 lg:mr-7 xl:mr-10' to="/signup">Signup</Link>        
      </div>
    </div>
  )
}

export default Navbar