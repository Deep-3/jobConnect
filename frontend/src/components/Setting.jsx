import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaTimes, FaFilePdf, FaExpand, FaPlay } from "react-icons/fa";
import { FiUploadCloud } from "react-icons/fi";

const Settings = () => {
  const navigate = useNavigate();
  const { User } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileDetails, setProfileDetails] = useState({
    about: '',
    skills: '',
    certifications: '',
    experience: '',
    education: '',
    resumeUrl: null
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);
  const fileInputRef = useRef(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      previewFile(file);
      setSelectedFile(file);
      setProfileDetails(prev => ({
        ...prev,
        resumeUrl:file.name
      }));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDrop,
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error.code === 'file-too-large') {
        toast.error('File size should be less than 5MB');
      } else if (error.code === 'file-invalid-type') {
        toast.error('Please upload a PDF file');
      } else {
        toast.error('Invalid file. Please try again.');
      }
    }
  });

  const previewFile = (file) => {
    const fileUrl = URL.createObjectURL(file);
      setPreviewSource(fileUrl);
  };

  // Fetch profile data 
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/jobseeker/profile`, {
          credentials: 'include'
        });
        const data = await response.json();
        if (data.success) {
          setProfileDetails(data.data);
          if (data.data.resumeUrl) {
            setPreviewSource(data.data.resumeUrl);
          }
        }
      } catch (error) {
        toast.error("Failed to fetch profile data");
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file removal
  const handleRemoveFile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setSelectedFile(null);
      setPreviewSource(null);
      setProfileDetails(prev => ({
        ...prev,
        resumeUrl: null
      }));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      toast.success('File removed');
    } catch (error) {
      console.error('Error removing file:', error);
      toast.error('Error removing file');
    }
  };

  // Handle manual file selection
 
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!selectedFile && !profileDetails.resumeUrl) {
        toast.error('Please upload your resume');
        return;
      }

      setSaving(true);
      
      const formData = new FormData();
      
      // Append all profile details except resumeUrl
      Object.keys(profileDetails).forEach(key => {
        if (key !== 'resumeUrl') {
          formData.append(key, profileDetails[key]);
        }
      });
      
      // Append the file if it exists
      if (selectedFile) {
        formData.append('resume', selectedFile);
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/jobseeker/profile`, {
        method: 'PUT',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success('Profile updated successfully');
        navigate('/profile');
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='h-screen w-full flex justify-center items-center'>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white py-10'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8 flex items-center gap-4'>
          <button 
            onClick={() => navigate('/profile')}
            className='flex items-center gap-2 text-gray-600 hover:text-[#0B897D]'
          >
            <FaArrowLeft className='w-4 h-4' />
            Back to Profile
          </button>
          <h1 className='text-3xl font-bold text-gray-900'>Edit Profile</h1>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* About Section */}
          <div className='bg-white rounded-xl shadow-md p-6 border border-gray-200'>
            <h2 className='text-xl font-bold text-gray-900 mb-4'>About</h2>
            <textarea
              name="about"
              value={profileDetails.about}
              onChange={handleChange}
              rows="4"
              className='w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B897D] focus:border-transparent text-gray-900'
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Skills Section */}
          <div className='bg-white rounded-xl shadow-md p-6 border border-gray-200'>
            <h2 className='text-xl font-bold text-gray-900 mb-4'>Skills</h2>
            <textarea
              name="skills"
              value={profileDetails.skills}
              onChange={handleChange}
              rows="3"
              className='w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B897D] focus:border-transparent text-gray-900'
              placeholder="Enter your skills (comma separated)"
            />
          </div>

          {/* Experience Section */}
          <div className='bg-white rounded-xl shadow-md p-6 border border-gray-200'>
            <h2 className='text-xl font-bold text-gray-900 mb-4'>Experience</h2>
            <textarea
              name="experience"
              value={profileDetails.experience}
              onChange={handleChange}
              rows="4"
              className='w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B897D] focus:border-transparent text-gray-900'
              placeholder="Describe your work experience..."
            />
          </div>

          {/* Education Section */}
          <div className='bg-white rounded-xl shadow-md p-6 border border-gray-200'>
            <h2 className='text-xl font-bold text-gray-900 mb-4'>Education</h2>
            <textarea
              name="education"
              value={profileDetails.education}
              onChange={handleChange}
              rows="4"
              className='w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B897D] focus:border-transparent text-gray-900'
              placeholder="Enter your educational background..."
            />
          </div>

          {/* Certifications Section */}
          <div className='bg-white rounded-xl shadow-md p-6 border border-gray-200'>
            <h2 className='text-xl font-bold text-gray-900 mb-4'>Certifications</h2>
            <textarea
              name="certifications"
              value={profileDetails.certifications}
              onChange={handleChange}
              rows="3"
              className='w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B897D] focus:border-transparent text-gray-900'
              placeholder="List your certifications..."
            />
          </div>

          {/* Resume Upload Section */}
          <div className='bg-white rounded-xl shadow-md p-6 border border-gray-200'>
            <h2 className='text-xl font-bold text-gray-900 mb-4'>
              Resume <sup className="text-red-500">*</sup>
            </h2>
            
            <div
              {...getRootProps()}
              className={`${
                isDragActive ? "bg-[#0B897D]/10 border-[#0B897D]" : "bg-white border-gray-300"
              } flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted transition-colors duration-300 relative hover:border-[#0B897D] hover:bg-[#0B897D]/5`}
            >
              <input {...getInputProps()} />
              
              {isDragActive && (
                <div className="absolute inset-0 bg-[#0B897D]/10 flex items-center justify-center">
                  <p className="text-[#0B897D] font-medium">Drop your PDF file here...</p>
                </div>
              )}
              
              {previewSource ? (
                <div className='flex w-full flex-col p-6'>
                  {/* Course Thumbnail Style Preview */}
                  <div className='relative aspect-video bg-gradient-to-r from-[#0B897D] to-[#0B897D]/80 rounded-lg overflow-hidden'>
                    {/* Title Bar */}
                    <div className='absolute top-0 left-0 right-0 bg-white/30 text-gray-900 p-3 flex justify-between items-center'>
                      <span className='font-bold uppercase tracking-wider text-sm'>RESUME PREVIEW</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(previewSource, '_blank');
                        }}
                        className='p-2 hover:bg-[#0B897D]/10 rounded-full transition-colors'
                        title="Open Full Screen"
                      >
                        <FaExpand className='w-4 h-4' />
                      </button>
                    </div>

                    {/* Preview Content */}
                    <div className='h-full flex items-center justify-center'>
                      <iframe
                        src={`${previewSource}#toolbar=0`}
                        className='w-full h-full'
                        title="PDF Preview"
                      />
                    </div>

                    {/* Play Button Overlay */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(previewSource, '_blank');
                      }}
                      className='absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity'
                    >
                      <div className='w-16 h-16 rounded-full bg-[#0B897D] flex items-center justify-center'>
                        <FaPlay className='w-6 h-6 text-white ml-1' />
                      </div>
                    </button>
                  </div>

                  {/* File Info Bar */}
                  <div className='mt-4 bg-gray-50 p-4 rounded-lg flex items-center justify-between border border-gray-200'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 bg-[#0B897D]/10 rounded-full flex items-center justify-center'>
                        <FaFilePdf className='w-5 h-5 text-[#0B897D]' />
                      </div>
                      <div>
                        <p className='text-gray-900 font-medium'>{User?.name}_resume.pdf</p>
                        {selectedFile && (
                          <p className='text-sm text-gray-500'>
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className='p-2 text-gray-400 hover:text-red-500 transition-colors'
                    >
                      <FaTimes className='w-5 h-5' />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex w-full flex-col items-center p-6">
                  <div className="grid aspect-square w-14 place-items-center rounded-full bg-[#0B897D]/10">
                    <FiUploadCloud className="text-2xl text-[#0B897D]" />
                  </div>
                  <p className="mt-2 max-w-[200px] text-center text-sm text-gray-600">
                    Click here to upload or drag and drop your resume
                  </p>
                  <ul className="mt-10 flex list-disc justify-between space-x-12 text-center text-xs text-gray-500">
                    <li>Only PDF files</li>
                    <li>Max size 5MB</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className='flex justify-end'>
            <button
              type="submit"
              disabled={saving}
              className='px-6 py-3 bg-[#0B897D] text-white font-medium rounded-lg hover:bg-[#0B897D]/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings; 