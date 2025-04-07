import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {add,remove} from "../redux/slices/JobSlice"
import {toast} from 'react-hot-toast'
import Confirmmodal from '../common/confirmmodal'
import { toggleLoading } from '../redux/slices/UiSlice'
const JobCard = ({job}) => {
  
  const [confirmmodal,setConfirmmodal]=useState(null);
  const jobs = useSelector((state) => state.job);
  const dispatch = useDispatch();

  const applyJob=async(JobId)=>{

    try
    {
      dispatch(toggleLoading());
      const response=await fetch(`${import.meta.env.VITE_BACKEND_URL}/jobseeker/jobs/${JobId}/apply`,{
        method:'POST',
        credentials:'include'
      })
      const data=await response.json()
      if(data.success)
      {
        toast.success(data.message);
      }
      else
      {
        toast.error(data.message);
      }
      console.log(data);
    }catch(error)
    {
      console.error(error);
      toast.error(error)
    }
    finally
    {
      dispatch(toggleLoading());
    }

  }
 
  const savejob = () => {
    dispatch(add(job));
    toast.success("save job");
  }

  const removejob = () => {
    dispatch(remove(job.id));
    toast.error("remove job");
  }
 

  return (
    <div className="w-full rounded-lg shadow-lg bg-white p-4 m-4">
      <div className="flex gap-4 mb-4">
        <div className="w-40 h-40 flex-shrink-0">
          <img 
            className="w-full h-full object-fit rounded-md" 
            src={job.company.companyLogo} 
            alt="job thumbnail" 
          />
        </div>

        <div className="flex-grow">
          <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
          <p className="text-sm mb-2 font-semibold">
            {job.description.split(" ").slice(0,50).join(" ")+"..."}
          </p>
          <p className="text-sm text-gray-600 font-semibold">Type: {job.jobType}</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="h-35 grid grid-cols-2 gap-x-8 gap-y-2">
        <div>
            <p className="text-sm text-gray-600 font-semibold">CompanyName</p>
            <p className="text-sm font-bold">{job.company.companyName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-semibold">CompanyWebsite</p>
            <a 
              href={job.company.companyWebsite} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#0B877D] text-xs hover:underline"
            >
              {job.company.companyWebsite}
            </a>
             </div>
          <div>
            <p className="text-sm text-gray-600 font-semibold">Skills:</p>
            <p className="text-sm font-medium">{job.requirements}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 font-semibold">Location:</p>
            <p className="text-sm font-medium">{job.location}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 font-semibold">Experience:</p>
            <p className="text-sm font-medium">{job.experienceLevel}</p>
          </div>

          <div>
            <p className="text-sm text-green-600 font-semibold">Salary:</p>
            <p className="text-sm font-medium text-green-600">
              ₹{job.salary.min}-₹{job.salary.max}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center gap-4 mt-4 pt-4 border-t">
          <button onClick={
            () => {
               setConfirmmodal({
                text1: "Are You Sure ?",
                text2: "Applied Job",
                btn1Text: "Apply",
                btn1Handler:  () => {
                    applyJob(job.id);
                  setConfirmmodal(null);
                },
                btn2Text: "Cancel",
                btn2Handler: () => {
                  setConfirmmodal(null)
                }
               })
          }
        }className="border text-black px-6 py-2 rounded-md hover:bg-gray-100 transition">
            Apply
          </button>
          
          {jobs.some((p) => p.id === job.id) ? (
            <button 
              onClick={removejob}
              className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition"
            >
              Remove Job
            </button>
          ) : (
            <button 
              onClick={savejob}
              className="text-white bg-[#0B877D] border px-6 py-2 rounded-md hover:bg-[#0a7a71] transition"
            >
              Save Job
            </button>
          )}
        </div>
      </div>

      {confirmmodal && <Confirmmodal modalData={confirmmodal}/>}
    </div>
  );
}
export default JobCard;
