import React, { useContext, useState } from "react";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Spinner from "../components/Spinner";

const Signup = () => {

   const navigate = useNavigate();
   const {setUsername, setEmail, setPassword, postCredentials} = useContext(AuthContext);
   const [waitingStatus, setWaiting] = useState(0);
   const [error, setError] = useState({isError : false, message : ''});

   const authenticate = async() => {
      setWaiting(1);
      try{
         const res = await postCredentials('signup');
         const result = await res.json();
         console.log(result);
         setWaiting(0);
         if(result.signedIn){
            navigate('/login');
         }else{
            setError({isError: true, message: result.error});
         }
      }catch{
         console.log('Error');
      }
   }

   return(
    <div className = 'mt-32 h-3/4 p-10 max-w-1/2 min-w-fit bg-bglight rounded-xl'>
        
            <table className="m-auto border-separate border-spacing-4">
               <thead className="">
                  <tr>
                     <th colSpan = '3' className='text-themecolor font-bold text-4xl my-5'>
                        Signup
                     </th>
                  </tr>
               </thead>
              <tbody>
               <tr style={{'marginTop' : '10px'}}>
                     <td>
                        <label htmlFor="username"><b className="text-wcolor">Username : </b></label> 
                     </td>
                     <td>
                        <Input type="text" name="username" defaultValue="Username" handler={setUsername}/> 
                     </td>
                  </tr>
                  <tr style={{'marginTop' : '1em'}}>
                     <td>
                        <label htmlFor="username"><b className="text-wcolor">Email : </b></label> 
                     </td>
                     <td>
                     <Input type="text" name="email" defaultValue="Email" handler={setEmail}/> 
                     </td>
                  </tr>
                  <tr style={{'marginTop' : '1em'}}>
                     <td>
                        <label htmlFor="username"><b className="text-wcolor">Password : </b></label> 
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
                     {waitingStatus ? <Spinner/> : <button className="bg-themecolor rounded-3xl w-3/4 my-5" onClick={authenticate}>Signup</button>}
                     </td>
                  </tr>

                  <tr>
                     <td colSpan={3}>
                        <span className="text-wcolor font-bold mr-4">Already have an account?
                        </span>
                        <b className="text-themecolor no-underline hover:cursor-pointer" onClick={() => {navigate('/login')}}>Login</b>
                     </td>
                  </tr>


               </tbody>
            
               
            </table>
    </div>
   )
}

export default Signup;