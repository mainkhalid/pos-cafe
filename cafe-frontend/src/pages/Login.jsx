import React, { useContext, useState } from 'react'
import loginIcons from '../assets/signin.gif'
import { FaEye, FaEyeSlash, FaUser, FaLock, FaEnvelope } from "react-icons/fa"
import { BiCoffee } from "react-icons/bi"
import { Link, useNavigate } from 'react-router-dom'
import SummaryApi from '../common'
import { toast } from 'react-toastify'
import Context from '../context'

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState({
        email: "",
        password: ""
    })
    const navigate = useNavigate()
    const { fetchUserDetails, fetchUserAddToCart } = useContext(Context)

    const handleOnChange = (e) => {
        const { name, value } = e.target
        setData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const dataResponse = await fetch(SummaryApi.signIn.url, {
                method: SummaryApi.signIn.method,
                credentials: 'include',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(data)
            })

            const dataApi = await dataResponse.json()

            if (dataApi.success) {
                toast.success(dataApi.message)
                navigate('/')
                fetchUserDetails()
                fetchUserAddToCart()
            }

            if (dataApi.error) {
                toast.error(dataApi.message)
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className='min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center py-12 px-4'>
            <div className='w-full max-w-md'>
                {/* Header */}
                <div className='text-center mb-8'>
                    <div className='inline-flex items-center justify-center w-16 h-16 bg-amber-600 rounded-full mb-4'>
                        <BiCoffee className='text-3xl text-white' />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-800 mb-2'>Welcome Back!</h1>
                    <p className='text-gray-600'>Sign in to your cafe account</p>
                </div>

                {/* Login Card */}
                <div className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100'>
                    {/* Avatar */}
                    <div className='flex justify-center mb-6'>
                        <div className='w-20 h-20 rounded-full overflow-hidden border-4 border-amber-200 shadow-lg'>
                            <img 
                                src={loginIcons} 
                                alt='login avatar'
                                className='w-full h-full object-cover'
                            />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-6'>
                        {/* Email Input */}
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700 flex items-center gap-2'>
                                <FaEnvelope className='text-amber-600' />
                                Email Address
                            </label>
                            <div className='relative'>
                                <input 
                                    type='email' 
                                    placeholder='Enter your email' 
                                    name='email'
                                    value={data.email}
                                    onChange={handleOnChange}
                                    required
                                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-gray-50 focus:bg-white'
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700 flex items-center gap-2'>
                                <FaLock className='text-amber-600' />
                                Password
                            </label>
                            <div className='relative'>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder='Enter your password'
                                    value={data.password}
                                    name='password' 
                                    onChange={handleOnChange}
                                    required
                                    className='w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-gray-50 focus:bg-white'
                                />
                                <button
                                    type="button"
                                    className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-amber-600 transition-colors duration-200'
                                    onClick={() => setShowPassword(prev => !prev)}
                                >
                                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                </button>
                            </div>
                            
                            {/* Forgot Password Link */}
                            <div className='text-right'>
                                <Link 
                                    to={'/forgot-password'} 
                                    className='text-sm text-amber-600 hover:text-amber-700 hover:underline transition-colors duration-200'
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className='w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl'
                        >
                            {isLoading ? (
                                <div className='flex items-center justify-center gap-2'>
                                    <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                    Signing In...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className='flex items-center my-6'>
                        <div className='flex-1 border-t border-gray-200'></div>
                        <span className='px-4 text-sm text-gray-500'>or</span>
                        <div className='flex-1 border-t border-gray-200'></div>
                    </div>

                    {/* Sign Up Link */}
                    <div className='text-center'>
                        <p className='text-gray-600'>
                            Don't have an account?{' '}
                            <Link 
                                to={"/sign-up"} 
                                className='text-amber-600 hover:text-amber-700 font-semibold hover:underline transition-colors duration-200'
                            >
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className='text-center mt-6 text-sm text-gray-500'>
                    <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
                </div>
            </div>
        </section>
    )
}

export default Login