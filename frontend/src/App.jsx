// App.jsx
import { useState, useEffect } from 'react';
import { Route, Routes } from "react-router-dom";
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import MainHeader from './components/MainHeader';
import Login from './components/Login';
import SignUp from './components/SignUp';
import OTP from './components/Otp';
import SelectRole from './components/SelectRole';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [isLogin, setisLogin] = useState(false);
  const [User, setUser] = useState(null);
  const [IsLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/getuser`, {
          credentials: 'include'
        });
        const userData = await response.json();
        
        if (userData.user) {
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
        setIsLoading(false);
      }
    };
  
    checkAuth();
  }, [isLogin]);

  if (IsLoading) {  
    return (
      <div className="min-h-screen flex items-center justify-center bg-white mt-[-50px]">
        <div className="bg-white px-8 py-5 rounded-xl shadow-lg text-center space-y-4">
          {/* Spinner */}
          <div className="relative w-10 h-10 mx-auto">
            <div className="absolute inset-0 rounded-full border-[3px] border-[#e6f7f5]"></div>
            <div className="absolute inset-0 rounded-full border-[3px] border-[#0B877D] border-t-transparent animate-[spin_0.6s_linear_infinite]"></div>
          </div>
  
          {/* Text */}
          <div>
            <h2 className="text-[#0B877D] font-medium">Loading...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <Navbar 
          isLogin={isLogin} 
          setisLogin={setisLogin} 
          User={User} 
          setUser={setUser}
        />
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<MainHeader />}>
            <Route index element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login setisLogin={setisLogin} />} />
            <Route path="/register" element={<SignUp setisLogin={setisLogin} />} />
            <Route path="/otp" element={<OTP />} />
            <Route path="/selectrole" element={<SelectRole setisLogin={setisLogin} />} />
            <Route 
              path="*" 
              element={
                <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Page not found</h2>
                    <p className="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
                  </div>
                </div>
              }
            />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;