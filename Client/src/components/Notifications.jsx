import React, { useEffect, useState } from 'react'
import Spinner from './Spinner';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';

const Notifications = () => {

    const [isFetchingNotifications, setIsFetchingNotifications] = useState(true);
    const [rerender, setRerender] = useState(0);
    const [notificationData, setNotificationData] = useState();
    const navigate = useNavigate();

    const markNotificationsAsRead = async() => {
        const res = await fetch('http://localhost:3000/api/delete/notifications', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type' : 'application/json'
            },
        });
        const data = await res.json();
        setRerender(!rerender);
    }

    useEffect(() => {
        const fetchNotifications = async() => {
            const res = await fetch('http://localhost:3000/api/notifications', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type' : 'application/json'
                },
            });
            const data = await res.json();
            if(data.unauthorized) navigate('/login');
            console.log(data);
            setNotificationData(data);
            setIsFetchingNotifications(false);
        }

        fetchNotifications();
    }, [rerender])

  return (
    <div>
        {isFetchingNotifications ? <Spinner/> :
        <div className='my-10 p-3 rounded-xl border-solid border-grayedcolor bg-bglight'>
            <strong className='text-2xl'>Notifications</strong>
            {notificationData.notifications.map((x, id) =>  <Notification key={id} notification={x}/> )}
            {!notificationData.notifications.length && <div className='m-3'>You're clear</div>}
            <button className='my-3' onClick={markNotificationsAsRead}>Mark as read</button>
        </div>}
    </div>
  )
}

export default Notifications