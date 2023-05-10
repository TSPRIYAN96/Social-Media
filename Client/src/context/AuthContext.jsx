import React, {createContext, useState, useRef} from "react";

export const AuthContext = createContext();

const AuthContextProvider = (props) => {

    const [credentials, setCredentials] = useState({
                                                    username : '',
                                                    email : '',
                                                    password : ''
                                                    });

    const [authState, setAuthState] = useState(false); // Use only on specific routes

    const authValue = {

        getAuthState : () => { return authState},

        setAuthState : (newAuthState) => { setAuthState(newAuthState)},

        setUsername : (username) => {
                setCredentials(prevCredentials => ({...prevCredentials, username}));
        },

        setEmail : (email) => {
            setCredentials(prevCredentials => ({...prevCredentials, email}));
        },

        setPassword : (password) => {
            setCredentials(prevCredentials => ({...prevCredentials, password}));
        },

        // Validate Credentials - Not defined yet
        validateCredentials : () => {
            return {error : 'Error'};
        },

        getCredentials : () => {
            return {username : credentials.username};
        },

        postCredentials : (authenticationMode) => {
            console.log(authenticationMode, credentials);

            // authenticationMode -> login || signup
            
            return fetch(`http://localhost:3000/api/${authenticationMode}`, {
                method : 'POST',
                credentials: authenticationMode === 'signup' ? 'omit' : 'include',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(credentials)
            });

            
        }

    }


    return(
        <AuthContext.Provider value={authValue}>{props.children}</AuthContext.Provider>
    )

}

export default AuthContextProvider;