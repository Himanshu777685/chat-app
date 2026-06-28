import React, { useState } from 'react'
import LoginPart from '../../components/Login/LoginPart';
import Register from '../../components/Login/Register';

const Login = () => {

  const [state, setState] = useState("Login");

  return (


    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen w-full px-4 py-6">
      <div className="w-full lg:w-[45%] flex items-center justify-center mb-6 lg:mb-0">
        <img
          src="login.webp"
          className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-auto object-contain"
        />
      </div>
      <div className="w-full lg:w-[45%] flex items-center justify-center">
        {state === "Login" ? <LoginPart setState={setState} /> : <Register setState={setState} />}
      </div>

    </div>
  )
}

export default Login
