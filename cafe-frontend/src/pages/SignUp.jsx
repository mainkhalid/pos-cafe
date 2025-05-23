import React, { useState } from 'react'
import loginIcons from '../assets/signin.gif'
import { FaEye, FaEyeSlash, FaUser, FaLock, FaEnvelope, FaCamera, FaCheck, FaTimes } from "react-icons/fa"
import { BiCoffee } from "react-icons/bi"
import { Link, useNavigate } from 'react-router-dom'
import imageTobase64 from '../helpers/imageTobase64'
import SummaryApi from '../common'
import { toast } from 'react-toastify'

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [passwordMatch, setPasswordMatch] = useState(null)
    const [data, setData] = useState({
        email: "",
        password: "",
        name: "",
        confirmPassword: "",
        profilePic: "",
    })
    const navigate = useNavigate()

    // Password strength checker
    const checkPasswordStrength = (password) => {
        const minLength = password.length >= 8
        const hasUpperCase = /[A-Z]/.test(password)
        const hasLowerCase = /[a-z]/.test(password)
        const hasNumbers = /\d/.test(password)
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
        
        const score = [minLength, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length
        return { score, checks: { minLength, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar } }
    }

    const handleOnChange = (e) => {
        const { name, value } = e.target
        
        setData((prev) => {
            const newData = { ...prev, [name]: value }
            
            // Check password match when either password field changes
            if (name === 'password' || name === 'confirmPassword') {
                if (name === 'password') {
                    setPasswordMatch(newData.confirmPassword ? value === newData.confirmPassword : null)
                } else {
                    setPasswordMatch(value ? value === newData.password : null)
                }
            }
            
            return newData
        })
    }

    const handleUploadPic = async(e) => {
        const file = e.target.files[0]
        
        if (file) {
            // Check file size (limit to 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB")
                return
            }
            
            // Check file type
            if (!file.type.startsWith('image/')) {
                toast.error("Please select a valid image file")
                return
            }
            
            try {
                const imagePic = await imageTobase64(file)
                setData((prev) => ({
                    ...prev,
                    profilePic: imagePic
                }))
                toast.success("Profile picture uploaded successfully")
            } catch (error) {
                toast.error("Failed to upload image")
            }
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        
        if (data.password !== data.confirmPassword) {
            toast.error("Password and confirm password do not match")
            return
        }

        const passwordStrength = checkPasswordStrength(data.password)
        if (passwordStrength.score < 3) {
            toast.error("Please choose a stronger password")
            return
        }

        setIsLoading(true)

        try {
            const dataResponse = await fetch(SummaryApi.signUP.url, {
                method: SummaryApi.signUP.method,
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(data)
            })

            const dataApi = await dataResponse.json()

            if (dataApi.success) {
                toast.success(dataApi.message)
                navigate("/login")
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

    const passwordStrength = data.password ? checkPasswordStrength(data.password) : null

    return (
        <section className='min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center py-12 px-4'>
            <div className='w-full max-w-md'>
                {/* Header */}
                <div className='text-center mb-8'>
                    <div className='inline-flex items-center justify-center w-16 h-16 bg-amber-600 rounded-full mb-4'>
                        <BiCoffee className='text-3xl text-white' />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-800 mb-2'>Join Our Cafe!</h1>
                    <p className='text-gray-600'>Create your account to get started</p>
                </div>

                {/* SignUp Card */}
                <div className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100'>
                    {/* Profile Picture Upload */}
                    <div className='flex justify-center mb-6'>
                        <div className='relative'>
                            <div className='w-24 h-24 rounded-full overflow-hidden border-4 border-amber-200 shadow-lg bg-gray-100'>
                                <img 
                                    src={data.profilePic || loginIcons} 
                                    alt='profile'
                                    className='w-full h-full object-cover'
                                />
                            </div>
                            <label className='absolute bottom-0 right-0 bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-full cursor-pointer transition-colors duration-200 shadow-lg'>
                                <FaCamera size={14} />
                                <input 
                                    type='file' 
                                    className='hidden' 
                                    onChange={handleUploadPic}
                                    accept="image/*"
                                />
                            </label>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-5'>
                        {/* Name Input */}
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700 flex items-center gap-2'>
                                <FaUser className='text-amber-600' />
                                Full Name
                            </label>
                            <input 
                                type='text' 
                                placeholder='Enter your full name' 
                                name='name'
                                value={data.name}
                                onChange={handleOnChange}
                                required
                                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-gray-50 focus:bg-white'
                            />
                        </div>

                        {/* Email Input */}
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700 flex items-center gap-2'>
                                <FaEnvelope className='text-amber-600' />
                                Email Address
                            </label>
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

                        {/* Password Input */}
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700 flex items-center gap-2'>
                                <FaLock className='text-amber-600' />
                                Password
                            </label>
                            <div className='relative'>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder='Create a strong password'
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
                            
                            {/* Password Strength Indicator */}
                            {passwordStrength && (
                                <div className='mt-2'>
                                    <div className='flex gap-1 mb-2'>
                                        {[1, 2, 3, 4, 5].map((level) => (
                                            <div 
                                                key={level}
                                                className={`h-1 flex-1 rounded ${
                                                    level <= passwordStrength.score 
                                                        ? passwordStrength.score <= 2 ? 'bg-red-500' 
                                                        : passwordStrength.score <= 3 ? 'bg-yellow-500'
                                                        : 'bg-green-500'
                                                        : 'bg-gray-200'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <div className='text-xs space-y-1'>
                                        <div className={`flex items-center gap-2 ${passwordStrength.checks.minLength ? 'text-green-600' : 'text-gray-400'}`}>
                                            {passwordStrength.checks.minLength ? <FaCheck size={10} /> : <FaTimes size={10} />}
                                            At least 8 characters
                                        </div>
                                        <div className={`flex items-center gap-2 ${passwordStrength.checks.hasUpperCase ? 'text-green-600' : 'text-gray-400'}`}>
                                            {passwordStrength.checks.hasUpperCase ? <FaCheck size={10} /> : <FaTimes size={10} />}
                                            Uppercase letter
                                        </div>
                                        <div className={`flex items-center gap-2 ${passwordStrength.checks.hasNumbers ? 'text-green-600' : 'text-gray-400'}`}>
                                            {passwordStrength.checks.hasNumbers ? <FaCheck size={10} /> : <FaTimes size={10} />}
                                            Number
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Input */}
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700 flex items-center gap-2'>
                                <FaLock className='text-amber-600' />
                                Confirm Password
                            </label>
                            <div className='relative'>
                                <input 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    placeholder='Confirm your password'
                                    value={data.confirmPassword}
                                    name='confirmPassword' 
                                    onChange={handleOnChange}
                                    required
                                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white ${
                                        passwordMatch === null ? 'border-gray-300 focus:ring-amber-500 focus:border-amber-500' :
                                        passwordMatch ? 'border-green-300 focus:ring-green-500 focus:border-green-500' :
                                        'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    }`}
                                />
                                <button
                                    type="button"
                                    className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-amber-600 transition-colors duration-200'
                                    onClick={() => setShowConfirmPassword(prev => !prev)}
                                >
                                    {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                </button>
                            </div>
                            
                            {/* Password Match Indicator */}
                            {passwordMatch !== null && (
                                <div className={`text-xs flex items-center gap-2 ${passwordMatch ? 'text-green-600' : 'text-red-600'}`}>
                                    {passwordMatch ? <FaCheck size={10} /> : <FaTimes size={10} />}
                                    {passwordMatch ? 'Passwords match' : 'Passwords do not match'}
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit"
                            disabled={isLoading || passwordMatch === false}
                            className='w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl mt-6'
                        >
                            {isLoading ? (
                                <div className='flex items-center justify-center gap-2'>
                                    <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                    Creating Account...
                                </div>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className='flex items-center my-6'>
                        <div className='flex-1 border-t border-gray-200'></div>
                        <span className='px-4 text-sm text-gray-500'>or</span>
                        <div className='flex-1 border-t border-gray-200'></div>
                    </div>

                    {/* Login Link */}
                    <div className='text-center'>
                        <p className='text-gray-600'>
                            Already have an account?{' '}
                            <Link 
                                to={"/login"} 
                                className='text-amber-600 hover:text-amber-700 font-semibold hover:underline transition-colors duration-200'
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className='text-center mt-6 text-sm text-gray-500'>
                    <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
                </div>
            </div>
        </section>
    )
}

export default SignUp