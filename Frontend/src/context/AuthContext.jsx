import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";


const backendUrl = import.meta.env.VITE_BACKEND_URL;
console.log(backendUrl);

axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true;

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const [socket, setSocket] = useState(null);

  // Check if user is already logged in
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");

      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Login / Signup
  const login = async (state, credentials) => {
    try {
      console.log("Sending:", credentials)
      const { data } = await axios.post(
        `/api/auth/${state}`,
        credentials
      );

      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
        toast.success(data.message);
        
        console.log(data)
        return data.user;

      } else {
        toast.error(data.message);

      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      );
    }
  };


  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put('/api/auth/update-profile', body, {
        withCredentials: true,
        
      });

      if (data.success) {
        setAuthUser(data.user);
        toast.success("profile updated successfully")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  // Socket Connection
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
      },
    });

    newSocket.connect();

    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUser(userIds);
    });
  };

  // Logout
  const logout = async () => {
    try {
      const { data } = await axios.post("/api/auth/logout");

      if (data.success) {
        setAuthUser(null);
        setOnlineUser([]);

        if (socket) {
          socket.disconnect();
          setOnlineUser([]);

        }

        toast.success(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      );
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    axios,
    authUser,
    setAuthUser,
    onlineUser,
    setOnlineUser,
    socket,
    setSocket,
    login,
    logout,
    updateProfile,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};