import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { add, remove } from "../redux/slices/JobSlice"
import { toast } from 'react-hot-toast'
import Confirmmodal from '../common/confirmmodal'
import { toggleLoading } from '../redux/slices/UiSlice'
import { 
  FaMapMarkerAlt, 
  FaBriefcase, 
  FaRegBookmark, 
  FaBookmark, 
  FaClock, 
  FaUserTie,
  FaRupeeSign,
  FaRegBuilding
} from 'react-icons/fa'

const JobCard = ({ job }) => {
  const [confirmmodal, setConfirmmodal] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const jobs = useSelector((state) => state.job);
  const dispatch = useDispatch();

  const applyJob = async (JobId) => {
    try {
      dispatch(toggleLoading());
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/jobseeker/jobs/${JobId}/apply`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error);
    } finally {
      dispatch(toggleLoading());
    }
  };

  const savejob = () => {
    dispatch(add(job));
    toast.success("Job saved successfully");
  };

  const removejob = () => {
    dispatch(remove(job.id));
    toast.error("Job removed from saved list");
  };

  return (
    <div 
      className="bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Banner */}
      <div className="h-2 bg-gradient-to-r from-[#0B877D] to-[#0ea698]" />

      <div className="p-6">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
              {job.company.companyLogo ? (
                <img
                  src={job.company.companyLogo}
                  alt={job.company.companyName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0B877D] to-[#0ea698] text-white font-bold text-xl">
                  {job.company.companyName.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-[#0B877D] transition-colors">
                {job.title}
              </h2>
              <div className="flex items-center gap-2 text-gray-600">
                <FaRegBuilding className="text-[#0B877D]" />
                <span className="text-sm font-medium">{job.company.companyName}</span>
              </div>
            </div>
          </div>

          <button
            onClick={jobs.some((p) => p.id === job.id) ? removejob : savejob}
            className={`p-2 rounded-full transition-all duration-300 ${
              isHovered ? 'bg-gray-100' : ''
            }`}
          >
            {jobs.some((p) => p.id === job.id) ? (
              <FaBookmark className="text-[#0B877D] text-xl" />
            ) : (
              <FaRegBookmark className="text-gray-400 hover:text-[#0B877D] text-xl" />
            )}
          </button>
        </div>

        {/* Job Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
            <FaBriefcase className="text-[#0B877D]" />
            <span className="text-sm text-gray-600">{job.jobType}</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
            <FaMapMarkerAlt className="text-[#0B877D]" />
            <span className="text-sm text-gray-600">{job.location}</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
            <FaUserTie className="text-[#0B877D]" />
            <span className="text-sm text-gray-600">{job.experienceLevel}</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
            <FaRupeeSign className="text-[#0B877D]" />
            <span className="text-sm text-gray-600">{job.salary.min}-{job.salary.max}</span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {job.description}
          </p>
        </div>

        {/* Skills Section */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Required Skills:</p>
          <div className="flex flex-wrap gap-2">
            {job.requirements.split(',').slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-[#0B877D]/10 text-[#0B877D] text-sm font-medium rounded-full"
              >
                {skill.trim()}
              </span>
            ))}
            {job.requirements.split(',').length > 3 && (
              <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                +{job.requirements.split(',').length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <FaClock className="text-[#0B877D]" />
            <span className="text-sm text-gray-500">Posted 2 days ago</span>
          </div>
          
          <button
            onClick={() => {
              setConfirmmodal({
                text1: "Ready to Apply?",
                text2: "You're about to apply for this position",
                btn1Text: "Yes, Apply Now",
                btn1Handler: () => {
                  applyJob(job.id);
                  setConfirmmodal(null);
                },
                btn2Text: "Cancel",
                btn2Handler: () => setConfirmmodal(null)
              })
            }}
            className="px-6 py-2 bg-[#0B877D] text-white rounded-lg hover:bg-[#0a7a71] transition-colors
              flex items-center gap-2 font-medium"
          >
            Apply Now
          </button>
        </div>
      </div>

      {confirmmodal && <Confirmmodal modalData={confirmmodal} />}
    </div>
  );
}

export default JobCard;