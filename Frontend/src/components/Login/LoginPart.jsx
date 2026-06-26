import React, { useContext } from 'react'
import { useState } from 'react'
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPart = ({ setState }) => {

    const navigate = useNavigate();
    const {login} = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!formData.email || !formData.password){
            return;
        }

        console.log(formData);

        const success = await login("login", formData);

        console.log(success);

        if(success){
            navigate("/chat")
        }

        
    };

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })



    return (
        <div className='w-[80%]' >
            <form className="bg-white p-8 rounded-2xl shadow-lg w-full " onSubmit={handleSubmit}>

                <h2 className="text-3xl font-bold text-center text-blue-600 mb-2">
                    Login
                </h2>

                <p className="text-center text-gray-500 mb-8">
                    Welcome back!
                </p>

                <div className="mb-5">
                    <label className="block text-gray-700 font-medium mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        placeholder="Enter your email"
                        className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-blue-500"
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                email: e.target.value,
                            })
                        }}
                    />
                </div>

                <div className="mb-2">
                    <label className="block text-gray-700 font-medium mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        value={formData.password}
                        placeholder="Enter your password"
                        className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-blue-500"
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                password: e.target.value,
                            })
                        }}
                    />
                </div>

                <div className="flex justify-end mb-6">
                    <button
                        type="button"
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Forgot Password?
                    </button>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                    Login
                </button>

                <p className="text-center text-gray-600 mt-6">
                    Don't have an account?{" "}
                    <span className="text-blue-600 font-semibold cursor-pointer"
                        onClick={() => setState('Register')}
                    >
                        Sign Up

                    </span>
                </p>

            </form>
        </div>
    )
}

export default LoginPart
