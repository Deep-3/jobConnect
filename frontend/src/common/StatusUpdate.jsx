import React from 'react'
import { useState } from 'react';
import {toast} from "react-hot-toast"

const StatusUpdate = ({ application, seteditmodal, onStatusUpdate }) => {
  const [status, setStatus] = useState(application.status);
  const [loading,setloading]=useState(false);
  
  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/employer/jobapplication/update-status`, {
              method: 'PUT',
              credentials: 'include',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ status,id:application.id })
          });

          const data = await response.json();
          if (data.success) {
              toast.success('Status updated successfully');
              onStatusUpdate(); 
              seteditmodal(false);
              setloading(false)
          }
      } catch (error) {
          console.error(error);
          toast.error('Failed to update status');
      }
  };

  return (
      <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-bold mb-4">Update Application Status</h2>
              <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Status</label>
                      <select 
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          className="w-full p-2 border rounded-md"
                      >
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Rejected">Rejected</option>
                      </select>
                  </div>
                  <div className="flex justify-end gap-2">
                      <button
                          type="button"
                          onClick={() => seteditmodal(false)}
                          className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-100"
                      >
                          Cancel
                      </button>
                      <button
                          type="submit"
                          className="px-4 py-2 bg-[#0B877D] text-white rounded-md hover:bg-[#097267]"
                          onClick={setloading(true)}
                      >
                          {!loading?"Update":"wait..."}
                      </button>
                  </div>
              </form>
          </div>
      </div>
  );
};

export default StatusUpdate
