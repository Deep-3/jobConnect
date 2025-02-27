import React from 'react'
import { useSelector } from 'react-redux'
import JobItem from './Jobitem'
import { NavLink } from 'react-router-dom'

const SaveJob = () => {
    const {job} = useSelector((state) => state);

    return (
        <div className="max-w-[1200px] p-6 mx-auto">
            {job.length > 0 ? (
                <div className="flex flex-col min-h-screen">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Saved Jobs</h1>
                        <p className="text-lg text-[#0B877D] font-semibold">
                            Total Saved Jobs: {job.length}
                        </p>
                    </div>

                    {/* Jobs Grid */}
                    <div className="flex-grow">
                        {job.map((job) => (
                            <JobItem key={job.id} job={job} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col mt-50 items-center  gap-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        No Jobs Saved Yet
                    </h1>
                    <NavLink to="/findjob">
                        <button className="px-8 py-3 bg-[#0B877D] text-white rounded-md hover:bg-[#0a7a71] transition-colors font-medium flex items-center gap-2">
                            Find Jobs
                           
                        </button>
                    </NavLink>
                </div>
            )}
        </div>
    );
}
export default SaveJob
