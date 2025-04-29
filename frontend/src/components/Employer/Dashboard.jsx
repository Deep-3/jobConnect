import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend,
    ArcElement
  } from 'chart.js';
import { useEffect,useState } from 'react';
  import { Bar, Pie } from 'react-chartjs-2';
  import {Link} from "react-router-dom"  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
  );

  
  
  function Dashboard() {
    const [jobs, setjobs] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Define the async function inside useEffect
        const fetchDashboardData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/employer/dashboard`, {
                    method: 'GET',
                    credentials: 'include'
                });
                const data = await response.json();
                console.log(data);
                setjobs(data.jobs);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        // Call the async function
        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div className='h-screen w-full flex justify-center items-center'>
                    <div className="loader"></div>
            </div>
        )
    }

    if (!jobs || !jobs.rows || jobs.rows.length === 0) {
        return <div className="text-center">No jobs data available</div>;
    }

    const getrandomcolors=(numcolor)=>{
        let color=[];
        for (let i = 0; i < numcolor; i++) {
            color.push(`rgb(${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)})`)
            }
            return color;
    }

    const applicationsPerJob = {
        labels: jobs.rows.map(job => job.title),
        datasets: [{
          label: 'Number of Applications',
          data: jobs.rows.map(job => job.applications.length),
          backgroundColor: getrandomcolors(1),
        }]
      };
    
      const jobTypes = jobs.rows.reduce((acc, job) => {
        acc[job.jobType] = (acc[job.jobType] || 0) + 1;
        return acc;
      }, {});
    
      const jobTypeData = {
        labels: Object.keys(jobTypes),
        datasets: [{
          data: Object.values(jobTypes),
          backgroundColor:getrandomcolors(Object.values(jobTypes).length)
        }]
      };
    
      const salaryData = {
        labels: jobs.rows.map(job => job.title),
        datasets: [
          {
            label: 'Minimum Salary',
            data: jobs.rows.map(job => job.salary.min),
            backgroundColor: getrandomcolors(1),
          },
          {
            label: 'Maximum Salary',
            data: jobs.rows.map(job => job.salary.max),
            backgroundColor: getrandomcolors(1),
          }
        ]
      };
    
      return (
        <div className="p-6 bg-gray-50 min-h-screen">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Company Dashboard</h1>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium">Total Jobs</h3>
                <p className="text-2xl font-bold text-gray-800">{jobs.rows.length}</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium">Total Applications</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {jobs.rows.reduce((sum, job) => sum + job.applications.length, 0)}
                </p>
              </div>
    
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium">Active Jobs</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {jobs.rows.filter(job => job.status === 'active').length}
                </p>
              </div>
    
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium">Avg Applications/Job</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {Math.round(jobs.rows.reduce((sum, job) => sum + job.applications.length, 0) / jobs.count)}
                </p>
              </div>
            </div>
          </div>
    
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Applications per Job Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Applications per Job</h2>
              <div className="h-[300px]">
                <Bar 
                  data={applicationsPerJob}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top' },
                    }
                  }}
                />
              </div>
            </div>
    
            {/* Job Types Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Job Types Distribution</h2>
              <div className="h-[300px]">
                <Pie 
                  data={jobTypeData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top' },
                    }
                  }}
                />
              </div>
            </div>
    
            {/* Salary Ranges */}
            <div className="bg-white rounded-lg shadow p-6 col-span-1 lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Salary Ranges</h2>
              <div className="h-[300px]">
                <Bar 
                  data={salaryData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top' },
                    }
                  }}
                />
              </div>
            </div>
          </div>
    
          {/* Recent Applications Table */}
          <div className="mt-6 bg-white rounded-lg shadow">
            <div className='flex justify-between items-center'>
            <h2 className="text-lg font-semibold text-gray-800 p-6 border-b">Recent Applications</h2>
            <Link to="/postedjob" className="text-[#0B877D] font-medium hover:text-[#097267] transition-colors mr-10">
        View All
      </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jobseeker Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {jobs.rows.flatMap(job => 
                    job.applications.map(app => (
                      <tr key={app.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${app.status === 'Accepted' ? 'bg-green-100 text-green-800' : 
                              'bg-yellow-100 text-yellow-800'}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    
  }
  
  export default Dashboard;