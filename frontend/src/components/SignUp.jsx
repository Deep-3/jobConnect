import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaLinkedin, FaUser } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import googleHandler from './GoogleHandler';

const SignUp = ({setisLogin}) => {
  const handleSocialLogin = googleHandler();  // Custom hook use કરો
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        navigate('/otp', { state: { email: formData.email } });
      } else {
        const data = await response.json();
        toast.error(data.error);
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-8">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-[440px]">
        <h2 className="text-2xl text-slate-800 mb-2 text-center">Create Account</h2>
        <p className="text-slate-500 text-center mb-8">Sign up to get started</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full py-3.5 px-4 pl-11 border border-slate-200 rounded-lg text-base focus:outline-none focus:border-[#0B877D]"
            />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full py-3.5 px-4 pl-11 border border-slate-200 rounded-lg text-base focus:outline-none focus:border-[#0B877D]"
            />
          </div>

          {['password', 'confirmPassword'].map((field) => (
            <div className="relative" key={field}>
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword[field] ? "text" : "password"}
                name={field}
                placeholder={field === 'password' ? "Password" : "Confirm Password"}
                value={formData[field]}
                onChange={handleChange}
                required
                className="w-full py-3.5 px-4 pl-11 border border-slate-200 rounded-lg text-base focus:outline-none focus:border-[#0B877D]"
              />
              <span
                onClick={() => setShowPassword(prev => ({...prev, [field]: !prev[field]}))}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-500 text-xl"
              >
                {showPassword[field] ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </span>
            </div>
          ))}

          <button
            type="submit"
            disabled={isLoading}
            className={`bg-[#0B877D] text-white py-3.5 rounded-lg text-base font-medium 
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
              'Sign Up'
            )}
          </button>
        </form>

        <div className="text-center my-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <span className="relative bg-white px-4 text-sm text-slate-500">or continue with</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      
          <button className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 rounded-lg text-slate-800 hover:bg-slate-50 hover:border-red-600 hover:text-red-600 transition-all"
           onClick={()=>handleSocialLogin('google',setisLogin)}
          >
            <FcGoogle />
            <span>Google</span>
            </button>

            <button 
            className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 rounded-lg text-slate-800 hover:bg-slate-50 hover:border-[#0077b5] hover:text-[#0077b5] transition-all"
           onClick={()=>handleSocialLogin('linkedin',setisLogin)}
            >
            <FaLinkedin className='text-[#0077b5]' />
            <span>LinkedIn</span>
            </button>
        </div>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <button 
            onClick={() => setisLogin(true)} 
            className="text-[#0B877D] font-medium hover:text-[#097267]"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;