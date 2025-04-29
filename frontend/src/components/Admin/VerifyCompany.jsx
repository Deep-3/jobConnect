import React, { useState, useEffect } from 'react';
import { FaBuilding, FaGlobe, FaIndustry, FaUsers, FaMapMarkerAlt, FaCheckCircle, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, company }) => {
    if (!isOpen || !company) return null;

    // Handle ESC key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Handle click outside
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90%] transform transition-all duration-300 scale-100 opacity-100">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold">Confirm Company Verification</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>
                
                <div className="mb-6">
                    <div className="flex items-center space-x-3 mb-4 p-4 bg-gray-50 rounded-lg">
                        <img 
                            src={company.companyLogo} 
                            alt={company.companyName}
                            className="w-16 h-16 rounded-lg object-cover"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/100?text=Logo';
                            }}
                        />
                        <div>
                            <p className="font-semibold text-lg">{company.companyName}</p>
                            <p className="text-sm text-gray-600">{company.industry}</p>
                            <p className="text-sm text-gray-500">{company.city}, {company.country}</p>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <p className="text-gray-600">
                            Are you sure you want to verify this company? This action will:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
                            <li>Enable the company to post jobs</li>
                            <li>Grant access to employer features</li>
                            <li>Send verification confirmation email</li>
                        </ul>
                    </div>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm(company.id);
                            onClose();
                        }}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                    >
                        <FaCheckCircle />
                        <span>Confirm Verification</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

const VerifyCompany = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);

    useEffect(() => {
        const fetchPendingCompanies = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/employer/companies/pending`, {
                    method: 'GET',
                    credentials: 'include'
                });
                const data = await response.json();
                if (data.success) {
                    setCompanies(data.data);
                }
            } catch (error) {
                console.error('Error fetching pending companies:', error);
                toast.error('Failed to fetch pending companies');
            } finally {
                setLoading(false);
            }
        };
        fetchPendingCompanies();
    }, []);

    const handleVerify = async (companyId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/employer/company/verify/${companyId}`, {
                method: 'POST',
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setCompanies(companies.filter(company => company.id !== companyId));
                toast.success('Company verified successfully');
            }
        } catch (error) {
            console.error('Error verifying company:', error);
            toast.error('Failed to verify company');
        }
    };

    const openVerifyModal = (company) => {
        setSelectedCompany(company);
        setModal(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Pending Company Verifications</h1>
                <div className="text-sm text-gray-500">
                    Total pending: {companies.length}
                </div>
            </div>
            
            {companies.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                    No pending companies to verify
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {companies.map(company => (
                        <div key={company.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start space-x-4">
                                {/* Company Logo */}
                                <div className="flex-shrink-0">
                                    <img 
                                        src={company.companyLogo} 
                                        alt={company.companyName}
                                        className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/100?text=Logo';
                                        }}
                                    />
                                </div>

                                {/* Company Details */}
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-xl font-semibold">{company.companyName}</h2>
                                            <p className="text-gray-600">{company.companyDescription}</p>
                                        </div>
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                                            {company.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div className="flex items-center space-x-2">
                                            <FaGlobe className="text-gray-400" />
                                            <a href={company.companyWebsite} 
                                               target="_blank" 
                                               rel="noopener noreferrer" 
                                               className="text-blue-600 hover:underline">
                                                Website
                                            </a>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <FaIndustry className="text-gray-400" />
                                            <span>{company.industry}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <FaUsers className="text-gray-400" />
                                            <span>{company.companySize} employees</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <FaMapMarkerAlt className="text-gray-400" />
                                            <span>{`${company.city}, ${company.state}, ${company.country}`}</span>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                        <h3 className="font-semibold mb-2">Contact Information</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Email</p>
                                                <p>{company.contactEmail}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Phone</p>
                                                <p>{company.contactPhone}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-6 flex justify-end space-x-4">
                                        <button
                                            onClick={() => openVerifyModal(company)}
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                                        >
                                            <FaCheckCircle />
                                            <span>Verify Company</span>
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                                        >
                                            <FaTimes />
                                            <span>Reject</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Confirmation Modal */}
            <ConfirmationModal 
                isOpen={modal}
                onClose={() => {
                    setModal(false);
                    setSelectedCompany(null);
                }}
                onConfirm={handleVerify}
                company={selectedCompany}
            />
        </div>
    );
};

export default VerifyCompany;