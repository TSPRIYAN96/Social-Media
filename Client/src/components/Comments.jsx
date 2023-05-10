import React, { useEffect, useState } from 'react';
import NewComment from './NewComment';
import Comment from './Comment';
import Spinner from './Spinner';


const Comments = ({postID}) => {

 const [isPostingComment, setIsPostingComment] = useState(false);
 const [isFetchingComments, setIsFetchingComments] = useState(true);
 const [comments, setComments] = useState(null);


  useEffect(() => {

    const fetchComments = async() => {
        let res = await fetch(`http://localhost:3000/api/comments/${postID}`);
        res = await res.json();
        console.log(res);
        setComments(res);
        setIsFetchingComments(false);
    }

    fetchComments();

  }, [isPostingComment]);


  return (
    <>
        
        <div  className='border-l border-solid border-grayedcolor' id="comments">
            <strong className='text-2xl block'>Comments</strong>
            {isFetchingComments && <Spinner/>}
            {!isFetchingComments && 
                <>
                    <NewComment postID={postID} isPostingComment={isPostingComment} setIsPostingComment={setIsPostingComment}/>
                    {(comments && comments.comments.length) ? comments.comments.map((x, id) => <Comment key={id} commentData={comments.comments[id]} id={id}/>) : 'No Comments yet'}
                </>}
        </div>
    
    </>
    
  )
}

export default Comments