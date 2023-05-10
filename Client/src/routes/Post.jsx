import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner';
import Upvote from '../icons/Upvote';
import Downvote from '../icons/Downvote';
import Bookmark from '../icons/Bookmark';
import PostBody from '../components/PostBody';
import CommentsIcon from '../icons/CommentsIcon';
import Comments from '../components/Comments';
import NeedsAuthentication from '../components/NeedsAuthentication';
import NotFound from './NotFound';


const Post = () => {

    const{postID} = useParams();
    const navigate = useNavigate();

    const [postState, setPostState] = useState(false);
    const [is404, setIs404] = useState(false);
    const [rerender, setRerender]= useState(1); // Merely to refresh post content after a vote action
    const modalRef = useRef();

    const [data, setData] = useState({});
    const [imageURL, setImageURL] = useState(0);
    const cloudName = 'duoljv54r';

    const vote = async(vote_type) => {
        let res = await fetch(`http://localhost:3000/api/${vote_type === 'l' ? 'upvote' : 'downvote'}/post/${postID}`,{
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        res = await res.json();
        console.log(res);
        
        
        if(res.unauthorized) modalRef.current.showModal();

        setRerender(!rerender); // Forcing a re-run of useEffect

    
    }
   

    // Need not be logged in to view a random public post
    useEffect(() => {

        const retrievePostData = async() => {
            const res = await fetch(`http://localhost:3000/api/post/${postID}`,{
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            console.log(data);
            if(!data.isRetrieved){
                setIs404(true);
                return;
            } 

            data.text_content.replace(/@[a-zA-Z0-9_-]*/g, (match, index) => {
                return `<a href='/user/${match.slice(1,)}' class='text-themecolor font-semibold no-underline'>${match}</a>`
              });
            console.log(data);
            setData(data);
            if(data.img_public_id !== '0'){
                setImageURL(`https://res.cloudinary.com/${cloudName}/image/upload/${data.img_version}/${data.img_folder_name}/${data.img_public_id}`);
            }
            setPostState(true);
        }

        retrievePostData();

    }, [rerender]);

    if(is404) return <NotFound/>;

  return (
    <>
        <dialog ref={modalRef}><NeedsAuthentication message={"Sign up to cast your vote"}/></dialog>
        {!postState ? <Spinner/> : 
        <div className='border border-solid border-grayedcolor bg-bglight w-fit m-auto  min-h-fit flex flex-row gap-3 pl-3' id="post-container">
           <div className='m-auto h-full px-3 my-0 min-h-fit' id="post">
                <span className='p-5 block w-full text-left'>
                    <strong className='text-2xl' onClick={() => { navigate(`/user/@${data.username}`)}}>{data.username}</strong>
                    <span className='text-grayedcolor m-4'>{new Date(data.time_stamp).toLocaleString()}</span>
                </span>
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
                    <span>
                        <CommentsIcon fill={'white'}/>
                    </span>    
                </div>
            </div>

            <Comments postID={postID}/>


                     
        </div>
        }
    </>
  )
}

export default Post;