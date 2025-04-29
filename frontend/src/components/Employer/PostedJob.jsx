import React, { useEffect, useState } from 'react'
import JobPostModal from '../../common/PostJobForm';
import { useNavigate } from 'react-router-dom';


const PostedJob = () => {

    const [loading, setloading] = useState(false);
    const [postjob, setpostjob] = useState([]);
    const [modal, setmodal] = useState(false);

    const navigate=useNavigate();

    const getjob = async () => {
        try {
            setloading(true);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/employer/jobs`, {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                console.log(data.data);
                setpostjob(data.data);
            }
            else {
                console.log(data.message)
            }
        }
        catch (error) {
            console.log(error);
        }
        setloading(false);
    }

    useEffect(() => {
       
        getjob();

    }, [])
    if (loading) {
        return (
            <div className='h-screen w-full flex justify-center items-center'>
                    <div className="loader"></div>
            </div>
        )
    }
    return (
        <div>
   
   <div className="container mx-auto px-4 py-6">
        {postjob.length > 0 && (
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold text-gray-900">Posted Jobs</h1>
                    <button
                        className="px-3 py-1.5 bg-[#0B877D] text-white text-sm font-medium rounded-lg hover:bg-[#097267] transition-all duration-300"
                        onClick={() => setmodal(true)}
                    >
                        Post New Job
                    </button>
                </div>

                {/* Grid Container for Jobs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {postjob.map((job) => (
                        <div key={job.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200 w-full">
                            {/* Job Header */}
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">{job.title}</h2>
                                    <p className="text-[#0B877D] text-sm font-medium">{job.company.companyName}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    job.status === 'active' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {job.status === 'active' ? 'Active' : 'Closed'}
                                </span>
                            </div>

                            {/* Job Details Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                                <div>
                                    <p className="text-gray-500">Location</p>
                                    <p className="font-medium">{job.location}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Job Type</p>
                                    <p className="font-medium capitalize">{job.jobType}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Experience</p>
                                    <p className="font-medium capitalize">{job.experienceLevel}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Salary Range</p>
                                    <p className="font-medium">
                                        {job.salary.currency === 'USD' ? '$' : '₹'}
                                        {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-3">
                                <p className="text-gray-500 text-sm mb-1">Description</p>
                                <p className="text-sm text-gray-700 line-clamp-2">{job.description}</p>
                            </div>

                            {/* Requirements */}
                            <div className="mb-3">
                                <p className="text-gray-500 text-sm mb-1">Requirements</p>
                                <div className="flex flex-wrap gap-1">
                                    {job.requirements.split(',').map((req, index) => (
                                        <span 
                                            key={index}
                                            className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                                        >
                                            {req.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                <p className="text-xs text-gray-500">
                                    Posted: {new Date(job.createdAt).toLocaleDateString()}
                                </p>
                                <div className="flex gap-2">
                                <button className="px-2 py-1 text-xs text-[#0B877D] border border-[#0B877D] rounded hover:bg-[#0B877D] hover:text-white transition-colors" onClick={()=>{
                                    navigate(`/jobapplication/${job.id}`)
                                }}>
                                        View Application
                                    </button>
                                    <button className="px-2 py-1 text-xs text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white transition-colors">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
        </div>
            
            
            {postjob.length === 0 && (
                <div className='min-h-[80vh] flex items-center justify-center'>
                    <div className='flex flex-col items-center gap-4 text-center'>
                        <p className='text-xl font-semibold text-gray-600'>No Jobs Posted Yet</p>
                        <button
                            className="px-4 py-2 bg-[#0B877D] text-white font-medium rounded-lg hover:bg-[#097267] transition-all duration-300"
                            onClick={() => setmodal(true)}
                        >
                            Post Job
                        </button>
                    </div>
                </div>
            )}

            {modal && <JobPostModal setmodal={setmodal} getjob={getjob} />}
        </div>
    )
}

export default PostedJob
