
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [users, setUsers] = useState([]);

    const { socket, axios, authUser } = useContext(AuthContext);

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get("/api/messages/users");

            if (data.success) {
                setUsers(data.users);
                setUnseenMessages(data.unseenmessages);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(()=>{
        fetchUsers();
    },[authUser])

    const getMessages = async (userId) => {
        setIsLoadingMessages(true);

        try {
            const { data } = await axios.get(`/api/messages/${userId}`);

            if (data.success) {
                setMessages(data.messages);

                setUnseenMessages((prev) => ({
                    ...prev,
                    [userId]: 0,
                }));
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setIsLoadingMessages(false);
        }
    };

    const sendMessage = async (messageData) => {
        try {
            if (!selectedUser) return;

            const { data } = await axios.post(
                `/api/messages/send/${selectedUser._id}`,
                messageData
            );

            if (data.success) {
                setMessages((prev) => [...prev, data.newMessage]);

                // Update sidebar instantly
                setUsers((prevUsers) => {
                    const updatedUsers = prevUsers.map((user) =>
                        user._id === selectedUser._id
                            ? {
                                ...user,
                                lastMessage: {
                                    text: data.newMessage.text,
                                    image: data.newMessage.image,
                                    senderId: data.newMessage.senderId,
                                    createdAt: data.newMessage.createdAt,
                                },
                            }
                            : user
                    );

                    const currentUser = updatedUsers.find(
                        (u) => u._id === selectedUser._id
                    );

                    return [
                        currentUser,
                        ...updatedUsers.filter((u) => u._id !== selectedUser._id),
                    ];
                });
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
            // Ignore our own messages
            if (newMessage.senderId === authUser._id) return;

            // Chat currently open
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                setMessages((prev) => [
                    ...prev,
                    { ...newMessage, seen: true },
                ]);

                axios
                    .put(`/api/messages/mark/${newMessage._id}`)
                    .catch(() => { });
            } else {
                setUnseenMessages((prev) => ({
                    ...prev,
                    [newMessage.senderId]:
                        (prev[newMessage.senderId] || 0) + 1,
                }));
            }

            // Update sidebar
            setUsers((prevUsers) => {
                const updatedUsers = prevUsers.map((user) =>
                    user._id === newMessage.senderId
                        ? {
                            ...user,
                            lastMessage: {
                                text: newMessage.text,
                                image: newMessage.image,
                                senderId: newMessage.senderId,
                                createdAt: newMessage.createdAt,
                            },
                        }
                        : user
                );

                const sender = updatedUsers.find(
                    (u) => u._id === newMessage.senderId
                );

                return [
                    sender,
                    ...updatedUsers.filter((u) => u._id !== newMessage.senderId),
                ];
            });
        };

        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [socket, selectedUser, authUser]);

    const value = {
        messages,
        selectedUser,
        sendMessage,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages,
        getMessages,
        isLoadingMessages,
        users,
        setUsers,
        fetchUsers,
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};
