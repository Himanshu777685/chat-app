import React, { useState } from 'react'
import LoginPart from '../../components/Login/LoginPart';
import Register from '../../components/Login/Register';

const Login = () => {

  const[state , setState] = useState("Login");

  return (


    <div className='flex flex-row items-center justify-center  h-screen w-full '>

        <div className=' h-[80%] w-[40%] flex flex-col items-center justify-center '>
          <img src="login.webp" className=" object-contain"   className="w-[70vw] h-auto object-contain"></img>
        </div>
        <div className=' h-[80%] w-[40%] flex flex-col items-center justify-center '>
         {state === "Login" ? <LoginPart setState = {setState} /> :  <Register  setState = {setState} />}
        </div>
        
    </div> 
  )
}

export default Login
