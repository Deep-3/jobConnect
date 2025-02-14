import { Link, NavLink,useNavigate } from "react-router-dom";
import { FaSearch, FaComments, FaBell,FaUserCircle} from "react-icons/fa";
import {toast} from "react-hot-toast"

function Navbar({isLogin,setisLogin,User}) {
const navigate=useNavigate();

  const logoutHandler = async () => {
    try {
      // Show loading toast
      const loadingToast = toast.loading('Logging out...');
      await new Promise(resolve => setTimeout(resolve, 2000));  // 3 seconds delay

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      });
  
      // First dismiss loading toast
      toast.dismiss(loadingToast);
  
      if (response.ok) {
       setisLogin(false);
       toast.success('Logged out successfully', {
      id: loadingToast  // Replace loading toast
    });      

       navigate('/login',{replace:true})
      } else {
        const data = await response.json();
        toast.error(data.error || 'Logout failed. Please try again.', {
          id: loadingToast  // Replace loading toast
        });
        
        // If session expired
        if (response.status === 401) {
          setisLogin(false);
          navigate('/login',{replace:true})
          }
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Network error. Please check your connection.');
    }
  };
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-8xl mx-auto ml-[70px] px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo and Navigation */}
          <div className="flex items-center space-x-25">
            {/* Logo */}
            <Link to="/" className="text-[#0B877D] text-2xl font-bold">
              JobConnect
            </Link>

            {/* Main Navigation */}
            <div className="hidden md:flex items-center space-x-15  ">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-gray-600 hover:text-gray-900 font-medium ${
                    isActive ? "text-gray-900" : ""
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/companies"
                className={({ isActive }) =>
                  `text-gray-600 hover:text-gray-900 font-medium ${
                    isActive ? "text-gray-900" : ""
                  }`
                }
              >
                Companies
              </NavLink>
              <NavLink
                to="/community"
                className={({ isActive }) =>
                  `text-gray-600 hover:text-gray-900 font-medium ${
                    isActive ? "text-gray-900" : ""
                  }`
                }
              >
                Community
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `text-gray-600 hover:text-gray-900 font-medium ${
                    isActive ? "text-gray-900" : ""
                  }`
                }
              >
                Contact us
              </NavLink>
            </div>
          </div>

          {/* Right Section - Search, Icons, and Auth */}
          <div className="flex items-center space-x-6 ">
            {/* Search Bar */}
            <div className="hidden md:flex items-center relative">
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-[320px] px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
              />
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Icons */}
            <div className="hidden md:flex items-center space-x-3">
              <button className="text-gray-600 hover:text-gray-900">
                <FaComments className="w-5 h-5" />
              </button>
              <button className="text-gray-600 hover:text-gray-900">
                <FaBell className="w-5 h-5" />
              </button>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              { !isLogin&&
              <Link
                to="/login"
                className="px-4 py-2 text-[#0B877D] font-medium hover:bg-[#0B877D]/10 rounded-lg"
              >
                 <button>Sign In</button>
              </Link>
              } 
              {!isLogin &&
              <Link
                to="/register"
                className="px-4 py-2 bg-[#0B877D] text-white font-medium rounded-lg hover:bg-[#097267]"
              >
                <button>Register</button>
              </Link>
             }
               {isLogin &&
              <Link
                to="/Logout" 
                className="px-4 py-2 text-[#0B877D] font-medium hover:bg-[#0B877D]/10 rounded-lg"
              >
                <button onClick={logoutHandler}>Logout</button>
              </Link>
             }
               {isLogin &&
              <Link
              to="/Profile"
              className="flex items-center gap-2 px-4 py-2 bg-[#0B877D] text-white font-medium rounded-lg hover:bg-[#097267]"
            >
              <FaUserCircle className="w-5 h-5" />
              <span>{User?`${User.name.split(' ')[0]}`:'profile'}</span>
            </Link>
             }
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;