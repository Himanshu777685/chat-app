import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';


const ProfileUpdate = () => {

  const { authUser, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
  });

  const [preview, setPreview] = useState("avatar.jpg");
  const [file, setFile] = useState(null);

  // ✅ Track whether user picked a NEW image or not
  const [imageChanged, setImageChanged] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageChanged(true);
      setPreview(URL.createObjectURL(file)); // 👈 store real file
      setFile(file);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newData = new FormData();

      newData.append("name", formData.name);
      newData.append("bio", formData.bio);

      if (imageChanged && file) {
        newData.append("profilePic", file); 
      }

      await updateProfile(newData);
      navigate("/chat");

    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      console.log("Update error:", err.message);
    }
  };

  useEffect(() => {
    if (authUser) {
      setFormData({
        name: authUser.name || "",
        bio: authUser.bio || "",
      });
      setPreview(authUser.profilePic || "avatar.jpg");
      setImageChanged(false); // reset on authUser change
    }
  }, [authUser]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white flex justify-around items-center shadow-lg rounded-xl p-8 w-[70%]">
        <div className='h-full max-w-md w-full'>
          <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">
            Update Profile
          </h2>

          <div className="flex justify-center mb-5">
            <div className="relative">
              <label htmlFor="avatar" className="cursor-pointer">
                <input
                  id="avatar"
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  hidden
                  onChange={handleImageChange}
                />
                <img
                  src={preview}
                  alt="avatar"
                  className="h-40 w-40 rounded-full object-cover"
                />
                {/* ✅ Visual hint that image is clickable */}
                <div className="absolute bottom-1 right-1 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  Edit
                </div>
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className='text-xl font-semibold'>Name</label>
              <input
                type="text"
                name="name"
                placeholder='Enter name'
                value={formData.name}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-400 p-2 outline-none mt-1"
              />
            </div>

            <div className="mb-4">
              <label className='text-xl font-semibold'>Bio</label>
              <textarea
                name="bio"
                rows="3"
                placeholder='Enter profile bio'
                value={formData.bio}
                onChange={handleChange}
                className="w-full border border-gray-400 p-2 rounded-lg mt-1 resize-none"
              />
            </div>

            <button
              type="submit"
              className='w-full bg-blue-600 text-white self-center text-lg px-6 py-2 rounded-xl hover:bg-blue-700 transition'
            >
              Save Changes
            </button>
          </form>
        </div>

        <div>
          <img src="logo.png" alt="" />
        </div>
      </div>
    </div>
  );
}

export default ProfileUpdate