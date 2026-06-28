import React, { useContext, useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";


const SideBar = () => {
  const { authUser, logout, onlineUser } = useContext(AuthContext);

  const {
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);

  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/messages/users`
        );

        setUsers(res.data.users);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchUser();
  }, []);

  // FILTER USERS
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className=" flex flex-col h-screen  bg-gray-100">

      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-4 rounded-xl shadow-md ">
        <div className="flex items-center gap-2">
          <img src="logo.png" className="h-10" />
          <span className="font-bold text-blue-600">ChatApp</span>
        </div>

        <div className="relative">
          <button onClick={() => setOpen(!open)}>
            <MoreVertical />
          </button>

          {open && (
            <div className="absolute right-0 bg-white shadow rounded p-2">
              <button
                onClick={() => navigate("/profile")}
                className="block px-3 py-2"
              >
                Profile
              </button>

              <button
                className="block px-3 py-2 text-red-500"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SEARCH */}
      <div className="flex flex-col items-center">
        <div className="p-2 w-[90%] shadow-sm rounded-full items-center flex my-2">
          <img src="search.png" className="w-8" />
          <input
            type="text"
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-[90%] px-3 py-2  border-b focus:outline-none "
          />
        </div>
      </div>

      {/* USERS LIST */}
      <div className="flex-1  overflow-y-auto">

        {filteredUsers.map((user) => {
          const isActive = selectedUser?._id === user._id;
          const unread = unseenMessages[user._id] || 0;

          return (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`flex items-center gap-3 p-3 mx-2 my-2 shadow-sm cursor-pointer transition-all duration-200 rounded-xl
                ${isActive ? "bg-blue-100 border-l-4 border-blue-600 shadow-md" : "hover:bg-gray-100 border-l-4 bg-white border-blue-600"}
                hover:scale-105
                hover:shadow-md
              `}
            >
              {/* PROFILE PIC */}
              <div className="relative">
                <img
                  src={user.profilePic || "avatar.jpg"}
                  className="w-12 h-12 rounded-full object-cover"
                />

                {/* ONLINE DOT */}
                {onlineUser?.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                )}
              </div>

              {/* INFO */}
              <div className="flex-1">
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>

              {/* UNREAD BADGE */}
              {unread > 0 && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {unread}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SideBar;