// pages/Home.jsx
import { 
    FaBriefcase, 
    FaSearch,
    FaMapMarker,
    FaDollarSign,
    FaClock
  } from 'react-icons/fa';
  
  const Home = () => {
    return (
      <div className="min-h-full p-4 overflow-auto">
        {/* Hero Section */}
        <div className="bg-[#0B877D] rounded-lg p-8 mb-12">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">
              Find Your Dream Job Today
            </h1>
            <p className="text-lg mb-8">
              Search through thousands of job listings to find your perfect match
            </p>
            
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg p-2 flex gap-2">
                <div className="flex-1 flex items-center gap-2 px-4">
                  <FaSearch className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Job title or keyword"
                    className="w-full outline-none text-gray-800"
                  />
                </div>
                <button className="bg-[#0B877D] text-white px-6 py-2 rounded-md hover:bg-[#0a7a6d] transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
  
        {/* Categories Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category.name} 
                className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-12 h-12 bg-[#0B877D]/10 rounded-lg flex items-center justify-center mb-4">
                  <FaBriefcase className="w-6 h-6 text-[#0B877D]" />
                </div>
                <h3 className="font-medium mb-2">{category.name}</h3>
                <p className="text-gray-500">{category.count}</p>
              </div>
            ))}
          </div>
        </div>
  
        {/* Featured Jobs Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Jobs</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div key={job.id} 
                className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={job.companyLogo} 
                      alt={job.company}
                      className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                    />
                    <div>
                      <h3 className="font-medium text-lg hover:text-[#0B877D] transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-gray-500">{job.company}</p>
                    </div>
                  </div>
                  <span className={`
                    px-3 py-1 rounded-full text-sm
                    ${job.type === 'Full Time' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'}
                  `}>
                    {job.type}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <FaMapMarker className="text-[#0B877D]" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaClock className="text-[#0B877D]" />
                    {job.experience}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaDollarSign className="text-[#0B877D]" />
                    {job.salary}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Top Companies Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Top Companies Hiring</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {companies.map((company) => (
              <div key={company.name} 
                className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
                <img 
                  src={company.logo} 
                  alt={company.name}
                  className="w-16 h-16 rounded-lg object-cover bg-gray-100 mb-4"
                />
                <h3 className="font-medium mb-2 hover:text-[#0B877D] transition-colors">
                  {company.name}
                </h3>
                <p className="text-gray-500">{company.openings}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
        
    );
  };
  
  // Dummy data
  const categories = [
    { 
      name: 'Technology', 
      count: '1200 jobs available' 
    },
    { 
      name: 'Marketing', 
      count: '800 jobs available' 
    },
    { 
      name: 'Design', 
      count: '600 jobs available' 
    },
    { 
      name: 'Sales', 
      count: '450 jobs available' 
    },
    { 
      name: 'Finance', 
      count: '350 jobs available' 
    },
    { 
      name: 'Healthcare', 
      count: '900 jobs available' 
    }
  ];
  
  const jobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'Tech Corp',
      companyLogo: '/company1.png',
      type: 'Full Time',
      location: 'Remote',
      experience: '3-5 years',
      salary: '$80k-120k'
    },
    {
      id: 2,
      title: 'Product Marketing Manager',
      company: 'Marketing Pro',
      companyLogo: '/company2.png',
      type: 'Contract',
      location: 'New York',
      experience: '4-6 years',
      salary: '$90k-130k'
    },
    {
      id: 3,
      title: 'UI/UX Designer',
      company: 'Design Studio',
      companyLogo: '/company3.png',
      type: 'Full Time',
      location: 'San Francisco',
      experience: '2-4 years',
      salary: '$70k-100k'
    },
    {
      id: 4,
      title: 'Frontend Developer',
      company: 'Web Solutions',
      companyLogo: '/company4.png',
      type: 'Full Time',
      location: 'London',
      experience: '2-4 years',
      salary: '$60k-90k'
    }
  ];
  
  const companies = [
    {
      name: 'Tech Corp',
      logo: '/techcorp.png',
      openings: '15 open positions'
    },
    {
      name: 'Marketing Pro',
      logo: '/marketingpro.png',
      openings: '8 open positions'
    },
    {
      name: 'Design Studio',
      logo: '/designstudio.png',
      openings: '12 open positions'
    },
    {
      name: 'Web Solutions',
      logo: '/websolutions.png',
      openings: '10 open positions'
    }
  ];
  
  export default Home;