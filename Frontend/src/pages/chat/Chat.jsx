import React, { useContext } from 'react';
import SideBar from '../../components/SideBar/SideBar';
import ChatContainer from '../../components/ChatContainer/ChatContainer';
import { ChatContext } from '../../context/ChatContext';

const Chat = () => {

  const { selectedUser } = useContext(ChatContext);

  return (
    <div className="w-screen h-screen flex overflow-hidden">

      {/* Sidebar */}
      <div
        className={`
          w-full md:w-[35%] lg:w-[30%]
          ${selectedUser ? "hidden md:block" : "block"}
        `}
      >
        <SideBar />
      </div>

      {/* Chat Container */}
      <div
        className={`
          w-full md:w-[65%] lg:w-[70%]
          ${selectedUser ? "block" : "hidden md:block"}
        `}
      >
        <ChatContainer />
      </div>

    </div>
  );
};

export default Chat;