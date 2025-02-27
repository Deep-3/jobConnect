// CommunityChat.jsx
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { IoMdSend } from "react-icons/io";
import { FaUsers } from 'react-icons/fa';
import toast from 'react-hot-toast'; // Add this import

function Community({ User }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state
  const [sendingMessage, setSendingMessage] = useState(false); // Add sending state
  const socketRef = useRef();
  const chatRef = useRef(null);

  // Check if user is job seeker
  const isJobSeeker = User?.role === 'jobseeker';

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);
  // Fetch old messages
  useEffect(() => {
    if (!isJobSeeker) return;
    fetchOldMessages();
  }, [isJobSeeker]);

  const fetchOldMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/community`,
        {
          credentials: 'include'
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.message || []);
        
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

 

  useEffect(() => {
    if (!isJobSeeker) return;

    const socket = io(import.meta.env.VITE_BACKEND_URL);
    socketRef.current = socket;

    socket.emit('userConnected', User.id);
    socket.emit('joinCommunity', {
      userId: User.id,
      name: User.name
    });

    socket.on('communityMessage', (message) => {
      setMessages(prev => {
        return [...prev, message];
      });

    });

    // Add error handling
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      toast.error('Connection error. Please try again.');
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [User, isJobSeeker]);

  const sendMessage = async () => {
    if (!newMessage.trim() || sendingMessage) return;

    try {
      setSendingMessage(true);
      const messageData = {
        userId: User.id.toString(),
        userName: User.name,
        text: newMessage.trim(),
        timestamp: new Date()
      };

      // Save to database first
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/community`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(messageData)
        }
      );

      if (response.ok) {
        socketRef.current.emit('sendCommunityMessage', messageData);
        setNewMessage('');
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  if (!isJobSeeker) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Community Chat Access Restricted
          </h2>
          <p className="text-gray-600 mt-2">
            Only job seekers can access the community chat.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 ">

      <div className='w-full h-5 bg-[#0B877D] flex justify-center fixed relative bg-white'>
        <FaUsers className='w-5 h-5 mr-2'/>
        Community
        </div>

      <div 
        ref={chatRef}
        className="bg-white rounded-lg shadow p-4 h-[500px] overflow-y-auto mb-4"
      >
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className=" animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0B877D]"></div>
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg, index) => (
            <div 
              key={index}
              className={`mb-4 ${msg.userId === User.id.toString() ? 'text-right' : ''}`}
            >
              <div className={`
                inline-block rounded-lg p-3 max-w-[70%]
                ${msg.userId === User.id.toString() 
                  ? 'bg-[#0B877D] text-white' 
                  : 'bg-gray-100'
                }
              `}>
                <p className="font-medium text-sm">
                  {msg.userId === User.id.toString() ? '' : msg.userName?.split(" ").slice(0,2).join(" ")}
                </p>
                <p className="break-words">{msg.text}</p>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-4">
            No messages yet. Start the conversation!
          </div>
        )}
      </div>

      <div className="flex gap-2">
      <textarea
    value={newMessage}
    onChange={(e) => setNewMessage(e.target.value)}
    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
    placeholder="Type your message..."
    className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:border-[#0B877D]"
    disabled={loading || sendingMessage}
    rows={1}
    style={{ minHeight: '42px' }}
  />
        <button
          onClick={sendMessage}
          disabled={loading || sendingMessage || !newMessage.trim()}
          className={`
            px-6 py-2 rounded-lg transition-colors
            ${loading || sendingMessage || !newMessage.trim()
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-[#0B877D] hover:bg-[#097267]'
            }
          `}
        >
          {sendingMessage ? (
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <IoMdSend className="text-white" />
          )}
        </button>
      </div>
    </div>
  );
}

export default Community;