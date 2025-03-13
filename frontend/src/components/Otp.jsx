import React, { useState, useEffect } from 'react';
import { replace, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { toggleLoading } from '../redux/slices/UiSlice';
import { useDispatch,useSelector } from 'react-redux';


const OTP = () => {
  const {isLoading}=useSelector((state)=>state.auth);
const dispatch=useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [otpLoading,setotpLoading]=useState(false);

  // Redirect if no email is present
  useEffect(() => {
    if (!email) {
      navigate('/signup');
      toast.error('Please sign up first');
    }
  }, [email, navigate]);

  // Timer for resend OTP
  useEffect(() => {
    const countdown = timer > 0 && setInterval(() => setTimer(timer - 1), 1000);
    if (timer === 0) setCanResend(true);
    return () => clearInterval(countdown);
  }, [timer]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.value && index < 5) {
      const nextInput = element.parentElement.nextElementSibling?.querySelector('input');
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = e.target.parentElement.previousElementSibling?.querySelector('input');
      if (prevInput) {
        prevInput.focus();
        setOtp([...otp.map((d, idx) => (idx === index - 1 ? '' : d))]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }
   setotpLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/verifyotp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({email,otp: otpString })
      });

      if (response.status === 200) {
        await new Promise(resolve => setTimeout(resolve, 2000)); 
        toast.success('Email verified successfully');
        navigate('/selectrole',{state:{email},replace:true});
      } else {
        const data = await response.json();
        toast.error(data.message || 'Invalid OTP');
        // Clear OTP inputs on error
        setOtp(['', '', '', '', '', '']);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('Something went wrong');
    }finally
    {
      setotpLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

     dispatch(toggleLoading());
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/verifyotp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email,resend:true })
      });

      if (response.status === 200) {
        toast.success('OTP resent successfully');
        setTimer(30);
        setCanResend(false);
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error('Failed to resend OTP');
    }
    finally
    {
       dispatch(toggleLoading())
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-8">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-[440px]">
        <h2 className="text-2xl text-slate-800 mb-2 text-center">Verify Your Email</h2>
        {email ? (
          <p className="text-slate-500 text-center mb-8">
            We've sent a verification code to<br />
            <span className="font-medium text-slate-700">{email}</span>
          </p>
        ) : (
          <p className="text-slate-500 text-center mb-8">Loading...</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <div key={index} className="w-12">
                <input
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-full h-12 text-center border border-slate-200 rounded-lg text-lg focus:outline-none focus:border-[#0B877D]"
                  autoFocus={index === 0}
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={otpLoading}
            className={`bg-[#0B877D] text-white py-3.5 rounded-lg text-base font-medium 
              ${otpLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#097267]'} 
              transition-colors flex items-center justify-center`}
          >
            {otpLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Please wait...
              </>
            ) : (
              'Verify Email'
            )}
          </button>
        </form>

        <div className="text-center mt-6">
  <p className="text-slate-500 text-sm">
    Didn't receive the code?{' '}
    {canResend ? (
      <button
        onClick={handleResendOTP}
        disabled={isLoading}
        className={`
          font-medium transition-all duration-300 inline-flex items-center gap-2
          ${isLoading 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-[#0B877D] hover:text-[#097267]'
          }
        `}
      >
        {isLoading ? (
          <>
            <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <span>Sending...</span>
          </>
        ) : (
          'Resend OTP'
        )}
      </button>
    ) : (
      <span className="inline-flex items-center gap-2 text-gray-400">
        Resend in <span className="font-medium text-[#0B877D]">{timer}s</span>
      </span>
    )}
   </p>
    </div>
      </div>
    </div>
  );
};

export default OTP;