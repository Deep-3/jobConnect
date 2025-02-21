import { useState,useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import toast from 'react-hot-toast';
import {io} from "socket.io-client"

const Layout = ({ children, isLogin, setisLogin, User }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      if (User && User.role === 'employee') {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/notifications/${User.id}`, {
          credentials: 'include'
        });
        const data = await response.json();
        if (data.success) {
          setNotifications(data.notifications);
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    // Fetch notifications when component mounts and User is available
    if (isLogin) {
      fetchNotifications();
    }
  }, [isLogin, User]);

  useEffect(() => {
    if (isLogin && User && !socket) {
      const newSocket = io(import.meta.env.VITE_BACKEND_URL);
      setSocket(newSocket);

      newSocket.emit('userConnected', User.id);

      if (User.role === 'employee') {
        newSocket.on('newApplication', (notification) => {
          setNotifications(prev => {
            // Check if notification already exists
            const exists = prev.some(n => n.id === notification.id);
            if (!exists) {
              return [notification,...prev];
            }
            return prev;
          });
          // toast.success(`New application received for ${notification.data.jobTitle}`);

        });
      }

      return () => {
        if (socket) {
          newSocket.close();
          setSocket(null);
        }
      };
    }
  }, [isLogin, User]);

  const markAllAsRead = async () => {
    try {
      if (User) {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/notifications/mark-all-read`,
          {
            method: 'PUT',
            credentials: 'include'
          }
        );
        
        if (response.ok) {
          setNotifications([]);
          toast.success('All notifications marked as read');
        }
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      toast.error('Failed to mark notifications as read');
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-white">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar 
          isLogin={isLogin} 
          setisLogin={setisLogin} 
          User={User}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}   
          notifications={notifications}
          setNotifications={setNotifications}
          markAllAsRead={markAllAsRead}
        />
      </div>
        
        {/* Main Content Area */}
        <div className="mt-[64px] h-[calc(100vh-64px)] relative">
          {/* Overlay for mobile */}
          {isSidebarOpen && (
            <div 
              className="lg:hidden fixed inset-0  z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Fixed Sidebar */}
        
           <div className={`
              fixed left-0 top-[64px] bottom-0 
              w-[240px] bg-white z-50
              transform transition-transform duration-300
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
              <Sidebar 
                isOpen={isSidebarOpen} 
                setIsOpen={setIsSidebarOpen} 
                User={User}
                isLogin={isLogin}
              />
            </div>
        
          
          {/* Scrollable Content */}
          <main className={`
            h-full overflow-y-auto bg-white
            transition-all duration-300
            ${isLogin ? (isSidebarOpen ? 'ml-[240px] max-lg:ml-0 ' : 'ml-0') : ''}
          `}>
            {children}
          </main>
        </div>
      </div>
    );
  };

export default Layout;