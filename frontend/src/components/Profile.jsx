import React from 'react';
import { useSelector } from 'react-redux';
import { FaRegEdit } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const { User } = useSelector((state) => state.auth);

  return (
    <div className='min-h-screen bg-gray-50 py-10'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-10'>
          <h1 className='text-3xl font-bold text-gray-900'>
            My Profile
          </h1>
        </div>

        {/* Profile Card */}
        <div className='bg-white rounded-xl shadow-md p-6 mb-8'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-6'>
              <div className='relative'>
                <img 
                  className="w-24 h-24 rounded-full border-4 border-[#0B877D]" 
                  src={`https://api.dicebear.com/5.x/initials/svg?seed=${User?.name.split(" ")[0]} ${User?.name.split(" ")[User.name.split(" ").length-1]}&backgroundColor=0B877D`} 
                  alt="Profile" 
                /> 
              </div>
              <div>
                <h2 className='text-2xl font-bold text-gray-900'>{User?.name}</h2>
                <p className='text-gray-600 font-medium'>{User?.email}</p>
              </div>
            </div>
            <button 
              onClick={() => navigate("/settings")}
              className='flex items-center gap-2 px-6 py-3 bg-[#0B877D] text-white font-medium rounded-lg hover:bg-[#097267] transition-all duration-300 shadow-sm hover:shadow-md'
            >
              Edit Profile <FaRegEdit className='w-4 h-4'/>
            </button>
          </div>
        </div>

        {/* About Section */}
        <div className='bg-white rounded-xl shadow-md mb-8'>
          <div className='p-6 border-b border-gray-100'>
            <div className='flex justify-between items-center'>
              <h3 className='text-xl font-bold text-gray-900'>About</h3>
              <button 
                onClick={() => navigate("/settings")}
                className='flex items-center gap-2 px-4 py-2 bg-[#0B877D] text-white font-medium rounded-lg hover:bg-[#097267] transition-all duration-300'
              >
                Edit <FaRegEdit className='w-3 h-3'/>
              </button>
            </div>
          </div>
          <div className='p-6'>
            <p className='text-gray-600'>
              {User?.jobSeekerProfile?.about || "Please write about yourself"}
            </p>
          </div>
        </div>

        {/* Details Section */}
        <div className='bg-white rounded-xl shadow-md mb-8'>
          <div className='p-6 border-b border-gray-100'>
            <div className='flex justify-between items-center'>
              <h3 className='text-xl font-bold text-gray-900'>Details</h3>
              <button 
                onClick={() => navigate("/settings")}
                className='flex items-center gap-2 px-4 py-2 bg-[#0B877D] text-white font-medium rounded-lg hover:bg-[#097267] transition-all duration-300'
              >
                Edit <FaRegEdit className='w-3 h-3'/>
              </button>
            </div>
          </div>

          <div className='p-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Skills */}
            <div className='bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-300'>
              <div className='flex items-center gap-3 mb-4'>
                <span className='text-2xl'>💡</span>
                <h4 className='text-lg font-semibold text-gray-900'>Skills</h4>
              </div>
              <p className='text-gray-600 ml-10'>
                {User?.jobSeekerProfile?.skills || 
                <span className="text-gray-400 italic">No skills added yet</span>}
              </p>
            </div>

            {/* Resume */}
            <div className='bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-300'>
              <div className='flex items-center gap-3 mb-4'>
                <span className='text-2xl'>📄</span>
                <h4 className='text-lg font-semibold text-gray-900'>Resume</h4>
              </div>
              <div className='ml-10'>
                {User?.jobSeekerProfile?.resumeUrl ? (
                  <a 
                    href="https://jobplatform.s3.ap-south-1.amazonaws.com/company-logos/3-1740566391826-tuvoc_technologies_logo.jpg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className='inline-flex items-center gap-2 text-[#0B877D] hover:text-[#097267] font-medium transition-all duration-300'
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View Resume
                  </a>
                ) : (
                  <span className="text-gray-400 italic">No resume uploaded</span>
                )}
              </div>
            </div>

            {/* Certifications */}
            <div className='bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-300'>
              <div className='flex items-center gap-3 mb-4'>
                <span className='text-2xl'>🏆</span>
                <h4 className='text-lg font-semibold text-gray-900'>Certifications</h4>
              </div>
              <p className='text-gray-600 ml-10'>
                {User?.jobSeekerProfile?.certifications || 
                <span className="text-gray-400 italic">No certifications added yet</span>}
              </p>
            </div>

            {/* Experience */}
            <div className='bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-300'>
              <div className='flex items-center gap-3 mb-4'>
                <span className='text-2xl'>💼</span>
                <h4 className='text-lg font-semibold text-gray-900'>Experience</h4>
              </div>
              <p className='text-gray-600 ml-10'>
                {User?.jobSeekerProfile?.experience || 
                <span className="text-gray-400 italic">No experience added yet</span>}
              </p>
            </div>

            {/* Education */}
            <div className='bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-300'>
              <div className='flex items-center gap-3 mb-4'>
                <span className='text-2xl'>🎓</span>
                <h4 className='text-lg font-semibold text-gray-900'>Education</h4>
              </div>
              <p className='text-gray-600 ml-10'>
                {User?.jobSeekerProfile?.education || 
                <span className="text-gray-400 italic">No education details added yet</span>}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;