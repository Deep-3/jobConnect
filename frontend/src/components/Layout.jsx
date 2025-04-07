import { useState,useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import toast from 'react-hot-toast';
import { Outlet } from 'react-router-dom';
import {io} from "socket.io-client"
import { useDispatch, useSelector } from 'react-redux';
import {toggleSidebar} from "../redux/slices/UiSlice"

const Layout = () => {
 
  const {isSidebarOpen}=useSelector((state)=>state.ui)
  const dispatch=useDispatch()
  const {isLogin,User}=useSelector((state)=>state.auth)

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
    fetchNotifications();
   
    if (isLogin && User?.role=='employee' && !socket) {
       const newSocket = io(import.meta.env.VITE_BACKEND_URL);
      setSocket(newSocket);
      // console.log(socket);
      newSocket.emit('userConnected', User.id);
      // console.log(newSocket.id)
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
        
          newSocket.disconnect();
          setSocket(null);

      };
    }
  }, [User]);

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
              onClick={() =>dispatch(toggleSidebar()) }
            />
          )}

          {/* Fixed Sidebar */}
        
           <div className={`
              fixed left-0 top-[64px] bottom-0 
              w-[240px] bg-white
              transform transition-transform duration-300
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
              <Sidebar 
              />
            </div>
        
          
          {/* Scrollable Content */}
          <main className={`
            h-full overflow-y-auto bg-white
            transition-all duration-300
            ${isLogin ? (isSidebarOpen ? 'ml-[240px] max-lg:ml-0 ' : 'ml-0') : ''}
          `}>
            <Outlet/>
          </main>
        </div>
      </div>
    );
  };

export default Layout;