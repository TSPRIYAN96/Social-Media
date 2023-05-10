import React, {useContext, useState} from "react";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Spinner from "../components/Spinner";

const Login = () => {

    const navigate = useNavigate();
    const {setUsername, setPassword, postCredentials, setAuthState} = useContext(AuthContext);
    const [waitingStatus, setWaitingStatus] = useState(0);
    const [error, setError] = useState({isError : false, message : ''});


    const authenticate = async() => {
        setWaitingStatus(1);
        try{
            const res = await postCredentials('login');
            const result = await res.json();
            setWaitingStatus(0);
            if(result.loggedIn){
               setAuthState(true);
                navigate('/profile');
            }else{
                 console.log(result);
                setError({isError: true, message: result.error});
             }
        }catch{
            console.log('Error');
        }
     }

   return(
    <div className = 'mt-36 h-4/6 p-10 max-w-2/3 min-w-fit bg-bglight rounded-xl'>
        
            <table className="m-auto border-separate border-spacing-4">
               <thead className="">
                  <tr>
                    <th colSpan = '3' className='text-themecolor font-bold text-4xl'>
                        Login
                    </th>
                  </tr>
               </thead>
              <tbody>
               <tr style={{'marginTop' : '10px'}}>
                     <td>
                        <label htmlFor="username"><b className="text-wcolor text-sm sm:text-base">Username : </b></label> 
                     </td>
                     <td>
                        <Input type="text" name="username" defaultValue="Username" handler={setUsername}/> 
                     </td>
                  </tr>
                  <tr style={{'marginTop' : '1em'}}>
                     <td>
                        <label htmlFor="username"><b className="text-wcolor text-sm sm:text-base">Password : </b></label> 
                     </td>
                     <td>
                        <Input type="password" password="password" defaultValue="Password" handler={setPassword}/> 
                     </td>
                  </tr>

                  <tr>
                     <td colSpan={3}>
                     <span className = 'text-red-600 font-semibold'>{error.isError ? error.message : ''}</span>
                     </td>
                  </tr>

                  <tr>
                     <td colSpan={3}>
                     {waitingStatus ? <Spinner/> : <button className="bg-themecolor rounded-3xl w-3/4 my-5" onClick={authenticate}>Login</button>}

                     </td>
                  </tr>

                  <tr>
                     <td colSpan={3}>
                        <span className="text-wcolor font-bold mr-4">Don't have an account?
                        </span>
                        <b className="text-themecolor underline hover:cursor-pointer" onClick={() => {navigate('/signup')}}>Signup</b>
                     </td>
                  </tr>


               </tbody>
            
               
            </table>
    </div>
   )
}

export default Login;