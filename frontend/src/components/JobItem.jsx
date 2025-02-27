import React from 'react'
import {FcDeleteDatabase} from "react-icons/fc"
import { useSelector,useDispatch } from 'react-redux'
import { remove } from '../redux/slices/JobSlice'
import toast from 'react-hot-toast'
const JobItem = ({job}) => {
    const dispatch = useDispatch();
    
    const removejob = () => {
      dispatch(remove(job.id));
      toast.error("remove job"); 
    }

    return (
        <div className="rounded-lg shadow-lg bg-white p-6 m-4 flex flex-col min-h-[450px]">
        {/* Top Section - Image and Title */}
        <div className="flex gap-6 h-48">
          {/* Image */}
          <div className="w-1/3">
            <img 
              className="w-full h-full object-cover rounded-lg" 
              src={job.company.companyLogo} 
              alt="company logo" 
            />
          </div>

          {/* Title & Description */}
          <div className="w-2/3 flex flex-col">
            <h2 className="text-2xl font-bold mb-3">{job.title}</h2>
            <p className="text-gray-600 mb-4 flex-grow">
              {job.description.slice(0, 100) + "..."}
            </p>
            <div className="text-gray-700">
              Type: <span className="text-[#0B877D]">{job.jobType}</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6" />

        {/* Details Section */}
        <div className="flex-grow grid grid-cols-2 gap-6">
        <div className="flex flex-col">
            <span className="text-gray-600 mb-1">CompanyName</span>
            <span className="font-medium">
              {job.company.companyName}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-600 mb-1">CompanyWebsite</span>
            <a 
              href={job.company.companyWebsite} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#0B877D] hover:underline"
            >
              {job.company.companyWebsite}
            </a>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-600 mb-1">Skills:</span>
            <span className="font-medium">
              {job.requirements}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-600 mb-1">Location:</span>
            <span className="font-medium">
              {job.location}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-600 mb-1">Experience:</span>
            <span className="font-medium">
              {job.experienceLevel}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-600 mb-1">Salary:</span>
            <span className="font-medium text-[#0B877D]">
              ₹{job.salary.min}-₹{job.salary.max}
            </span>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="flex justify-between items-center pt-6 mt-6 border-t">
          <button className="px-8 py-2.5 border-2 rounded-md hover:bg-gray-50 transition font-medium">
            Apply
          </button>
          
          <button 
            onClick={removejob}
            className="p-3 text-2xl text-red-500 hover:text-red-600 transition-colors"
          >
            <FcDeleteDatabase />
          </button>
        </div>
      </div>
      
    );
}
export default JobItem
