import React, { useEffect, useState } from 'react'
import GroupPost from './GroupPost';
import Spinner from './Spinner';

const GroupPosts = ({ordering, groupname}) => {

    const [offset, setOffset] = useState(0);
    const [refetch, setRefetch] = useState(0);
    const [rerender, setRerender] = useState(0);
    const [error, setError] = useState(0);
    const [posts, setPosts] = useState([]);
    const [isFetching, setIsFetching] = useState(true);


    useEffect(() => {
        if(posts.length){
            if(ordering === 'Recent'){
                console.log('reordering recent');
                posts.sort((postA, postB) => { 
                    if(new Date(postA.time_stamp) > new Date(postB.time_stamp)) return -1;
                    else return 1
                });
            }else if(ordering === 'Popular'){
                console.log('reordering popular');
                posts.sort((postA, postB) => { 
                    if(postA.likes + postA.dislikes > postB.likes + postB.dislikes) return -1;
                    else return 1;
                });
            }
            setRerender(!rerender);
        }

    }, [ordering]);
    

  useEffect(() => {

    const fetchGroupPosts = async() => {
        const res = await fetch('http://localhost:3000/api/groupposts', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({groupname : groupname, ordering, offset})
        });
        const data = await res.json();
        console.log(data);
        setIsFetching(false);
        if(!data.isRetrieved){
            setError(1);
            return;
        }
        setPosts(data.data);

    }

    fetchGroupPosts();

  }, [refetch]);

  if(error) return <strong className='m-auto text-errorcolor font-semibold'>{"Something went wrong !!!"}</strong>

  return (
    <>
        {isFetching ? <Spinner/> :
        <section className='w-fit h-fit mx-1 px-3'>
            {posts.map((post, id) => <GroupPost key={id} 
                                                data={post} 
                                                refetch={refetch} 
                                                setRefetch={setRefetch} 
                                                rerender={rerender}
                                                setRerender={setRerender}
                                                />)}
        </section>
        }
    </>
    
  )
}

export default GroupPosts