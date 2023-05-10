import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom';

const Notification = ({notification}) => {
    const notificationRef = useRef();

    useEffect(() => {
        notificationRef.current.innerHTML = notification.message.replace(/&[a-zA-Z0-9_-]*/g, (match, ind) => {
            return `<a href='/group/${match.slice(1,)}' class='text-groupcolor font-semibold no-underline'>${match}</a>`;
        })
    }, [])

  return (
    <div className='flex flex-row h-fit p-3 border-b border-grayedcolor'>
        <span className='font-semibold mr-3' ref={notificationRef}>{notification.message}</span>
        <span className='text-grayedcolor'>
        {new Date(notification.time_stamp).toLocaleString()}
        </span>
    </div>
  )
}

export default Notification