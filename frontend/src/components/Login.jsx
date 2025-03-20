import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {FaEnvelope, FaLock,FaLinkedin} from 'react-icons/fa';
import { FcGoogle} from 'react-icons/fc';
import {useNavigate} from "react-router-dom"
import { AiOutlineEye,AiOutlineEyeInvisible} from 'react-icons/ai';
import {toast} from 'react-hot-toast';
import googleHandler from './GoogleHandler';
import { setLogin } from '../redux/slices/AuthSlice';
import { useDispatch,useSelector } from 'react-redux';
import { toggleLoading } from '../redux/slices/UiSlice';



const Login = () => {
  
  const {isLoading}=useSelector((state)=>state.ui)
  const dispatch=useDispatch();
const Navigate=useNavigate();
const handleSocialLogin=googleHandler();
  


  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const[showPassword,setshowPassword]=useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
   dispatch(toggleLoading())
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        await new Promise(resolve => setTimeout(resolve, 2000)); 
        dispatch(setLogin(true));
        Navigate('/');
        toast.success("Login Successfully")

      } else {
        const data = await response.json();
        toast.error(data.error);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
    finally {
     dispatch(toggleLoading())   
    }
  };
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-[400px] mx-4">
          <h2 className="text-2xl text-slate-800 mb-1.5 text-center">Welcome Back</h2>
          <p className="text-slate-500 text-center mb-5">Sign in to access your account</p>
  
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Email Input */}
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                autoComplete="current-email"
                required
                className="w-full py-3 px-4 pl-11 border border-slate-200 rounded-lg text-base focus:outline-none focus:border-[#0B877D]"
              />
            </div>
  
            {/* Password Input */}
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}  
                required
                autoComplete="current-password"  
                className="w-full py-3 px-4 pl-11 border border-slate-200 rounded-lg text-base focus:outline-none focus:border-[#0B877D]"
              />
              <span 
                onClick={() => setshowPassword(prev => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-500 text-xl"
              >
                {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </span>
            </div>
  
            {/* Remember & Forgot */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 text-slate-500">
                <input type="checkbox" className="rounded" /> Remember me
              </label>
              <a href="/forgot-password" className="text-[#0B877D] hover:text-[#097267] transition-colors">
                Forgot Password?
              </a>
            </div>
  
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#0B877D] text-white py-3 rounded-lg text-base font-medium 
                ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#097267]'} 
                transition-colors flex items-center justify-center`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
  
          {/* Divider */}
          <div className="text-center my-3 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <span className="relative bg-white px-4 text-sm text-slate-500">or continue with</span>
          </div>
  
          {/* Social Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <button 
              onClick={() => handleSocialLogin('google')}
              className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 rounded-lg text-slate-800 hover:bg-slate-50 hover:border-red-600 hover:text-red-600 transition-all"
            >
              <FcGoogle />
              <span>Google</span>
            </button>
            
            <button 
              onClick={() => handleSocialLogin('linkedin')}
              className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 rounded-lg text-slate-800 hover:bg-slate-50 hover:border-[#0077b5] hover:text-[#0077b5] transition-all"
            >
              <FaLinkedin className='text-[#0077b5]' />
              <span>LinkedIn</span>
            </button>
          </div>
  
          {/* Sign up Link */}
          <p className="text-center text-sm text-slate-500">
            Don't have an account? {" "}
            
           <NavLink to="/register" className="text-[#0B877D] font-medium hover:text-[#097267] transition-colors">
           Sign Up
            </NavLink>
          </p>
        </div>
      </div>
    );
  };

export default Login;
