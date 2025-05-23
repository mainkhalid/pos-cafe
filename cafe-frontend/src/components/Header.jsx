import React, { useContext, useState, useEffect, useRef } from 'react'
import Logo from './Logo'
import { GrSearch } from "react-icons/gr"
import { FaUserCircle, FaShoppingCart, FaClock, FaMapMarkerAlt, FaPhone } from "react-icons/fa"
import { MdOutlineRestaurantMenu, MdClose } from "react-icons/md"
import { BiCoffee } from "react-icons/bi"
import { HiMenuAlt3 } from "react-icons/hi"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import SummaryApi from '../common'
import { toast } from 'react-toastify'
import { setUserDetails } from '../store/userSlice'
import ROLE from '../common/role'
import Context from '../context'

const Header = () => {
  const user = useSelector(state => state?.user?.user)
  const dispatch = useDispatch()
  const [menuDisplay, setMenuDisplay] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const context = useContext(Context)
  const navigate = useNavigate()
  const searchInput = useLocation()
  const URLSearch = new URLSearchParams(searchInput?.search)
  const searchQuery = URLSearch.getAll("q")
  const [search, setSearch] = useState(searchQuery)
  const [isScrolled, setIsScrolled] = useState(false)
  const menuRef = useRef(null)
  const searchRef = useRef(null)

  // Cafe-specific data
  const cafeHours = {
    weekdays: "6:00 AM - 10:00 PM",
    weekends: "7:00 AM - 11:00 PM"
  }

  const cafeInfo = {
    phone: "(555) 123-CAFE",
    address: "123 Coffee Street, Downtown"
  }

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuDisplay(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async() => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: 'include'
    })

    const data = await fetchData.json()

    if (data.success) {
      toast.success(data.message)
      dispatch(setUserDetails(null))
      navigate("/")
    }

    if (data.error) {
      toast.error(data.message)
    }
  }

  const handleSearch = (e) => {
    const { value } = e.target
    setSearch(value)

    if (value) {
      navigate(`/search?q=${value}`)
    } else {
      navigate("/menu")
    }
  }

  const navigationLinks = [
    { name: 'Home', path: '/', icon: null },
    { name: 'Menu', path: '/menu', icon: <MdOutlineRestaurantMenu /> },
    { name: 'About', path: '/about', icon: null },
    { name: 'Contact', path: '/contact', icon: null },
    { name: 'Reservations', path: '/reservations', icon: null }
  ]

  return (
    <>
      {/* Fixed Header Container - Both sections stay fixed */}
      <div className='fixed w-full z-40 top-0'>
        {/* Top Info Bar - Always visible on desktop */}
        <div className='hidden lg:block bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-amber-100 py-3 text-sm shadow-lg'>
          <div className='container mx-auto px-4 flex justify-between items-center'>
            <div className='flex items-center gap-8'>
              <div className='flex items-center gap-2 hover:text-amber-200 transition-colors duration-200'>
                <FaClock className='text-amber-300' />
                <span className="font-medium">Mon-Fri: {cafeHours.weekdays} | Sat-Sun: {cafeHours.weekends}</span>
              </div>
              <div className='flex items-center gap-2 hover:text-amber-200 transition-colors duration-200'>
                <FaMapMarkerAlt className='text-amber-300' />
                <span>{cafeInfo.address}</span>
              </div>
            </div>
            <div className='flex items-center gap-2 hover:text-amber-200 transition-colors duration-200 cursor-pointer'>
              <FaPhone className='text-amber-300' />
              <span className="font-medium">{cafeInfo.phone}</span>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <header className={`h-16 lg:h-20 shadow-md bg-white w-full transition-all duration-300 ${
          isScrolled ? 'shadow-xl bg-white/95 backdrop-blur-md border-b border-amber-100' : 'bg-white'
        }`}>
        <div className='h-full container mx-auto flex items-center px-4 justify-between'>
          
          {/* Logo */}
          <div className='flex items-center'>
            <Link to={"/"} className='flex items-center gap-2 hover:scale-105 transition-transform duration-200'>
              <BiCoffee className='text-3xl text-amber-600' />
              <Logo w={90} h={50}/>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden lg:flex items-center space-x-8'>
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className='flex items-center gap-2 text-gray-700 hover:text-amber-600 transition-all duration-200 font-medium relative group'
              >
                {link.icon}
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className='hidden lg:flex items-center w-full justify-between max-w-sm border-2 border-amber-200 rounded-full focus-within:border-amber-400 focus-within:shadow-lg focus-within:scale-105 transition-all duration-200 pl-4 bg-white'>
            <input 
              type='text' 
              placeholder='Search menu items...' 
              className='w-full outline-none py-2 bg-transparent' 
              onChange={handleSearch} 
              value={search}
            />
            <div className='text-lg min-w-[50px] h-10 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 flex items-center justify-center rounded-r-full text-white transition-all duration-200 cursor-pointer group'>
              <GrSearch className="group-hover:scale-110 transition-transform duration-200" />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className='flex items-center gap-4'>
            
            {/* Mobile Search Toggle */}
            <button 
              className='lg:hidden text-2xl text-gray-700 hover:text-amber-600 transition-colors duration-200 p-2 hover:bg-amber-50 rounded-full'
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <GrSearch />
            </button>

            {/* User Menu */}
            <div className='relative flex justify-center' ref={menuRef}>
              {user?._id && (
                <div 
                  className='text-3xl cursor-pointer relative flex justify-center hover:scale-110 transition-transform duration-200' 
                  onClick={() => setMenuDisplay(prev => !prev)}
                >
                  {user?.profilePic ? (
                    <img 
                      src={user?.profilePic} 
                      className='w-10 h-10 rounded-full border-2 border-amber-300 hover:border-amber-500 transition-colors duration-200' 
                      alt={user?.name} 
                    />
                  ) : (
                    <FaUserCircle className='text-gray-700 hover:text-amber-600 transition-colors duration-200' />
                  )}
                </div>
              )}
              
              {menuDisplay && (
                <div className='absolute bg-white bottom-0 top-12 h-fit p-3 shadow-2xl rounded-xl border border-amber-100 min-w-48 backdrop-blur-sm bg-white/95'>
                  <nav className='space-y-2'>
                    <div className='px-3 py-2 border-b border-amber-100 text-sm text-gray-600 bg-amber-50 rounded-lg'>
                      Hello, <span className="font-medium text-amber-800">{user?.name || 'Guest'}</span>
                    </div>
                    
                    {user?.role === ROLE.ADMIN && (
                      <Link 
                        to={"/admin-panel/all-products"} 
                        className='block px-3 py-2 hover:bg-amber-50 rounded-lg transition-all duration-200 text-gray-700 hover:text-amber-700 font-medium'
                        onClick={() => setMenuDisplay(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    
                    <Link 
                      to={"/profile"} 
                      className='block px-3 py-2 hover:bg-amber-50 rounded-lg transition-all duration-200 text-gray-700 hover:text-amber-700'
                      onClick={() => setMenuDisplay(false)}
                    >
                      My Profile
                    </Link>
                    
                    <Link 
                      to={"/orders"} 
                      className='block px-3 py-2 hover:bg-amber-50 rounded-lg transition-all duration-200 text-gray-700 hover:text-amber-700'
                      onClick={() => setMenuDisplay(false)}
                    >
                      My Orders
                    </Link>
                    
                    <Link 
                      to={"/favorites"} 
                      className='block px-3 py-2 hover:bg-amber-50 rounded-lg transition-all duration-200 text-gray-700 hover:text-amber-700'
                      onClick={() => setMenuDisplay(false)}
                    >
                      Favorites
                    </Link>
                    
                    <button 
                      onClick={handleLogout}
                      className='w-full text-left px-3 py-2 hover:bg-red-50 rounded-lg transition-all duration-200 text-red-600 hover:text-red-700 border-t border-amber-100 mt-2 pt-3 font-medium'
                    >
                      Logout
                    </button>
                  </nav>
                </div>
              )}
            </div>

            {/* Cart */}
            {user?._id && (
              <Link to={"/cart"} className='text-2xl relative group p-2 hover:bg-amber-50 rounded-full transition-all duration-200'>
                <FaShoppingCart className='text-gray-700 group-hover:text-amber-600 transition-colors duration-200' />
                {context?.cartProductCount > 0 && (
                  <div className='bg-gradient-to-r from-red-500 to-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center absolute -top-1 -right-1 text-xs font-bold animate-bounce shadow-lg'>
                    {context?.cartProductCount}
                  </div>
                )}
              </Link>
            )}

            {/* Auth Button */}
            <div>
              {user?._id ? (
                <button 
                  onClick={handleLogout} 
                  className='px-5 py-2 rounded-full text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105'
                >
                  Logout
                </button>
              ) : (
                <Link 
                  to={"/login"} 
                  className='px-5 py-2 rounded-full text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105'
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className='lg:hidden text-2xl text-gray-700 p-2 hover:bg-amber-50 rounded-full transition-all duration-200'
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <MdClose className="text-amber-600" /> : <HiMenuAlt3 />}
            </button>
          </div>
        </div>

          {/* Mobile Search Bar */}
          {searchOpen && (
            <div className='lg:hidden bg-white border-t px-4 py-3 shadow-lg' ref={searchRef}>
              <div className='flex items-center border-2 border-amber-200 rounded-full focus-within:border-amber-400 focus-within:shadow-lg pl-4 bg-amber-50'>
                <input 
                  type='text' 
                  placeholder='Search menu items...' 
                  className='w-full outline-none py-2 bg-transparent' 
                  onChange={handleSearch} 
                  value={search}
                  autoFocus
                />
                <div className='text-lg min-w-[50px] h-10 bg-gradient-to-r from-amber-600 to-amber-700 flex items-center justify-center rounded-r-full text-white'>
                  <GrSearch />
                </div>
              </div>
            </div>
          )}
        </header>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className='fixed inset-0 z-50 lg:hidden'>
          <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm' onClick={() => setMobileMenuOpen(false)} />
          <div className='fixed right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300'>
            <div className='p-6 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50'>
              <div className='flex items-center justify-between'>
                <div className="flex items-center gap-3">
                  <BiCoffee className='text-2xl text-amber-600' />
                  <h3 className='text-lg font-bold text-gray-800'>Menu</h3>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-amber-100 rounded-full transition-colors duration-200"
                >
                  <MdClose className='text-2xl text-gray-600' />
                </button>
              </div>
            </div>
            
            <nav className='p-6 space-y-4'>
              {navigationLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className='flex items-center gap-3 text-gray-700 hover:text-amber-600 transition-all duration-200 py-3 px-4 rounded-lg hover:bg-amber-50 font-medium'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
              
              <div className='border-t border-amber-100 pt-6 mt-6'>
                <div className='text-sm text-gray-600 space-y-3 bg-amber-50 p-4 rounded-lg'>
                  <div className='flex items-center gap-3'>
                    <FaClock className='text-amber-600' />
                    <div>
                      <p className="font-medium text-gray-800">Open Daily</p>
                      <p className="text-xs">Mon-Fri: {cafeHours.weekdays}</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-3'>
                    <FaPhone className='text-amber-600' />
                    <span className="font-medium">{cafeInfo.phone}</span>
                  </div>
                  <div className='flex items-center gap-3'>
                    <FaMapMarkerAlt className='text-amber-600' />
                    <span className="text-xs">{cafeInfo.address}</span>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

export default Header