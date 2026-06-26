import React, { useContext } from 'react'
import SideBar from '../../components/SideBar/SideBar'
import ChatContainer from '../../components/ChatContainer/ChatContainer'
import EmptyState from '../../components/ChatContainer/EmptyState'
import { ChatContext } from '../../context/ChatContext'

const Chat = () => {

  const {selectedUser} = useContext(ChatContext);

  return (
    <div className='flex items-center w-screen h-screen'>
      <SideBar />
      <ChatContainer/>
      
      
        
        

        

    </div>
  )
}

export default Chat
