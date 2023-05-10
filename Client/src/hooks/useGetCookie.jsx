import React from 'react'

const useGetCookie = () => {
  return (cookieName) => {
    const cookies = document.cookie.split('; ').map(x => { return {name : x.split('=')[0], value : x.split('=')[1]}});
    for(let cookie of cookies){
        if(cookie.name === cookieName) return cookie;
    }
    return false;
  }
}

export default useGetCookie