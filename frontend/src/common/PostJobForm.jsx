import React from 'react';
import { useForm } from 'react-hook-form';
import Iconbutton from './Iconbutton';
import { toast } from 'react-hot-toast';

const JobPostModal = ({ setmodal,getjob}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      salary: {
        min: '',
        max: '',
        currency: 'rupee'
      }
    }
  });

  const onSubmit = async (data) => {
    try {
      // Format the data to match the required structure
      const formattedData = {
        ...data,
        salary: {
          min: parseInt(data.salary.min),
          max: parseInt(data.salary.max),
          currency: data.salary.currency
        }
      };

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/employer/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formattedData)
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('Job posted successfully!');
        getjob();
        reset();
        setmodal(false)
      } else {
        toast.error(result.message || 'Failed to post job');
      }
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error('Something went wrong');
    }
  };

  return (
        <div className="fixed inset-0 z-[1000] !mt-0 bg-black/30 grid place-items-center overflow-auto bg-opacity-50">
          <div className="w-11/12 max-w-[600px] rounded-lg border border-black-500 bg-white p-6">
            <div className="flex justify-between items-center mb-6">
              <p className="text-2xl font-semibold text-gray-800">
                Post a New Job
              </p>
              <button 
                onClick={()=>{setmodal(false)}}
                className="text-gray-600 hover:text-gray-800"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Job Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  {...register("title", { 
                    required: "Job title is required" 
                  })}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-[#0B877D]"
                  placeholder="Ex: Senior MERN Stack Developer"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Job Description
                </label>
                <textarea
                  {...register("description", { 
                    required: "Job description is required",
                    minLength: {
                      value: 20,
                      message: "Description must be at least 50 characters"
                    }
                  })}
                  rows="4"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-[#0B877D]"
                  placeholder="Describe the role and responsibilities"
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Requirements
                </label>
                <textarea
                  {...register("requirements", { 
                    required: "Requirements are required" 
                  })}
                  rows="4"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-[#0B877D]"
                  placeholder="List the job requirements"
                ></textarea>
                {errors.requirements && (
                  <p className="text-red-500 text-sm mt-1">{errors.requirements.message}</p>
                )}
              </div>

              {/* Job Type and Experience Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Job Type
                  </label>
                  <select
                    {...register("jobType", { 
                      required: "Job type is required" 
                    })}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-[#0B877D]"
                  >
                    <option value="">Select job type</option>
                    <option value="full-time">Full Time</option>
                    <option value="part time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="remote">Remote</option>
                    <option value="internship">Internship</option>
                  </select>
                  {errors.jobType && (
                    <p className="text-red-500 text-sm mt-1">{errors.jobType.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Experience Level
                  </label>
                  <select
                    {...register("experienceLevel", { 
                      required: "Experience level is required" 
                    })}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-[#0B877D]"
                  >
                    <option value="">Select experience level</option>
                    <option value="entry">Entry Level</option>
                    <option value="mid-level">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="lead">Lead</option>
                  </select>
                  {errors.experienceLevel && (
                    <p className="text-red-500 text-sm mt-1">{errors.experienceLevel.message}</p>
                  )}
                </div>
              </div>

              {/* Salary Range */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Minimum Salary
                  </label>
                  <input
                    type="number"
                    {...register("salary.min", { 
                      required: "Minimum salary is required",
                      min: {
                        value: 0,
                        message: "Salary cannot be negative"
                      }
                    })}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-[#0B877D]"
                    placeholder="Min salary"
                  />
                  {errors.salary?.min && (
                    <p className="text-red-500 text-sm mt-1">{errors.salary.min.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Maximum Salary
                  </label>
                  <input
                    type="number"
                    {...register("salary.max", { 
                      required: "Maximum salary is required",
                      min: {
                        value: 0,
                        message: "Salary cannot be negative"
                      }
                    })}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-[#0B877D]"
                    placeholder="Max salary"
                  />
                  {errors.salary?.max && (
                    <p className="text-red-500 text-sm mt-1">{errors.salary.max.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Currency
                  </label>
                  <select
                    {...register("salary.currency")}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-[#0B877D]"
                  >
                    <option value="rupee">Rupee (₹)</option>
                    <option value="usd">USD ($)</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  {...register("location", { 
                    required: "Location is required" 
                  })}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-[#0B877D]"
                  placeholder="Ex: Remote, Mumbai, Delhi"
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-x-4 mt-6">
                <Iconbutton
                  type="submit"
                  text="Post Job"
                />
                <button
                  type="button"
                  className="cursor-pointer rounded-md bg-gray-200 py-[8px] px-[20px] font-semibold text-gray-900 hover:bg-gray-300"
                  onClick={() => {
                    reset();
                   setmodal(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
  );
};

export default JobPostModal;