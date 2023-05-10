import React, { useEffect, useState } from 'react';
import Upvote from '../icons/Upvote';
import Downvote from '../icons/Downvote';
import Bookmark from '../icons/Bookmark';
import PostBody from '../components/PostBody';
import CommentsIcon from '../icons/CommentsIcon';
import { useNavigate } from 'react-router-dom';

const GroupPost = ({data, refetch, setRefetch, rerender, setRerender}) => {

    
    const [imageURL, setImageURL] = useState('');
    const navigate = useNavigate();
    const cloudName = 'duoljv54r';


    const vote = async(vote_type) => {
        let res = await fetch(`http://localhost:3000/api/${vote_type === 'l' ? 'upvote' : 'downvote'}/post/${data.post_id}`,{
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        res = await res.json();
        console.log(res);
        
        
        if(res.unauthorized) modalRef.current.showModal();

        setRefetch(!refetch); // Forcing a re-run of useEffect
        setRerender(!rerender);

    
    }

    useEffect(() => {
        const constructImageURL = () => {
            if(data.img_public_id !== '0'){
                setImageURL(`https://res.cloudinary.com/${cloudName}/image/upload/${data.img_version}/${data.img_folder_name}/${data.img_public_id}`);
            }else{
                setImageURL('');
            }
        }
        constructImageURL();
    }, [refetch, rerender]);


  return (
    <div className='border border-solid border-grayedcolor bg-bglight w-[96%] m-auto  min-h-fit px-5' id="post-container"  onDoubleClick = {() => { navigate(`/post/${data.post_id}`)}} title="Double Click to view full post">
           <div className='h-full px-3 my-0 min-h-fit' id="post">
                <span className='p-5 block w-full text-left'>
                    <strong className='text-2xl' onClick={() => { navigate(`/user/@${data.username}`)}}>{data.username}</strong>
                    <span className='text-grayedcolor m-4'>{new Date(data.time_stamp).toLocaleString()}</span>
                </span>
            </div>
            {imageURL ? <img className='m-auto border border-solid border-tagcolor rounded-xl post-image' src={imageURL}/> : <></>}
            <PostBody data={data}/>
            <div className='m-0 w-full flex flex-row justify-evenly bg-bglight p-3'>
                <span onClick={() => {vote('l')}}>
                    <strong>{data.likes}</strong>
                    <Upvote fill={data.userVote === 'l' ? '#078350': 'white'}/>
                </span>    
                <span onClick={() => {vote('d')}}>
                    <strong>{data.dislikes}</strong>
                    <Downvote fill={data.userVote === 'd' ? '#ee0303': 'white'}/>
                </span>    
                <span>
                    <Bookmark fill={'white'}/>
                </span>    
                <span onClick={() => { navigate(`/post/${data.post_id}`)}}>
                    <CommentsIcon fill={'white'}/>
                </span>    
            </div>
    </div>
  )
}

export default GroupPost