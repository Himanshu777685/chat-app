import React, { useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SideBar = () => {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/messages/users`,
           
        );
        console.log("API RESPONSE:", res.data);

        setUsers(res.data.users);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="w-[35%] flex flex-col h-screen border-r">

      {/* HEADER */}
      <div className="flex items-center justify-between p-3">
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

              <button className="block px-3 py-2 text-red-500">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <div>search bar</div>
      {/* USERS LIST */}
      <div className="flex-1 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user._id}
            className="flex items-center gap-3 p-3 border-b hover:bg-gray-100 cursor-pointer"
          >
            {/* PROFILE PIC */}
            <div className="relative">
              <img
                src={user.profilePic || "avatar.jpg"}
                className="w-12 h-12 rounded-full object-cover"
              />

              {/* ONLINE DOT */}
              {user.isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
              )}
            </div>

            {/* INFO */}
            <div>
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;