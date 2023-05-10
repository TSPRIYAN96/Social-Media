import React from "react";

// A custom hook for authorizing users before accessing sensitive pages
const useAuthorize = () => {
    return (authData) => {
        return fetch('http://localhost:3000/api/authorize', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(authData)
        })

    }
}

export default useAuthorize;