import React from 'react'


const ChatContainer = () => {

  const selectedUser = {
    id: "alice",
    name: "Alice Johnson",
    avatar: "https://i.pravatar.cc/150?img=1",
    bio: "Frontend Developer",
    online: true,
  };

  const messages = [
    {
      id: 1,
      senderId: "alice",
      text: "Hey! How's your chat app going?",
      time: "10:30 AM",
    },
    {
      id: 2,
      senderId: "user",
      text: "Pretty good. Just finished the sidebar.",
      time: "10:31 AM",
    },
    {
      id: 3,
      senderId: "alice",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      time: "10:32 AM",
    },
    {
      id: 4,
      senderId: "user",
      text: "Yep, currently designing message bubbles.",
      time: "10:33 AM",
    },
    {
      id: 5,
      senderId: "alice",
      text: "Don't forget auto-scroll later.",
      time: "10:34 AM",
    },
    {
      id: 6,
      senderId: "user",
      text: "Haha, that's on my checklist.",
      time: "10:35 AM",
    },
    {
      id: 7,
      senderId: "alice",
      text: "Are you using React state for selected chats?",
      time: "10:36 AM",
    },
    {
      id: 8,
      senderId: "user",
      text: "Not yet, currently using dummy data.",
      time: "10:37 AM",
    },
    {
      id: 9,
      senderId: "alice",
      text: "That's fine. Build the UI first.",
      time: "10:38 AM",
    },
    {
      id: 10,
      senderId: "user",
      text: "Exactly my plan.",
      time: "10:39 AM",
    },
    {
      id: 11,
      senderId: "alice",
      text: "Looks like you're making good progress 🚀",
      time: "10:40 AM",
    },
    {
      id: 12,
      senderId: "user",
      text: "Thanks! Hopefully I'll finish the UI today.",
      time: "10:41 AM",
    },
  ];

  return (
    <div className='h-full w-full flex flex-col border border-black bg-cover bg-center bg-no-repeat' style={{ backgroundImage: "url('/bg_chat2.jpg')" }}>

      <div className='flex items-center px-1 h-[7%] w-full justify-between bg-blue-50'>

        <div className='flex items-center  gap-3'>
          <div className='relative ml-4 '>
            <img src={selectedUser.avatar} alt={selectedUser.id} className=' h-12 w-12 rounded-full ' />
            {selectedUser.online && <div className='absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-400 border-3 border-blue-50'></div>}
          </div>

          <div className='font-semibold text-lg '>{selectedUser.name}</div>
        </div>

        <img
          src="info_icon.png"
          className='mr-5 h-10 w-10 cursor-pointer' />

      </div>


      {/* CHAT AREA */}

      <div className='flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4'>

        {
          messages.map((message) => (
            <div key={message.id}>

              {message.senderId === selectedUser.id ?

                (<div className="flex items-start gap-2">
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="h-8 w-8 rounded-full"
                  />

                  <div className="max-w-[70%] bg-white px-4 py-2 rounded-2xl rounded-tl-sm shadow">
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Shared image"
                        className="max-w-full rounded-lg mb-2"
                      />
                    )}

                    {message.text && <p>{message.text}</p>}
                    <span className="text-xs text-gray-500">{message.time}</span>
                  </div>
                </div>)
                :

                (<div className="flex justify-end">
                  <div className="max-w-[70%] bg-blue-500 text-white px-4 py-2 rounded-2xl rounded-tr-sm shadow">
                    <p>{message.text}</p>
                    <span className="text-xs text-blue-100">
                      {message.time}
                    </span>
                  </div>
                </div>)}

            </div>
          ))
        }

      </div>


      {/* footer section (message typing area) */}

      <div className='rounded-3xl flex mb-3 items-center  self-center bg-blue-100 border h-[6%] w-[98%]'>

        <label htmlFor="file">
          <img
            src='attachment_icon.png'
            className='h-10 w-10 mx-2 cursor-pointer' />

        </label>

        <input
          id="file"
          type="file"
          hidden
        />

        <input
          type="text"
          placeholder="Type a message..."
          className='flex-1 h-[80%] outline-none'
        />

        <button>
          <img src='send_icon.png'
            className='h-8 w-8 mx-5 cursor-pointer ' />
        </button>

      </div>



    </div>
  )
}

export default ChatContainer
