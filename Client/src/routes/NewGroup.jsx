import React, {useEffect, useState, useContext, useRef} from 'react'
import useAuthorize from '../hooks/useAuthorize';
import { AuthContext } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import NeedsAuthentication from '../components/NeedsAuthentication';
import Tag from '../components/Tag';
import Input from '../components/Input';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TagField = ({id, setGroupData, groupData}) => {

    const updateField = (e, id) => {
      const tags = groupData.tags;
      tags[id] = e.target.value;
      setGroupData(prevData => { return {...prevData, tags}});
    }
  
    return(
      <input className='block m-3 p-1 text-center rounded-xl' type="text" onChange={(e) => {updateField(e, id)}}/>
    )
  }

const NewGroup = () => {

    // Below couple of lines are pretty standard in all routes that require authorization for access
    const authorize = useAuthorize();
    const {getCredentials, getAuthState : isAuthorized, setAuthState} = useContext(AuthContext);
    const [isAuthorizing, setIsAuthorizing] =  useState(true);
    const [groupStatus, setGroupStatus] =  useState(false);

    const [groupData, setGroupData] = useState({
        description: '',
        groupType: '',
        groupname: '',
        tags: []
      })

    const [image, setImage] = useState(undefined);
    const inputRef = useRef();
    const imgRef = useRef();
    const cloudName = 'duoljv54r';
    const BACKEND_API_URL = `http://localhost:3000/api/newgroup`;


    const addTag = () => {
        console.log(groupData);
        setGroupData(prevState => { return {...prevState, tags : [...prevState.tags, '']} })
    }

    const updateImagePreview = (e) => {
        setImage(1);
    
    }

    const sendDataToServer = async (res) => {

        console.log(groupData);
        // return;
    
        try{
          let imgData;
          if(res){
            console.log(res.data.url.split('upload/'));
            imgData = res.data.url.split('upload/')[1].split('/');
          }else{
            imgData = [0, 0, 0]
          }
    
          console.log({version: imgData[0],
            folderName: imgData[1],
            publicID : imgData[2], 
            description : groupData.description,
            groupType : groupData.groupType,
            tags : groupData.tags});

        console.log(`${BACKEND_API_URL}/make_group`);
    
          res = await fetch(`${BACKEND_API_URL}/make_group`, {
            method : 'POST',
            credentials: 'include',
            headers: {
              'Content-Type' : 'application/json'
            },
            body : JSON.stringify({img_version: imgData[0],
                                   img_folder_name: imgData[1],
                                   img_public_id : imgData[2], 
                                   groupname : groupData.groupname,
                                   description : groupData.description,
                                   groupType : groupData.groupType,
                                   tags : groupData.tags})
          })
    
          res = await res.json();
          console.log(res);
          setGroupStatus(res);
    
        }catch(err){
          console.log("Something went wrong", err);
        }
      }
    
      const createGroup = async() => {
        
        if(image){
    
          const file = inputRef.current.files[0];
          const formData = new FormData();
          formData.append('file', file)
          formData.append('upload_preset', 'kk2txzfv');
      
          const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, formData)
          .then(res => sendDataToServer(res))
          .catch(err => console.log(err));
        }else{
          sendDataToServer(0);
        }
      }
    
      // Add a proper way to remove and re-add images
      const removeImage = () => {
        imgRef.current.src = null;
        console.log(inputRef.current.files);
        inputRef.current.files = null;
        console.log(inputRef.current.files);
        setImage(0);
      }

    useEffect(() => {

        const checkAuthorization = async() => {
          
          if(!isAuthorized()){
            const res = await authorize(getCredentials());
            const authStatus = await res.json();
            if(authStatus.isAuthorized) setAuthState(true);
            console.log(authStatus, isAuthorized);
          }
          setIsAuthorizing(false);
          
        }
    
        
        checkAuthorization();
    
    
      }, []);


    return (
        <>
        {!isAuthorized() ?
            (isAuthorizing ? <Spinner/> : <NeedsAuthentication/>) :
            <div className='my-20 w-full'>
    
              <section className = 'w-full flex flex-row justify-evenly gap-5' id="new-group">
                <table className='m-10 w-1/2 border-separate border-spacing-10' id="group-data">
                  <tr>
                    <th colSpan={3}><strong className = 'text-3xl'>NEW GROUP</strong></th>
                  </tr>

                    <tr>
                        <td>
                            <strong>Group Name :</strong>
                        </td>
                        <td colSpan={2}>
                            <Input 
                                handler={(groupname) => {setGroupData(prevData => {return {...prevData, groupname: groupname}})}}/>
                            
                        </td>
                    </tr>
             
                  <tr>
                    <td>
                      <strong>Image :</strong>
                    </td>
                    <td colSpan={2} className='hover:bg-bglight'>
                      <form id="upload-form" className='border-solid border-bglight border rounded -xl p-4 m-6' onChange={updateImagePreview}>
                        <input id="file-field" type="file" ref={inputRef}/>
                      </form>
                      <button onClick={removeImage}>Remove Image</button>
                    </td>
                  </tr>
    
                  <tr>
                    <td>
                        <strong>Group Description :</strong>
                    </td>
                    <td colSpan={2}>
                        <textarea 
                            className='bg-bglight outline-none w-full m-6 p-2' 
                            onChange={(e) => {setGroupData(prevData => {return {...prevData, description: e.target.value}})}}>
                         </textarea>
                    </td>
                  </tr>
    
                  <tr>
                    <td>
                      <strong>Group Type : </strong>
                    </td>
                    <td className='flex flex-col justify-center items-center hover:bg-bglight p-3'>
                      <form className='flex flex-row justify-evenly gap-3'>
                        <label htmlFor="public">Public</label>
                        <input type="radio" name="group-type" onChange={() => {setGroupData(prevData => {return {...prevData, groupType: 'public'}})}}/>
                        <label htmlFor="public">Private</label>
                        <input type="radio" name="group-type"onChange={() => {setGroupData(prevData => {return {...prevData, groupType: 'private'}})}}/>
                      </form>
                    </td>
                  </tr>
    
                  <tr>
                    <td>
                      <strong>Add members : </strong>
                    </td>
                    <td className='flex flex-col justify-center items-center hover:bg-bglight p-3'>
                      {groupData.tags.map((tag, id) => <TagField key={id} id={id} setGroupData = {setGroupData} groupData = {groupData}/>)}
                      <button onClick={addTag}> + Add Tag @</button>
                    </td>
                  </tr>
    
                  <tr>
                    <td colSpan={3}>
                      <button className= 'w-2/3 rounded-3xl m-5' onClick={createGroup}>Create Group</button>
                    </td>
                  </tr>
    
    
    
                </table>
                
                {!groupData.tags.length ? <></> : <div className='border border-solid border-tagcolor w-1/3 h-fit bg-bglight p-2' id="preview-group">
                    <strong className='text-3xl'>Members (Provisional)</strong>
                    <div className='w-full text-left flex flex-col text-2xl justify-evenly'>
                    {groupData.tags.map((tag, id) => <span className='border-b border-grayedcolor p-3'  key={id}><Tag tagName={tag}/></span>)}
                    </div>
                    {!groupStatus.isCreated ?
                   <strong className={`text-2xl text-red-500`}>{groupStatus.status}</strong>
                   : <strong className={`text-2xl ${!groupStatus.isPosted ? 'text-red-500' : 'text-white'}`}>
                      {groupStatus.status} <Link to={`/group/${groupStatus.groupname}`}>View Group</Link>
                      </strong>
                  }
                </div>}
    
                {/* <div className='border border-solid border-tagcolor w-1/3 h-fit bg-bglight p-2'>
                  <div className='w-full h-fit my-5 flex flex-col justify-center items-center gap-3'>
                    <img ref={imgRef} className={`${image ? 'w-5/6' : 'w-0'} aspect-[15/16] mb-4`}></img>
                    <div className='w-5/6 h-fit text-xl text-left text-clip' ref={postTextRef}></div>
                    <div className='w-5/6 text-left'>
                     {groupData.links.map((link, id) => <a target="_blank" className='block' href={link} key={id}>{link}</a>)}
                    </div>
    
                  </div>
    
                  {!postStatus.isPosted ?
                   <strong className={`text-2xl text-red-500`}>{postStatus.status}</strong>
                   : <strong className={`text-2xl ${!postStatus.isPosted ? 'text-red-500' : 'text-white'}`}>
                      {postStatus.status} <Link to={`/post/${postStatus.post_id}`}>Check post</Link>
                      </strong>
                  }
                </div> */}
              </section>
    
            </div>
        }
    
        </>
    )
}

export default NewGroup