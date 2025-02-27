import React, { useEffect,useState } from 'react'
// import data from '../Data';
import JobCard from './JobCard';
import { useDispatch } from 'react-redux';

const FindJob = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      // Simulate loading delay
      const loadData = async () => {
          setIsLoading(true);
          try {
              const response=await fetch(`${import.meta.env.VITE_BACKEND_URL}/jobseeker/alljob`,
                {
                    credentials: 'include'
                  }
              )
              const data=await response.json();
              console.log(data)
              setPosts(data.data);
          } catch (error) {
              console.error("Error loading jobs:", error);
          } finally {
              setIsLoading(false);
          }
      };
    
            loadData();
  }, []);

  if (isLoading) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0B877D]"></div>
          </div>
      );
  }

  return (
      <div className="max-w-[1400px] mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Find Your Dream Job
              </h1>
              <p className="text-gray-600">
                  Discover {posts.length} job opportunities waiting for you
              </p>
          </div>

          {/* Jobs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
              {posts.map((job, index) => (
                  <div 
                      key={job.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                  >
                      <JobCard job={job} />
                  </div>
              ))}
          </div>

          {/* No Jobs Found State */}
          {posts.length === 0 && (
              <div className="text-center py-12">
                  <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                      No jobs found
                  </h2>
                  <p className="text-gray-600">
                      Please try adjusting your search criteria
                  </p>
              </div>
          )}
      </div>
  );
}

export default FindJob;