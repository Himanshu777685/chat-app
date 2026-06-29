import React, { useContext, useEffect, useRef, useState } from 'react'
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { PhotoView } from "react-photo-view";
import { ArrowLeft } from "lucide-react";
import ChatSkeleton from './ChatSkeleton';

const MAX_IMAGE_SIZE_MB = 5;

const ChatContainer = () => {

    const scrollEnd = useRef(null);
    const { messages, selectedUser, sendMessage, getMessages, isLoadingMessages, setSelectedUser } = useContext(ChatContext);
    const { authUser, onlineUser } = useContext(AuthContext);

   

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
            console.log('seleteduser:', selectedUser)
            console.log('seleteduserId:', selectedUser._id)
            console.log("auth user:", authUser)
            getMessages(selectedUser._id);
        }
    }, [selectedUser]);

    useEffect(() => {
        scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!selectedUser) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-100 text-xl text-gray-500">
                Select a user to start chatting
            </div>
        );
    }

    return (
        <div
            className='h-full w-full flex flex-col border border-black be-cover bg-linear-to-br from-slate-100 to-blue-300'

        >
            {/* Header */}
            <div className='flex items-center px-1  py-3 w-full justify-between bg-linear-to-r from-blue-600 to-cyan-500 text-white'>
                <div className='flex items-center gap-3.5'>
                    <button
                        onClick={() => {
                            setSelectedUser(null)
                            console.log('selected user: ', selectedUser)
                        }
                        }
                        className="md:hidden mr-2"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div className='relative ml-4'>
                        <PhotoView src={selectedUser?.profilePic || 'avatar.jpg'}>
                            <img
                                src={selectedUser?.profilePic || 'avatar.jpg'}
                                alt={selectedUser?.name}
                                className='h-12 w-12 rounded-full ring-2 ring-white shadow-md'
                            />
                        </PhotoView>
                        {onlineUser?.includes(selectedUser._id) && (
                            <div className='absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-400 border-2 border-blue-50' />
                        )}
                    </div>
                    <div>
                        <div className="font-semibold text-lg">
                            {selectedUser?.name}
                        </div>

                        {selectedUser?.bio && (
                            <p className="text-sm ">
                                {selectedUser.bio}
                            </p>
                        )}
                    </div>
                </div>
                <img src="info_icon.png" className='mr-5 h-10 w-10 cursor-pointer' alt="info" />
            </div>

            {/* Chat Area */}
            <div className='flex-1 overflow-y-auto scrollbar-none p-4 space-y-4'>
                {isLoadingMessages ? (
                    <ChatSkeleton />
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        <img src='no-message.png' className='w-80 h-auto shadow-lg rounded-full' />
                    </div>
                ) : (
                    messages.map((message) => (
                        <div key={message._id}>
                            {message.senderId === authUser?._id ? (

                                // Sent message — avatar on the RIGHT
                                <div className="flex justify-end items-end gap-2">
                                    <div className="max-w-[70%] min-w-0 overflow-hidden bg-blue-500 text-white px-4 py-3 rounded-3xl rounded-tr-sm shadow-md">
                                        {message.image && (
                                            <PhotoView src={message.image}>
                                                <img
                                                    src={message.image}
                                                    alt=""
                                                    className="max-w-xs rounded-lg cursor-pointer"
                                                />
                                            </PhotoView>
                                        )}
                                        {message.text && <p className='break-all whitespace-pre-wrap'  style={{ overflowWrap: "anywhere" }}>{message.text}</p>}
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
                                    <div className="max-w-[70%] min-w-0 overflow-hidden bg-white px-4 py-3 rounded-3xl rounded-tl-sm shadow-md">
                                        {message.image && (
                                            <PhotoView src={message.image}>
                                                <img
                                                    src={message.image}
                                                    alt=""
                                                    className="max-w-xs rounded-lg cursor-pointer"
                                                />
                                            </PhotoView>
                                        )}

                                        {message.text && (
                                            <p className="break-all whitespace-pre-wrap"  style={{ overflowWrap: "anywhere" }}>
                                                {message.text}
                                            </p>
                                        )}

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
            <div className='rounded-full shadow-lg mb-6 flex items-center self-center bg-blue-100 border h-[6%] w-[98%]'>
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