import React, { useContext, useEffect, useRef, useState } from 'react'
import NeedsAuthentication from '../components/NeedsAuthentication';
import { AuthContext } from '../context/AuthContext';
import useAuthorize from '../hooks/useAuthorize';
import Spinner from '../components/Spinner';
import axios from 'axios'
import Tag from '../components/Tag';
import {Link, useNavigate } from 'react-router-dom';
import GroupTag from '../components/GroupTag';


const LinkField = ({id, setPostData, postData}) => {

  const updateField = (e, id) => {
    const links = postData.links;
    links[id] = e.target.value;
    setPostData(prevData => { return {...prevData, links}});
  }

  return(
    <input className='block m-3 p-1 text-center rounded-xl' type="text" onChange={(e) => {updateField(e, id)}}/>
  )
}


const TagField = ({id, setPostData, postData}) => {

  const updateField = (e, id) => {
    const tags = postData.tags;
    tags[id] = e.target.value;
    setPostData(prevData => { return {...prevData, tags}});
  }

  return(
    <input className='block m-3 p-1 text-center rounded-xl' type="text" onChange={(e) => {updateField(e, id)}}/>
  )
}

const NewPost = () => {

  // Below couple of lines are pretty standard in all routes that require authorization for access
  const authorize = useAuthorize();
  const {getCredentials, getAuthState : isAuthorized, setAuthState} = useContext(AuthContext);
  const [isAuthorizing, setIsAuthorizing] =  useState(true);

  const [postStatus, setPostStatus] = useState({status : '', isPosted : false});
  // const navigate = useNavigate();
  const addGroupsRef = useRef();
  const [userGroups, setUserGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
 
  const [postData, setPostData] = useState({
                                            image : '',
                                            text: '',
                                            links: [],
                                            tags: []
                                          })

  const [image, setImage] = useState(undefined);
  const inputRef = useRef();
  const imgRef = useRef();
  const postTextRef = useRef();
  const cloudName = 'duoljv54r';
  const BACKEND_API_URL = `http://localhost:3000/api/newpost`;

  const addLink = () => {
    console.log(postData);
    setPostData(prevState => { return {...prevState, links : [...prevState.links, '']} })
  }

  const addTag = () => {
    console.log(postData);
    setPostData(prevState => { return {...prevState, tags : [...prevState.tags, '']} })
  }

  const sendDataToServer = async (res) => {
    
    
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
        text : postData.text,
        links: postData.links, 
        tags : postData.tags});

      res = await fetch(`${BACKEND_API_URL}/make_post`, {
        method : 'POST',
        credentials: 'include',
        headers: {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify({img_version: imgData[0],
                               img_folder_name: imgData[1],
                               img_public_id : imgData[2], 
                               text_content : postData.text,
                               links: postData.links, 
                               tags : postData.tags,
                               groups: selectedGroups.filter(group => { return group !== undefined})})
      });

      res = await res.json();
      setPostStatus(res);

    }catch(err){
      console.log("Something went wrong", err);
    }
  }



  const updateImagePreview = (e) => {
    const file = inputRef.current.files[0];
    imgRef.current.src = URL.createObjectURL(file);
    setImage(1);
  }

  const makePost = async() => {
    if(image){

      const file = inputRef.current.files[0];
      const formData = new FormData();
      formData.append('file', file)
      formData.append('upload_preset', 'cd70zixl');
  
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

  const populatePostText = (e) => {
    setPostData(prevData => {return {...prevData, text: e.target.value}});
    const regexp = /@[a-zA-Z0-9_-]*/g;
    postTextRef.current.innerHTML = e.target.value.replace(regexp, (match, index) => {
      return `<a href='/user/${match.slice(1,)}' class='text-tagcolor font-semibold no-underline'>${match}</a>`
    }).replace(/&[a-zA-Z0-9_-]*/g, (match, ind) => {
      return `<a href='/group/${match.slice(1,)}' class='text-groupcolor font-semibold no-underline'>${match}</a>`;
    })
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

    const getUserGroups = async() => {
      const res = await fetch(`${BACKEND_API_URL}/usergroups`, {
        method : 'POST',
        credentials: 'include',
        headers: {
          'Content-Type' : 'application/json'
        }
      });

      const data = await res.json();
      if(!data.isFetched){
        setUserGroups(['Something went wrong']);
      }
      setSelectedGroups(new Array(data.groups.length).fill(undefined));
      setUserGroups(data.groups);
    }

    
    checkAuthorization();
    getUserGroups();

  }, []);


  return (
    <>
    {!isAuthorized() ?
        (isAuthorizing ? <Spinner/> : <NeedsAuthentication/>) :
        <div className='my-20 w-full'>

          <section className = 'w-full flex flex-row justify-evenly gap-5' id="new-post">
            <table className='mx-10 w-1/2 border-separate border-spacing-10' id="post-data">
              <tr>
                <th colSpan={3}><strong className = 'text-3xl'>NEW POST</strong></th>
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
                    <strong>Textual Content :</strong>
                </td>
                <td colSpan={2}>
                    <textarea className='bg-bglight outline-none w-full m-6 p-2' onChange={populatePostText}></textarea>
                </td>
              </tr>

              <tr>
                <td>
                  <strong>Links : </strong>
                </td>
                <td className='flex flex-col justify-center items-center hover:bg-bglight p-3'>
                  {postData.links.map((link, id) => <LinkField key={id} id={id} setPostData = {setPostData} postData = {postData}/>)}
                  <button onClick={addLink}> + Add Link</button>
                </td>
              </tr>

              <tr>
                <td>
                  <strong>Tagged : </strong>
                </td>
                <td className='flex flex-col justify-center items-center hover:bg-bglight p-3'>
                  {postData.tags.map((tag, id) => <TagField key={id} id={id} setPostData = {setPostData} postData = {postData}/>)}
                  <button onClick={addTag}> + Add Tag @</button>
                </td>
              </tr>

              <tr>
                <td>
                  <strong>Groups : </strong>
                </td>
                <td className='flex flex-col justify-center items-center hover:bg-bglight p-3'>
                  <button onClick={() => {addGroupsRef.current.showModal()}} title="Post this post to the selected groups">Pick groups to post</button>
                </td>
              </tr>

              <tr>
                <td colSpan={3}>
                  <button className= 'w-2/3 rounded-3xl m-5' onClick={makePost}>Post</button>
                </td>
              </tr>



            </table>

            <div className='border border-solid border-tagcolor w-1/3 h-fit bg-bglight p-2' id="preview-post">
              <strong className='text-3xl'>Preview</strong>
              <div className='w-full h-fit my-5 flex flex-col justify-center items-center gap-3'>
                <img ref={imgRef} className={`${image ? 'w-5/6' : 'w-0'} aspect-[15/16] mb-4 rounded-lg border-2 border-solid border-themecolor`}></img>
                <div className='w-5/6 h-fit text-xl text-left text-clip' ref={postTextRef}></div>
                <div className='w-5/6 text-left'>
                 {postData.links.map((link, id) => <a target="_blank" className='block' href={link} key={id}>{link}</a>)}
                </div>
                <div className='w-5/6 text-left'>
                  {postData.tags.map((tag, id) => <Tag  key={id} tagName={tag}/>)}
                </div>

              </div>

              {!postStatus.isPosted ?
               <strong className={`text-2xl text-red-500`}>{postStatus.status}</strong>
               : <strong className={`text-2xl ${!postStatus.isPosted ? 'text-red-500' : 'text-white'}`}>
                  {postStatus.status} <Link to={`/post/${postStatus.post_id}`}>Check post</Link>
                  </strong>
              }
            </div>
          </section>

          <dialog ref={addGroupsRef}>
              <div className='p-3 text-left h-max-[30vh] overflow-y-scroll'>
                <strong className='block w-full text-2xl text-center mb-4'>Pick Groups</strong>
                {userGroups.map((group, id) => 
                    <div className='m-2' key={id}>
                      <input type="checkbox"
                             name={group.groupname} 
                             onChange={(e) => {
                                setSelectedGroups(prevState => {
                                     const updatedState = prevState.map((x, ind) => {
                                      if(ind === id){
                                        return e.target.checked ? group.groupname : undefined;
                                      }else{
                                        return x;
                                      }
                                     });
                                     return updatedState;
                                })
                              }}
                      />
                      <label className='m-2' htmlFor={group.groupname}>{group.groupname}</label>
                      <GroupTag tagName={group.groupname}/>
                    </div>
                )}
              </div>
              <button type="button" onClick={() => {addGroupsRef.current.close(); console.log(selectedGroups)}}>Done</button>
          </dialog>

        </div>
    }

    </>
  )
}

export default NewPost;