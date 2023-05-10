import React, { useContext, useEffect, useState } from 'react'
import NeedsAuthentication from '../components/NeedsAuthentication';
import { AuthContext } from '../context/AuthContext';
import useAuthorize from '../hooks/useAuthorize';
import Spinner from '../components/Spinner';


function Profile() {

  // Below couple of lines are pretty standard in all routes that require authorization for access
  const authorize = useAuthorize();
  const {getCredentials, getAuthState : isAuthorized, setAuthState} = useContext(AuthContext);
  const [isAuthorizing, setIsAuthorizing] =  useState(true);

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
    <>{!isAuthorized() ?
        (isAuthorizing ? <Spinner/> : <NeedsAuthentication/>) :
        <div>Code for Profile Component</div>
    }

    </>
  )
}

export default Profile;