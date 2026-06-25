import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/login/Login'
import Chat from './pages/chat/Chat'
import ProfileUpdate from './pages/profileUpdate/ProfileUpdate'

import {Toaster} from "react-hot-toast";
import { AuthContext } from './context/AuthContext'

const App = () => {
  const {authUser} = useContext(AuthContext);
  return (
    <>
    <Toaster/>
      <Routes>
        <Route path='/' element = {!authUser ? <Login /> : <Navigate to = '/chat'/>} />
        <Route path='/chat' element = {authUser ? <Chat/> : <Navigate to = '/'/>} />
        <Route path='/profile' element = {authUser ? <ProfileUpdate/> : <Navigate to = '/'/>} />
      </Routes>
    </>
  )
}

export default App
