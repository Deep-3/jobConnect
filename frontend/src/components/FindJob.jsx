import React, { useEffect,useState } from 'react'
// import data from '../Data';
import JobCard from './JobCard';
import { useDispatch,useSelector } from 'react-redux';
import { toggleLoading } from '../redux/slices/UiSlice';
import { FaSearch,FaMapMarkerAlt} from 'react-icons/fa';


const FindJob = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]); 
  const [filters, setFilters] = useState({
    search: '',
    jobType: '',
    location: ''
  });
  
  const {isSidebarOpen, isLoading} = useSelector((state)=>state.ui);
  const dispatch = useDispatch();

  // Job Types for dropdown
  const jobTypes = [
    { id: 1, name: 'Full-Time' },
    { id: 2, name: 'Part-Time' },
    { id: 3, name: 'Remote' },
    { id: 4, name: 'Contract' }
  ];

  // Locations for dropdown
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
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/jobseeker/alljob`, {
          credentials: 'include'
        });
        const data = await response.json();
        setPosts(data.data);
        setFilteredPosts(data.data); // Initialize filtered posts
      } catch (error) {
        console.error("Error loading jobs:", error);
      } finally {
        dispatch(toggleLoading());
      }
    };
    loadData();
  }, []);

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
    let result = [...posts];
    
    // Apply search filter
    console.log('Before location filter:', result);
    console.log(filters);

    if (filters.search) {
      result = result.filter(job => 
        job.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.company.companyName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    // Apply job type filter
    if (filters.jobType) {
      result = result.filter(job => 
        job.jobType?.toLowerCase().includes(filters.jobType.toLowerCase())
      );
    }
    
    // Apply location filter with partial match
    if (filters.location) {
      result = result.filter(job => 
        job.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    console.log('After location filter:', result);

    setFilteredPosts(result);
  }, [filters, posts]);

  if (isLoading) {
    return (
      <div className=' h-screen w-full flex justify-center items-center'>
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
              <option value="" className='flex'> 
              All Locations</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-sm sm:text-base text-gray-600">
          Discover {filteredPosts.length} job opportunities waiting for you
        </p>
      </div>

      {/* Jobs Grid */}
      <div className='grid gap-3 sm:gap-4 lg:gap-6grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'>
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