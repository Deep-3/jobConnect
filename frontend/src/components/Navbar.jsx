import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaSearch, FaComments, FaBell, FaUserCircle, FaBars } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useState, useRef, useEffect } from "react";

function Navbar({ isLogin, setisLogin, User, isSidebarOpen, setIsSidebarOpen, notifications, setNotifications, markAllAsRead }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const notificationRef = useRef(null);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const logoutHandler = async () => {
    try {
      const loadingToast = toast.loading('Logging out...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      });

      toast.dismiss(loadingToast);

      if (response.ok) {
        setisLogin(false);
        toast.success('Logged out successfully', {
          id: loadingToast
        });
        navigate('/login', { replace: true });
      } else {
        const data = await response.json();
        toast.error(data.error || 'Logout failed. Please try again.', {
          id: loadingToast
        });

        if (response.status === 401) {
          setisLogin(false);
          navigate('/login', { replace: true });
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Network error. Please check your connection.');
    }
  };

  // Handle single notification click
  const handleNotificationClick = async (notificationId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/notifications/${notificationId}/read`,
      {
        method: 'PUT',
        credentials: 'include'
      }
    );

    if (response.ok) {
      // Remove the notification from the state
      setNotifications(prev => 
        prev.filter(notif => notif.id !== notificationId)
      );
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
    toast.error('Failed to mark notification as read');
  }
};
  // Get unread notifications count
  const unreadCount = notifications?.filter(notif => !notif.isRead).length || 0;

  // Format notification time
  const formatNotificationTime = (timestamp) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notifTime) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return notifTime.toLocaleDateString();
  };

  return (
    <nav className="bg-white shadow-md z-40 sticky top-0">
      <div className="max-w-8xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`text-gray-600 hover:text-gray-900 focus:outline-none ${!isLogin ? 'lg:hidden' : ''}`}
            >
              <FaBars className="w-6 h-6" />
            </button>

            <Link to="/" className="text-[#0B877D] text-2xl font-bold">
              JobConnect
            </Link>

            {/* Navigation Links */}
            {!isLogin && (
              <div className="hidden md:flex items-center space-x-8 ml-8">
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
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-6">
            {/* Search Bar */}
            <div className="hidden md:flex items-center relative">
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-[320px] px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:border-[#0B877D]"
              />
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Icons */}
            {isLogin && (
              <div className="hidden md:flex items-center space-x-3">
                <button className="text-gray-600 hover:text-gray-900">
                  <FaComments className="w-5 h-5" />
                </button>
                <div className="relative" ref={notificationRef}>
                  <button 
                    className="text-gray-600 hover:text-gray-900 relative"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <FaBell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border py-2 z-50">
                      <div className="flex justify-between items-center px-4 py-2 border-b">
                        <h3 className="font-medium">Notifications</h3>
                        {notifications?.length > 0 && (
                          <button
                            onClick={() => {
                              markAllAsRead();
                              setShowNotifications(false);
                            }}
                            className="text-sm text-[#0B877D] hover:text-[#097267]"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                      
                      {!notifications || notifications.length === 0 ? (
                        <p className="text-gray-500 text-sm p-4 text-center">
                          No new notifications
                        </p>
                      ) : (
                        <div className="max-h-[400px] overflow-y-auto">
                          {notifications.map((notif) => (
                            <div 
                              key={notif.id}
                              onClick={() => handleNotificationClick(notif.id)}
                              className={`px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 cursor-pointer
                                ${notif.isRead ? 'bg-gray-50' : 'bg-white'}`}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="text-sm">
                                    <span className="font-medium">{notif.data?.applicantName}</span>
                                    {' '}applied for{' '}
                                    <span className="font-medium">{notif.data?.jobTitle}</span>
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {formatNotificationTime(notif.createdAt)}
                                  </p>
                                </div>
                                {!notif.isRead && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3 max-lg:hidden">
              {!isLogin ? (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-[#0B877D] font-medium hover:bg-[#0B877D]/10 rounded-lg"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-[#0B877D] text-white font-medium rounded-lg hover:bg-[#097267]"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={logoutHandler}
                    className="px-4 py-2 text-[#0B877D] font-medium hover:bg-[#0B877D]/10 rounded-lg"
                  >
                    Logout
                  </button>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 bg-[#0B877D] text-white font-medium rounded-lg hover:bg-[#097267]"
                  >
                    <FaUserCircle className="w-5 h-5" />
                    <span>{User ? User.name.split(' ')[0] : 'Profile'}</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;