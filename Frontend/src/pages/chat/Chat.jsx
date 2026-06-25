import React from 'react'
import SideBar from '../../components/SideBar/SideBar'
import ChatContainer from '../../components/ChatContainer/ChatContainer'

const Chat = () => {
  return (
    <div className='flex items-center w-screen h-screen'>
      <SideBar />
      <ChatContainer />
    </div>
  )
}

export default Chat
