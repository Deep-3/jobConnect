import React, { useEffect, useState } from 'react'
import JobCard from './JobCard';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLoading } from '../redux/slices/UiSlice';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

const FindJob = () => {
  const [count, setCount] = useState(null);
  const [page, setPage] = useState(1);
  const [totalpage, setTotalpage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [allJobs, setAllJobs] = useState([]); 
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    jobType: '',
    location: ''
  });

  const { isSidebarOpen, isLoading } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  const jobTypes = [
    { id: 1, name: 'Full-Time' },
    { id: 2, name: 'Part-Time' },
    { id: 3, name: 'Remote' },
    { id: 4, name: 'Contract' }
  ];

  const locations = [
    { id: 1, name: 'Ahmedabad' },
    { id: 2, name: 'Surat' },
    { id: 3, name: 'Vadodara' },
    { id: 4, name: 'Remote' }
  ];

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      dispatch(toggleLoading());
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/jobseeker/${page}/alljob`, {
          credentials: 'include'
        });
        const data = await response.json();
        setPosts(data.data.rows);
        setFilteredPosts(data.data.rows);
        setTotalpage(data.totalpage);
        setCount(data.data.count);
        // Also set allJobs for filtering
        setAllJobs(data.data.rows);
      } catch (error) {
        console.error("Error loading jobs:", error);
      } finally {
        dispatch(toggleLoading());
      }
    };
    loadData();
  }, [page]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters
  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...posts];

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filtered = filtered.filter(job => 
          job.title.toLowerCase().includes(searchTerm) ||
          job.company.companyName.toLowerCase().includes(searchTerm) ||
          job.description.toLowerCase().includes(searchTerm)
        );
      }

      // Job Type filter
      if (filters.jobType) {
        filtered = filtered.filter(job => 
          job.jobType.toLowerCase() === filters.jobType.toLowerCase()
        );
      }

      // Location filter
      if (filters.location) {
        filtered = filtered.filter(job => 
          job.location.toLowerCase() === filters.location.toLowerCase()
        );
      }

      setFilteredPosts(filtered);
      setIsFiltering(filters.search || filters.jobType || filters.location);
    };

    applyFilters();
  }, [filters, posts]);

  // Clear filters
  const handleClearFilters = () => {
    setFilters({
      search: '',
      jobType: '',
      location: ''
    });
    setIsFiltering(false);
    setFilteredPosts(posts);
  };

  if (isLoading) {
    return (
      <div className='h-screen w-full flex justify-center items-center'>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8
      ${isSidebarOpen ? 'max-w-[1250px]' : 'max-w-[1450px]'}`}>
      
      {/* Header and Search Section */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
          Find Your Dream Job
        </h1>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search jobs..."
              className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:border-[#0B877D]"
            />
            <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Job Type Dropdown */}
          <div className="md:w-48">
            <select
              name="jobType"
              value={filters.jobType}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#0B877D]"
            >
              <option value="">All Job Types</option>
              {jobTypes.map(type => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Location Dropdown */}
          <div className="md:w-48 flex relative">
            <FaMapMarkerAlt className='absolute w-3 h-4 left-2 top-1/2 -translate-y-1/2 text-[#0B877D]'/>
            <select
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full px-6 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#0B877D]"
            >
              <option value="">All Locations</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm sm:text-base text-gray-600">
            {isFiltering 
              ? `Found ${filteredPosts.length} jobs matching your search criteria` 
              : `Discover ${count} job opportunities waiting for you`}
          </p>
          
          {isFiltering && (
            <button 
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Jobs Grid */}
      <div className='grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'>
        {filteredPosts.map((job, index) => (
          <div 
            key={job.id}
            className={`animate-fade-in-up w-full
              ${isSidebarOpen ? 'max-w-[400px] mx-auto' : 'w-full'}`}
            style={{ 
              animationDelay: `${index * 0.1}s`,
              transition: 'all 0.3s ease-in-out'
            }}
          >
            <JobCard job={job} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {filteredPosts.length > 0 && !isFiltering && (
        <div className="mt-5">
          <div>
            {totalpage > 0 && (
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded-md ${
                    page === 1 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-[#0B877D] text-white hover:bg-[#086b63]'
                  }`}
                >
                  Previous
                </button>
                
                <div className="flex items-center gap-2">
                  {[...Array(totalpage)].map((_, num) => (
                    <button
                      key={num}
                      onClick={() => setPage(num + 1)}
                      className={`w-10 h-10 rounded-full ${
                        page === num + 1
                          ? 'bg-[#0B877D] text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {num + 1}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setPage(prev => Math.min(prev + 1, totalpage))}
                  disabled={page === totalpage}
                  className={`px-4 py-2 rounded-md ${
                    page === totalpage
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-[#0B877D] text-white hover:bg-[#086b63]'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* No Jobs Found */}
      {filteredPosts.length === 0 && (
        <div className={`text-center py-8 sm:py-12
          ${isSidebarOpen ? 'max-w-[800px] mx-auto' : 'max-w-[1000px] mx-auto'}`}>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2 sm:mb-4">
            No jobs found
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Please try adjusting your search criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default FindJob;