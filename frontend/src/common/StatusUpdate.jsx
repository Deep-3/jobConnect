import React, { useState } from 'react';
import { toast } from "react-hot-toast"

const StatusUpdate = ({ application, seteditmodal, onStatusUpdate }) => {
  const [status, setStatus] = useState(application.status);
  const [loading, setloading] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewDetails, setInterviewDetails] = useState({
    scheduledDate: '',
    startTime: '',
    endTime: '',
    meetingUrl: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setloading(true)
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/employer/jobapplication/update-status`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, id: application.id })
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
      setloading(false)
    }
  };

  // Interview scheduling form submit
  const handleInterviewSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/employer/jobapplication/interview`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobApplicationId: application.id,
          ...interviewDetails
        })
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Interview scheduled successfully');
        setShowInterviewModal(false);
        seteditmodal(false);
        onStatusUpdate();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to schedule interview');
    }
    setloading(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-xl font-bold mb-4">Update Application Status</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  if (e.target.value === "Interview scheduled") {
                    setShowInterviewModal(true);
                  }
                }}
                className="w-full p-2 border rounded-md"
              >
                <option value="Shortlisted">Shortlisted</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
                <option value="Interview scheduled">Interview Scheduled</option>
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
              >
                {!loading ? "Update" : "wait..."}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Interview Scheduling Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Schedule Interview</h2>
            <form onSubmit={handleInterviewSubmit}>
              <div className="mb-2">
                <label className="block text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-md"
                  value={interviewDetails.scheduledDate}
                  onChange={e => setInterviewDetails({ ...interviewDetails, scheduledDate: e.target.value })}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 mb-1">Start Time</label>
                <input
                  type="time"
                  className="w-full p-2 border rounded-md"
                  value={interviewDetails.startTime}
                  onChange={e => setInterviewDetails({ ...interviewDetails, startTime: e.target.value })}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 mb-1">End Time</label>
                <input
                  type="time"
                  className="w-full p-2 border rounded-md"
                  value={interviewDetails.endTime}
                  onChange={e => setInterviewDetails({ ...interviewDetails, endTime: e.target.value })}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 mb-1">Meeting URL</label>
                <input
                  type="url"
                  className="w-full p-2 border rounded-md"
                  value={interviewDetails.meetingUrl}
                  onChange={e => setInterviewDetails({ ...interviewDetails, meetingUrl: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {setShowInterviewModal(false)
                                 seteditmodal(false)}
                  }
                  className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0B877D] text-white rounded-md hover:bg-[#097267]"
                >
                  {!loading ? "Schedule" : "wait..."}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default StatusUpdate;