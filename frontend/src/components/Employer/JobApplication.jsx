import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLocation, useParams } from 'react-router-dom';
import ApplicationDetails from '../../common/ApplicationDetails';
import { FiEdit, FiEye, FiTrash2 } from 'react-icons/fi';
import StatusUpdate from '../../common/StatusUpdate';


const JobApplication = () => {
    const { id } = useParams();
    const location = useLocation();
    const [jobapplication, setjobapplication] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [modal, setmodal] = useState(false);
    const [editmodal, seteditmodal] = useState(false);

    const jobApplication = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/employer/jobApplication/${id}`, {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setjobapplication(data.data);
            }
        } catch (error) {
            toast.error('Failed to fetch applications');
            console.log(error);
        }
    };

    useEffect(() => {
        jobApplication();
    }, [location.pathname, id]);

    
    const handleViewDetails = (application) => {
        setSelectedApplication(application);
        setmodal(true);
    };
    const handleEditStatus = (application) => {
        setSelectedApplication(application);
        seteditmodal(true);
    };

    const downloadcsv = async () => {
        try {
           const downloadtoast = toast.loading("downloading...");
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/employer/reportcsv/${id}
                }`, {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                toast.dismiss(downloadtoast);
                const blob = await response.blob();

                // Create download URL
                const url = window.URL.createObjectURL(blob);

                // Create temporary link
                const filename = response.headers.get('content-disposition')
                ? response.headers.get('content-disposition').split('filename=')[1].replace(/"/g, '')
                : `report_${new Date().getTime()}.csv`;
    
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
                // Trigger download
                document.body.appendChild(link);
                link.click();

                // Cleanup
                link.remove();
                window.URL.revokeObjectURL(url);


                toast.success("download successfully", { id: downloadtoast })
            }
        }



        catch (error) {
            console.error(error)
            toast.error("something went wrong");

        }
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className='flex justify-between '><h1 className="text-2xl font-bold text-gray-900 mb-6">Job Applications</h1>

            {jobapplication.length>0 &&(<div >
                  
                    <button className='bg-[#0B877D] rounded-lg p-2 text-sm text-white font-semibold hover:bg-[#097267]' onClick={downloadcsv}>
                        Export Data
                    </button>
                </div>)} 
            </div>


            {/* Applications Table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-5 gap-4 bg-gray-50 p-4 border-b">
                    <div className="font-semibold text-gray-700">Applicant</div>
                    <div className="font-semibold text-gray-700">Email</div>
                    <div className="font-semibold text-gray-700">Applied Date</div>
                    <div className="font-semibold text-gray-700">Status</div>
                    <div className="font-semibold text-gray-700">Action</div>
                </div>

                {/* Table Body */}
                {jobapplication.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {jobapplication.map((application) => (
                            <div key={application.id} className="grid grid-cols-5 gap-4 p-4 hover:bg-gray-50">
                                <div className="text-gray-900 font-medium">
                                    {application.user.name}
                                </div>
                                <div className="text-gray-600">
                                    {application.user.email}
                                </div>
                                <div className="text-gray-600">
                                    {new Date(application.appliedAt).toLocaleDateString()}
                                </div>
                                <div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${application.status === 'Accepted'
                                            ? 'bg-green-100 text-green-800'
                                            : application.status === 'Rejected'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {application.status}
                                    </span>
                                </div>
                                <div className='flex gap-2'>
                                    <button
                                        onClick={() => handleViewDetails(application)}
                                        className="px-3 py-1 text-sm text-[#0B877D] border border-[#0B877D] rounded-md hover:bg-[#0B877D] hover:text-white transition-colors"
                                    >
                                        <FiEye className='text-[blue]'></FiEye>
                                    </button>
                                    <button
                                    onClick={()=>{handleEditStatus(application)}}
                                        className="px-3 py-1 text-sm text-[#0B877D] border border-[#0B877D] rounded-md hover:bg-[#0B877D] hover:text-white transition-colors"
                                    >
                                      <FiEdit  className='text-[red]'></FiEdit>
                                    </button>

                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        No applications received yet
                    </div>
                )}
            </div>

            {/* Details Modal */}
            {modal && <ApplicationDetails setmodal={setmodal} selectedApplication={selectedApplication} />}

            {editmodal && <StatusUpdate seteditmodal={seteditmodal} application={selectedApplication} onStatusUpdate={jobApplication} />}

        </div>
    );
};

export default JobApplication;