import { useState,useEffect } from 'react'
import { Route, Routes } from "react-router-dom"
import Home from './components/Home'
import About from './components/About'
import Contact from './components/Contact'
import MainHeader from './components/MainHeader'
import Login from './components/Login'
import SignUp from './components/SignUp'
import OTP from './components/Otp'
import SelectRole from './components/SelectRole'
import './App.css'
import Navbar from './components/Navbar'

function App() {
  const [isLogin, setisLogin] = useState(false);
  const [User,setUser]=useState(null);
  const [IsLoading,setIsLoading]=useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/getuser`, {
          credentials: 'include'
        });
        const userData = await response.json();
        // console.log("API Response:", userData);
        
        if (userData.user) {
          // console.log(userData.user)
          setUser(userData.user);
          setisLogin(true);
        } else {
          setisLogin(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setisLogin(false);
        setUser(null);
      } finally {
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        setIsLoading(false);
      }
    };
  
    checkAuth();
  }, [isLogin]);
  
  // Add another useEffect to watch user state changes
  if (IsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fffe]">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center space-y-4 max-w-sm mx-auto">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-8 border-[#e6f7f5]"></div>
            <div className="absolute inset-0 rounded-full border-8 border-t-[#0B877D] animate-spin"></div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#0B877D]">Just a moment</h2>
            <p className="text-gray-500 mt-2 text-sm">We're preparing everything for you</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar isLogin={isLogin} setisLogin={setisLogin} User={User} setUser={setUser}/>
      <Routes>
        <Route path="/" element={<MainHeader/>}>
          <Route index element={<Home/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/login" element={<Login setisLogin={setisLogin}/>}/>
          <Route path="/register" element={<SignUp setisLogin={setisLogin}/>}/>
          <Route path="/otp" element={<OTP/>}/>
          <Route path="/selectrole" element={<SelectRole setisLogin={setisLogin}/>}/>
          <Route path="*" element={<div className='mt-[300px]'>Page not found</div>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App