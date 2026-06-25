import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext';



const Register = ({ setState }) => {

    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        bio: "",
        profilePic: null,
    });


    const [preview, setPreview] = useState("avatar.jpg");

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setPreview(URL.createObjectURL(file));

            setFormData(prev => ({
                ...prev,
                profilePicFile: file
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)

        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("password", formData.password);
        data.append("bio", formData.bio);

        if (formData.profilePicFile) {
            data.append("profilePic", formData.profilePicFile);
        }

        await login("signup", data);
    }

    return (
        <div className='h-auto rounded-2xl w-[90%] shadow-lg flex flex-col items-center p-5 '>
            <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">
                Welcome to ChatApp!
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
                            className="h-40 w-40 rounded-full object-cover shadow-lg"
                        />
                    </label>
                </div>
            </div>

            <form onSubmit={handleSubmit} className='w-[90%] h-full'>
                <div className="mb-4">
                    <label className='text-xl font-semibold'>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        placeholder='Enter name'
                        className="w-full border-b-2 border-gray-300 p-2 outline-none mt-1 focus:border-blue-500"
                        required
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                name: e.target.value
                            })
                        }}
                    />
                </div>

                <div className="mb-4">
                    <label className='text-xl font-semibold'>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        placeholder='Enter email'
                        className="w-full border-b-2 border-gray-300 p-2 outline-none mt-1 focus:border-blue-500"
                        required
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                email: e.target.value
                            })
                        }}
                    />
                </div>

                <div className="mb-4">
                    <label className='text-xl font-semibold'>Bio</label>
                    <textarea
                        name="bio"
                        rows="3"
                        value={formData.bio}
                        placeholder='Enter profile bio'
                        className="w-full border border-gray-300  outline-none p-2 rounded-lg mt-1 resize-none focus:border-blue-500"
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                bio: e.target.value
                            })
                        }}
                    />
                </div>

                <div className='mb-4'>
                    <label className='text-xl font-semibold'>Password</label>
                    <input
                        type='password'
                        value={formData.password}
                        placeholder='Set password'
                        className="w-full border-b-2 border-gray-300 p-2 outline-none mt-1 focus:border-blue-500"
                        required
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                password: e.target.value
                            })
                        }}
                    />
                </div>

                <button
                    type="submit"
                    className='w-full  bg-blue-600 text-white self-center text-lg  px-6 py-2  rounded-xl hover:bg-blue-700 transition'

                >
                    Register
                </button>

                <p className="text-center text-gray-600 mt-6">
                    Already have an account?{" "}
                    <span className="text-blue-600 font-semibold cursor-pointer"
                        onClick={() => setState('Login')}
                    >
                        Log In

                    </span>
                </p>
            </form>
        </div>
    )
}

export default Register
