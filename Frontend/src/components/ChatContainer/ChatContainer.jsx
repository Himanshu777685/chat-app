import React, { useContext, useEffect, useRef, useState } from 'react'
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const MAX_IMAGE_SIZE_MB = 5;

const ChatContainer = () => {

    const scrollEnd = useRef(null);
    const { messages, selectedUser, sendMessage, getMessages, isLoadingMessages } = useContext(ChatContext);
    const { authUser , onlineUser} = useContext(AuthContext);

    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() === "" || isSending) return;

        setIsSending(true);
        try {
            await sendMessage({ text: input.trim() });
            setInput("");
        } finally {
            // ✅ always resets even if sendMessage throws
            setIsSending(false);
        }
    }

    const handleSendImage = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith("image/")) {
            toast.error("Select an image file");
            return;
        }

        // ✅ file size guard
        if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
            toast.error(`Image must be under ${MAX_IMAGE_SIZE_MB}MB`);
            e.target.value = "";
            return;
        }

        // ✅ same isSending guard as text
        if (isSending) return;
        setIsSending(true);

        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                await sendMessage({ image: reader.result });
            } finally {
                setIsSending(false);
                e.target.value = "";
            }
        }
        reader.onerror = () => {
            toast.error("Failed to read image");
            setIsSending(false);
            e.target.value = "";
        }
        reader.readAsDataURL(file);
    }

    useEffect(() => {
        if (selectedUser) {
          console.log('seleteduser:' , selectedUser)
          console.log('seleteduserId:' , selectedUser._id)
          console.log("auth user:" , authUser)
            getMessages(selectedUser._id);
        }
    }, [selectedUser]);

    useEffect(() => {
        scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!selectedUser) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                Select a user to start chatting
            </div>
        );
    }

    return (
        <div
            className='h-full w-full flex flex-col border border-black bg-cover bg-center bg-no-repeat'
            style={{ backgroundImage: "url('/bg_chat2.jpg')" }}
        >
            {/* Header */}
            <div className='flex items-center px-1 h-[7%] w-full justify-between bg-blue-50'>
                <div className='flex items-center gap-3'>
                    <div className='relative ml-4'>
                        <img
                            src={selectedUser?.profilePic || 'avatar.jpg'}
                            alt={selectedUser?.name}
                            className='h-12 w-12 rounded-full'
                        />
                        {onlineUser?.includes(selectedUser._id)  && (
                            <div className='absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-400 border-2 border-blue-50' />
                        )}
                    </div>
                    <div className='font-semibold text-lg'>{selectedUser?.name}</div>
                </div>
                <img src="info_icon.png" className='mr-5 h-10 w-10 cursor-pointer' alt="info" />
            </div>

            {/* Chat Area */}
            <div className='flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4'>
                {isLoadingMessages ? (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        Loading messages...
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        No messages yet. Say hello!
                    </div>
                ) : (
                    messages.map((message) => (
                        <div key={message._id}>
                            {message.senderId === authUser?._id ? (

                                // Sent message — avatar on the RIGHT
                                <div className="flex justify-end items-end gap-2">
                                    <div className="max-w-full bg-blue-500 text-white px-4 py-2 rounded-2xl rounded-tr-sm shadow">
                                        {message.image && (
                                            <img
                                                src={message.image}
                                                alt="Shared"
                                                className="max-w-[200px] rounded-lg mb-2"
                                            />
                                        )}
                                        {message.text && <p>{message.text}</p>}
                                        <span className="text-xs text-blue-100">
                                            {new Date(message.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <img
                                        src={authUser?.profilePic || 'avatar.jpg'}
                                        alt={authUser?.name}
                                        className="h-8 w-8 rounded-full"
                                    />
                                </div>

                            ) : (

                                // Received message — avatar on the LEFT
                                <div className="flex justify-start items-end gap-1.5">
                                    <img
                                        src={selectedUser?.profilePic || 'avatar.jpg'}
                                        alt={selectedUser?.name}
                                        className="h-8 w-8 rounded-full"
                                    />
                                    <div className="max-w-[70%] bg-white px-4 py-2 rounded-2xl rounded-tl-sm shadow">
                                        {message.image && (
                                            <img
                                                src={message.image}
                                                alt="Shared image"
                                                className="max-w-[200px] rounded-lg mb-2"
                                            />
                                        )}
                                        {message.text && <p>{message.text}</p>}
                                        <span className="text-xs text-gray-500">
                                            {new Date(message.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                            )}
                        </div>
                    ))
                )}
                <div ref={scrollEnd} />
            </div>

            {/* Footer */}
            <div className='rounded-3xl flex mb-3 items-center self-center bg-blue-100 border h-[6%] w-[98%]'>
                <label htmlFor="file" className={isSending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}>
                    <img src='attachment_icon.png' className='h-10 w-10 mx-2' alt="attach" />
                </label>

                <input
                    id="file"
                    type="file"
                    accept="image/*"
                    hidden
                    disabled={isSending}
                    onChange={handleSendImage}
                />

                <input
                    onChange={(e) => setInput(e.target.value)}
                    type="text"
                    value={input}
                    onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null}
                    placeholder="Type a message..."
                    className='flex-1 h-[80%] outline-none bg-transparent'
                    disabled={isSending}
                />

                <img
                    src='send_icon.png'
                    alt="send"
                    className={`h-8 w-8 mx-5 ${isSending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={!isSending ? handleSendMessage : undefined}
                />
            </div>
        </div>
    )
}

export default ChatContainer