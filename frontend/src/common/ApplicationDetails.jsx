import React from 'react'
import { FaTimes } from 'react-icons/fa'

const ApplicationDetails = ({setmodal ,selectedApplication}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/30 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Application Details</h2>
                            <button 
                                onClick={() => setmodal(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                               <FaTimes/>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Applicant Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Applicant Name</p>
                                    <p className="font-medium">{selectedApplication.user.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{selectedApplication.user.email}</p>
                                </div>
                            </div>

                            {/* Education */}
                            <div>
                                <p className="text-sm text-gray-500">Education</p>
                                <p className="font-medium">{selectedApplication.education}</p>
                            </div>

                            {/* Experience */}
                            <div>
                                <p className="text-sm text-gray-500">Experience</p>
                                <p className="font-medium">{selectedApplication.experience}</p>
                            </div>

                            {/* Skills */}
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Skills</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedApplication.skills.split(',').map((skill, index) => (
                                        <span 
                                            key={index}
                                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                        >
                                            {skill.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Resume */}
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Resume</p>
                                <a 
                                    href={`${selectedApplication.resumeUrl}`}
                                    target="_blank"
                                    className="text-[#0B877D] hover:underline flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    View Resume
                                </a>
                            </div>

                            {/* Application Status */}
                            <div className="pt-4 border-t">
                                <p className="text-sm text-gray-500 mb-2">Application Status</p>
                                <div className="flex items-center gap-4">
                                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                                        selectedApplication.status === 'Accepted' 
                                            ? 'bg-green-100 text-green-800'
                                            : selectedApplication.status === 'Rejected'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {selectedApplication.status}
                                    </span>
                                    <p className="text-sm text-gray-500">
                                        Applied on: {new Date(selectedApplication.appliedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
  )
}

export default ApplicationDetails
