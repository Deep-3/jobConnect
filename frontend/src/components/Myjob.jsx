import React, { useEffect, useState } from 'react';
import { addJobApplication } from '../redux/slices/JobseekerSlice';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FaMapMarkerAlt, FaBriefcase, FaMoneyBillWave } from 'react-icons/fa';
import JobApplicationModal from '../common/JobApplicationModal';

const Myjob = () => {
    const dispatch = useDispatch();
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {JobApplication:applications}= useSelector((state) => state.jobseeker);
    const [loading,setloading]=useState(false);

    const fetchapplication = async () => {
        try {
            setloading(true);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/jobseeker/applications`, {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                dispatch(addJobApplication(data.data));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('Error fetching applications');
        }finally
        {
            setloading(false);
        }
    };

    useEffect(() => {
        fetchapplication();
    }, []);

    
    // Status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case 'Accepted':
                return 'bg-green-100 text-green-800';
            case 'Interview_schedule':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

   

    if(loading)
    {
         return (<div>
             loading...
         </div>)
    }

    return (
        <div>
            <div className='m-10'>
                <div className='flex flex-col'>
                    <p className='text-[30px] font-semibold mb-6'>Your Applications</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {applications.map((application) => (
                            <div
                                key={application.id}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-center mb-4">
                                    <img
                                        src={application.job.company.companyLogo}
                                        alt={application.job.company.companyName}
                                        className="w-12 h-12 object-cover rounded-lg mr-4"
                                    />
                                    <div>
                                        <h3 className="font-semibold">{application.job.title}</h3>
                                        <p className="text-sm text-gray-600">
                                            {application.job.company.companyName}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FaMapMarkerAlt className="mr-2" />
                                        {application.job.location}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FaBriefcase className="mr-2" />
                                        {application.job.type}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(application.status)}`}>
                                        {application.status.replace('_', ' ')}
                                    </span>
                                    <button
                                        onClick={() => {
                                            setSelectedApplication(application);
                                            setIsModalOpen(true);
                                        }}
                                        className="text-[#0B877D] hover:text-[#097267] font-semibold"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {applications.length === 0 && (
                        <div className="text-center text-gray-500 mt-8">
                            No applications found
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <JobApplicationModal
                    application={selectedApplication}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedApplication(null);
                    }}
                />
            )}
        </div>
    );
};

export default Myjob;