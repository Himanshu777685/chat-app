import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';


const ProfileUpdate = () => {

  const { authUser, updateProfile, isUpdating } = useContext(AuthContext);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-6">
      <div className="bg-white w-full max-w-6xl flex flex-col-reverse lg:flex-row items-center justify-around shadow-lg rounded-xl p-6 md:p-8 gap-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-600 text-center mb-6">
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
                  className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full object-cover"
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
              <label className="text-lg md:text-xl font-semibold">Name</label>
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
              <label className="text-lg md:text-xl font-semibold">Bio</label>
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
              className="w-full bg-blue-600 text-white text-base md:text-lg px-6 py-3 rounded-xl hover:bg-blue-700 transition"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
        </div>

        <div className="flex justify-center w-full lg:w-auto">
          <img
            src="logo.png"
            alt=""
            className="w-10 sm:w-40 md:w-64 lg:w-72 h-auto "
          />
        </div>
      </div>
    </div>
  );
}

export default ProfileUpdate