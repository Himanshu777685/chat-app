import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);

    const { socket, axios } = useContext(AuthContext);

    const getMessages = async (userId) => {
        setIsLoadingMessages(true);
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if (data.success) {
                setMessages(data.messages);
                setUnseenMessages((prev) => ({ ...prev, [userId]: 0 }));
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setIsLoadingMessages(false);
        }
    }

    const sendMessage = async (messageData) => {
        try {
            if (!selectedUser) return;
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if (data.success) {
                setMessages((prev) => [...prev, data.newMessage]);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        }
    }

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
            // If chat is open with sender → show in chat + mark seen
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                setMessages((prev) => [
                    ...prev,
                    { ...newMessage, seen: true }
                ]);

                axios
                    .put(`/api/messages/mark/${newMessage._id}`)
                    .catch(() => { });
            }
            // Otherwise increase unseen count
            else {
                setUnseenMessages((prev) => ({
                    ...prev,
                    [newMessage.senderId]:
                        (prev[newMessage.senderId] || 0) + 1
                }));
            }
        };

        socket.on("newMessage", handleNewMessage);

        
        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [socket, selectedUser]);




const value = {
    messages,
    selectedUser,
    sendMessage,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    getMessages,
    isLoadingMessages,
}

return (
    <ChatContext.Provider value={value}>
        {children}
    </ChatContext.Provider>
)
}