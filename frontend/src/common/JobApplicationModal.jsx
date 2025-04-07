import React from 'react'
import { FaMapMarkerAlt, FaBriefcase, FaMoneyBillWave,FaTimes } from 'react-icons/fa';

const JobApplicationModal = ({ application, onClose }) => {

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Format salary
    const formatSalary = (salary) => {
        const formatter = new Intl.NumberFormat('en-In', {
            style: 'currency',
            currency: salary.currency === 'USD' ? 'USD' : 'INR',
            maximumFractionDigits: 0
        });
        return `${formatter.format(salary.min)} - ${formatter.format(salary.max)}`;
    };

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


    if (!application) return null;

    return (
  <div className="fixed inset-0 z-[1000] bg-black/50 grid place-items-center overflow-auto backdrop-blur-[2px]">
        
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                       <FaTimes className="w-5 h-5" />
                </button>
                
                <div className="flex items-center mb-6">
                    <img
                        src={application.job.company.companyLogo}
                        alt={application.job.company.companyName}
                        className="w-16 h-16 object-cover rounded-lg mr-4"
                    />
                    <div>
                        <h2 className="text-2xl font-bold">{application.job.title}</h2>
                        <p className="text-gray-600">{application.job.company.companyName}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center">
                        <FaMapMarkerAlt className="text-gray-500 mr-2" />
                        <span>{application.job.location}</span>
                    </div>
                    
                    <div className="flex items-center">
                        <FaBriefcase className="text-gray-500 mr-2" />
                        <span className="capitalize">{application.job.type}</span>
                    </div>
                    
                    <div className="flex items-center">
                        <FaMoneyBillWave className="text-gray-500 mr-2" />
                        <span>{formatSalary(application.job.salary)}</span>
                    </div>

                    <div className="border-t pt-4">
                        <p className="font-semibold">Application Status</p>
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(application.status)}`}>
                            {application.status.replace('_', ' ')}
                        </span>
                    </div>

                    <div>
                        <p className="font-semibold">Applied Date</p>
                        <p>{formatDate(application.appliedDate)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobApplicationModal;
