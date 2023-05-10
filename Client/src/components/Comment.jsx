import React from 'react'
import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SmartText from './SmartText';

const Comment = ({commentData, id}) => {

    const navigate = useNavigate();



  return (
    <div className='p-3 border-b border-solid border-grayedcolor'>
        <div className='w-full text-left'>
            <strong className='mr-3' onClick={() => { navigate(`/user/${commentData.username}`)}}>{commentData.username}</strong>
            <span className='text-grayedcolor'>{new Date(commentData.time_stamp).toLocaleString()}</span>
        </div>
        
        <div className='m-3 ml-0 text-left'>
            <SmartText text={commentData.comment}/>
        </div>
        {/* <div className='p-2'>
            {commentData.data.likes}
        </div> */}
    </div>
  )
}

export default Comment