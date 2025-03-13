// src/components/GoogleHandler.js
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setLogin } from '../redux/slices/AuthSlice';

const googleHandler = () => {
  const dispatch=useDispatch();
  const navigate = useNavigate();
  let isProcessing = false;
  let authWindow = null;  // Track the auth window


  const handleSocialLogin = async (platform) => {

    if (authWindow && !authWindow.closed) {
        authWindow.focus();  // Focus the existing window
        return;
      }
    const width = 400;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    const features = `
      width=${width},
      height=${height},
      left=${left},
      top=${top},
      toolbar=no,
      menubar=no,
      scrollbars=yes,
      resizable=yes,
      location=yes,
      status=no
    `.replace(/\s/g, '');

    authWindow = window.open(
      platform === 'google' 
        ? `${import.meta.env.VITE_BACKEND_URL}/gauth/google` 
        : `${import.meta.env.VITE_BACKEND_URL}/lauth/linkedin`,
      platform === 'google' ? 'Google Login' : 'LinkedIn Login',
      features
    );

    // Listen for message from popup
    const messageHandler = (event) => {
        if (event.origin === import.meta.env.VITE_BACKEND_URL && !isProcessing) {
            isProcessing = true;
          const { success, isNewUser, message } = event.data;
          
          // Remove event listener first
          window.removeEventListener('message', messageHandler);
          
          if (success) {
            if (isNewUser) {
              toast.success('Please select your role');
              navigate('/selectrole');
            } else {
              toast.success('Login successful');
              dispatch(setLogin(true));
              navigate('/');
            }
          } else {
            toast.error(message || 'Login failed');
          }
          authWindow.close();
          authWindow = null;  // Reset the window reference
          
        }
      };
    
      // Add event listener
      window.addEventListener('message', messageHandler);
  };

  return handleSocialLogin;
};

export default googleHandler;