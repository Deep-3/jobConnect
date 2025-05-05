import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaBriefcase, FaBuilding } from 'react-icons/fa';
import { setLogin } from '../redux/slices/AuthSlice';
import { useDispatch } from 'react-redux';

const SelectRole = () => {
  const dispatch=useDispatch()
  const navigate = useNavigate();
  const location = useLocation();
  const[loading,setloading]=useState(false);
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/register');
      toast.error('Please sign up first');
    }
  }, [email, navigate]);

  const handleRoleSelect = async (role) => {
    try {
      setloading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/select-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ role })
      });
      if (response.ok) {
        dispatch(setLogin(true));
        toast.success(`Registered successfully as ${role}`);
        navigate('/',{replace:true});
      } else {
        const data = await response.json();
        toast.error(data.error || 'Role selection failed');
      }
    } catch (error) {
      console.error('Role selection error:', error);
      toast.error('Something went wrong');
    }finally
    {
      setloading(false);
    }
  };

  if(loading)
  {
    return (
      <div className=' h-screen w-full flex justify-center items-center'>
              <div className="loader"></div>
      </div>

    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
          Choose Your Role
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Select how you want to use our platform
        </p>

        <div className="space-y-4">
          {/* Job Seeker Button */}
          <button
            onClick={() => handleRoleSelect('jobseeker')}
            className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-[#0B877D] hover:bg-[#0B877D]/5 transition-all group"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-[#0B877D]/10 rounded-full group-hover:bg-[#0B877D]">
              <FaBriefcase className="text-xl text-[#0B877D] group-hover:text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-gray-800">Job Seeker</h3>
              <p className="text-sm text-gray-500">Find your dream job</p>
            </div>
          </button>

          {/* Employer Button */}
          <button
            onClick={() => handleRoleSelect('employee')}
            className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-[#0B877D] hover:bg-[#0B877D]/5 transition-all group"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-[#0B877D]/10 rounded-full group-hover:bg-[#0B877D]">
              <FaBuilding className="text-xl text-[#0B877D] group-hover:text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-gray-800">Employer</h3>
              <p className="text-sm text-gray-500">Post jobs and find talent</p>
            </div>
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          You can't change your role after selection
        </p>
      </div>
      
    </div>
    
  );
};

export default SelectRole;