import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Notifications from '../components/Notifications';
import groupImage from '../../public/network.png';
import NotFound from './NotFound';
import Spinner from '../components/Spinner';
import NeedsAuthentication from '../components/NeedsAuthentication';
import GroupTag from '../components/GroupTag';
import SmartText from '../components/SmartText';
import Tag from '../components/Tag';
import Input from '../components/Input';
import SmallSpinner from '../components/SmallSpinner';
import AddUser from '../icons/AddUser';
import RemoveUser from '../icons/RemoveUser';
import AddPost from '../icons/AddPost';
import ViewGroupMembers from '../icons/ViewGroupMembers';
import GroupPosts from '../components/GroupPosts';
import Search from '../components/Search';

const Group = () => {

  const {groupname} = useParams();
  const [is404, setIs404] = useState(false);
  const modalRef = useRef();
  const addMemberRef = useRef();
  const removeMemberRef = useRef();
  const groupMembersRef = useRef();
  const navigate = useNavigate();

  const [fetchingState, setFetchingState] = useState(true);
  const [groupData, setGroupData] = useState(null);
  const [groupPostsOrdering, setgroupPostsOrdering] = useState('Recent');
  const [newMember, setNewMember] = useState('');
  const [addToGroupError, setAddToGroupError] = useState('');
  const [removeFromGroupError, setRemoveFromGroupError] = useState('');
  const [rerender, setRerender] = useState(0);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  const handleAddMember = () => {
      setAddToGroupError('');
      setNewMember('');
      addMemberRef.current.showModal();
  }

  const handleRemoveMember = () => {
    setRemoveFromGroupError('');
    setNewMember('');
    removeMemberRef.current.showModal();
    
  }


  const addMember = async() => {
    setFetchingState(true);
    let res = await fetch(`http://localhost:3000/api/add/member`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({memberName: newMember, groupname, groupType: groupData.group_type})
    });
    res = await res.json();
    setFetchingState(false);

    if(!res.isAdded){
      setAddToGroupError(res.status);
      return;
    }
    addMemberRef.current.close();
    setRerender(!rerender);
  }
  
  const removeMember = async() => {
    setFetchingState(true);
    let res = await fetch(`http://localhost:3000/api/remove/member`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({memberName: newMember, groupname, groupType: groupData.group_type})
    });
    res = await res.json();
    setFetchingState(false);
    
    if(!res.isRemoved){
      setRemoveFromGroupError(res.status);
      return;
    }
    removeMemberRef.current.close();
    setRerender(!rerender);
    
  }


  

  useEffect(() => {
    
    const fetchGroupData = async() => {
      const res = await fetch(`http://localhost:3000/api/group/${groupname}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await res.json();
      data.img_version = data.img_version === '0' ? undefined : data.img_version;
      data.imageURL = `https://res.cloudinary.com/duoljv54r/image/upload/${data.img_version}/${data.img_folder_name}/${data.img_public_id}`;
      setFetchingState(false);

      if(data.isNotFound) setIs404(true);
      if(data.unauthorized){
        setIsUnauthorized(true);
        modalRef.current.close();
        modalRef.current.showModal();
        return;
      }
      console.log(data);
      setGroupData(data);

    }

    fetchGroupData();


  }, [rerender]);

  if(is404) return <NotFound/>
  if(isUnauthorized) return <NeedsAuthentication message={'Sign up to join groups'}/>

  return (
    <div className='w-[98vw] h-full my-10 mx-2'>
      <dialog ref={modalRef}><NeedsAuthentication message={'Sign up to join groups'}/></dialog>

      <dialog ref={addMemberRef}>
        <div className='p-4' style={{maxWidth: '400px', minWidth: '400px'}}>
          <Input handler={(newMember) => {setNewMember(newMember)}}/>
          <strong className='text-errorcolor block'>{addToGroupError}</strong>
          {newMember && <strong>Add <Tag tagName={newMember}/></strong>}
          {fetchingState ? <SmallSpinner/> :
            <div>
              <button type="button" className='m-3' onClick={addMember}>Add</button>
              <button type="button" style={{background: 'grey'}} onClick={() => {addMemberRef.current.close()}}>Cancel</button>
            </div>
          }
        </div>
      </dialog>

      <dialog ref={removeMemberRef}>
        <div className='p-4' style={{maxWidth: '400px', minWidth: '400px'}}>
          <Input handler={(newMember) => {setNewMember(newMember)}}/>
          <strong className='text-errorcolor block'>{removeFromGroupError}</strong>
          {newMember && <strong>Remove <Tag tagName={newMember}/></strong>}
          {fetchingState ? <SmallSpinner/> :
            <div>
              <button type="button" className='m-3' style={{background: '#ef4444'}} onClick={removeMember}>Remove</button>
              <button type="button" style={{background: 'grey'}} onClick={() => {removeMemberRef.current.close()}}>Cancel</button>
            </div>
          }
        </div>
      </dialog>

      

      
      {fetchingState ? <Spinner/> : 
        <section className='w-full flex flex-col items-start pl-3'>
          <div className='my-8 text-left h-fit'>
            <strong className='text-3xl'>{groupname}</strong>
            <GroupTag tagName={groupname}/>
          </div>
          <div className='w-full flex flex-row items-center gap-3'>
            {groupData.img_version 
                ? <img className='mr-4 rounded-full p-2 text-center border-groupcolor border-4 m-0 w-fit h-fit' src={groupData.imageURL}/>
                : <img src={groupImage} className='mr-4 rounded-full p-2 text-center border-groupcolor border-4 m-0 invert' style={{width: '200px', height: '200px', borderColor: '#009fff'}} alt="grp-img"/>  
            }
            
            <div className='w-full mx-7 text-xl text-left space-y-2'>
              <span className='w-full block text-xl'> <SmartText text={groupData.description}/> </span>
              <span className='w-full block text-grayedcolor'> {new Date(groupData.created_at).toLocaleString()} </span>
              <span className='w-full block font-semibold'>Members : {groupData.member_count}</span>
              <span className='w-full block font-semibold'>Owned By : <Tag tagName={groupData.owner_name}/></span>
              <div className='w-fit flex flex-row flex-wrap text-3xl gap-5 items-center'>
                  {groupData.isOwner &&<span title="Add member" onClick={handleAddMember}><AddUser/></span>}
                  {groupData.isOwner && <span title="Remove member" onClick={handleRemoveMember}><RemoveUser/></span>}
                  <span title="New Post" onClick={() => {navigate('/new/post')}}><AddPost/></span>
                  <span title="View Members" onClick={() => {groupMembersRef.current.show()}}><ViewGroupMembers/></span>
              </div>
            </div>
          
          </div>

          <div className='w-full my-10 flex flex-row justify-evenly gap-10'>
            <div className='w-fit max-w-[600px]  mx-5 items-start'>
              <strong className='text-2xl'>POSTS</strong>
              <div className='w-full mt-4 mb-1 font-semibold p-1 border-b-2 border-grayedcolor'>
                <span 
                    className= {`inline-block w-1/2 px-3 text-center ${groupPostsOrdering !== 'Recent' && 'text-grayedcolor'}`}
                    onClick={() => {setgroupPostsOrdering('Recent')}}
                >Recent</span>
                <span 
                    className= {`inline-block w-1/2 px-3 text-center ${groupPostsOrdering !== 'Popular' && 'text-grayedcolor'}`}
                    onClick={() => {setgroupPostsOrdering('Popular')}}
                >Popular</span>
              </div>
                <GroupPosts ordering={groupPostsOrdering} groupname={groupname}/>
             </div>

             <Search/>

             <dialog ref={groupMembersRef}>
                <div className='w-1/3 h-fit text-lg border border-solid border-grayedcolor p-4 rounded-lg' style={{minWidth: '400px', maxWidth: '500px'}}>
                      <div className='w-full border-b-4 border-grayedcolor p-2'>
                        <strong className='py-3 text-3xl'>Members</strong>
                      </div>
                      <div className='max-h-[30vh] overflow-y-scroll bg-[#1e1d1dad]'>

                        {groupData.users.map((user, id) => 
                            <div className='text-start px-4 pl-7 py-1 my-5' key={id}>
                              <span className='text-xl'>{id+1}.</span>
                              <span className='text-xl mx-2' onClick={() => {navigate(`/user/${user.username}`)}}>{user.username}</span>
                              <Tag tagName={user.username}/>
                            </div>
                        )}

                      </div>
                      <button className='m-2' type="button" onClick={() => {groupMembersRef.current.close()}}>close</button>
                  </div>
              </dialog>
             
             
          </div>

        </section>

      }
    </div>
  )
}

export default Group;