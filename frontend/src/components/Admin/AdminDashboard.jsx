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
import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Link } from "react-router-dom";
import { FaUsers, FaBuilding, FaUserTie, FaUserGraduate, FaCheckCircle, FaClock, FaChartLine } from 'react-icons/fa';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/dashboard`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className='h-screen w-full flex justify-center items-center'>
        <div className="loader"></div>
      </div>
    );
  }

  if (!data) {
    return <div className="text-center">No data available</div>;
  }

  // Calculate statistics
  const stats = {
    totalUsers: data.users.count,
    totalCompanies: data.company.count,
    employeeUsers: data.users.rows.filter(user => user.role === 'employee').length,
    jobseekerUsers: data.users.rows.filter(user => user.role === 'jobseeker').length,
    adminUsers: data.users.rows.filter(user => user.role === 'admin').length,
    verifiedCompanies: data.company.rows.filter(company => company.isVerified).length,
    pendingCompanies: data.company.rows.filter(company => !company.isVerified).length,
    monthlyGrowthRate: ((data.users.count / 30) * 100).toFixed(1)
  };

  // User roles distribution data
  const userRolesData = {
    labels: ['Employers', 'Job Seekers', 'Admins'],
    datasets: [{
      data: [stats.employeeUsers, stats.jobseekerUsers, stats.adminUsers],
      backgroundColor: [
        'rgba(147, 51, 234, 0.8)',
        'rgba(234, 179, 8, 0.8)',
        'rgba(79, 70, 229, 0.8)'
      ]
    }]
  };

  // Company verification status data
  const companyStatusData = {
    labels: ['Verified', 'Pending'],
    datasets: [{
      data: [stats.verifiedCompanies, stats.pendingCompanies],
      backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(239, 68, 68, 0.8)']
    }]
  };

  // User registration trend (monthly)
  const registrationTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'New Users',
      data: [12, 19, 15, 25, 22, stats.totalUsers],
      backgroundColor: 'rgba(59, 130, 246, 0.8)'
    }]
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FaUsers className="text-blue-500" size={24} />}
          title="Total Users"
          value={stats.totalUsers}
          subtitle="Registered users"
          color="blue"
        />
        
        <StatCard
          icon={<FaUserTie className="text-purple-500" size={24} />}
          title="Employers"
          value={stats.employeeUsers}
          subtitle="Employer accounts"
          color="purple"
        />

        <StatCard
          icon={<FaUserGraduate className="text-yellow-500" size={24} />}
          title="Job Seekers"
          value={stats.jobseekerUsers}
          subtitle="Job seeker accounts"
          color="yellow"
        />

        <StatCard
          icon={<FaUserTie className="text-indigo-500" size={24} />}
          title="Administrators"
          value={stats.adminUsers}
          subtitle="Admin accounts"
          color="indigo"
        />

        <StatCard
          icon={<FaBuilding className="text-green-500" size={24} />}
          title="Total Companies"
          value={stats.totalCompanies}
          subtitle="Registered companies"
          color="green"
        />

        <StatCard
          icon={<FaCheckCircle className="text-emerald-500" size={24} />}
          title="Verified Companies"
          value={stats.verifiedCompanies}
          subtitle="Active companies"
          color="emerald"
        />

        <StatCard
          icon={<FaClock className="text-red-500" size={24} />}
          title="Pending Verification"
          value={stats.pendingCompanies}
          subtitle="Companies awaiting verification"
          color="red"
        />

        <StatCard
          icon={<FaChartLine className="text-teal-500" size={24} />}
          title="Monthly Growth"
          value={`${stats.monthlyGrowthRate}%`}
          subtitle="User growth rate"
          color="teal"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* User Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">User Distribution</h2>
          <div className="h-[200px]">
            <Pie data={userRolesData} options={{ maintainAspectRatio: false }} />
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Employers</span>
              <span className="font-semibold">{((stats.employeeUsers / stats.totalUsers) * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Job Seekers</span>
              <span className="font-semibold">{((stats.jobseekerUsers / stats.totalUsers) * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Admins</span>
              <span className="font-semibold">{((stats.adminUsers / stats.totalUsers) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Company Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Company Verification Status</h2>
          <div className="h-[200px]">
            <Pie data={companyStatusData} options={{ maintainAspectRatio: false }} />
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Verified</span>
              <span className="font-semibold">{((stats.verifiedCompanies / stats.totalCompanies) * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Pending</span>
              <span className="font-semibold">{((stats.pendingCompanies / stats.totalCompanies) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* User Growth Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">User Growth Trend</h2>
          <div className="h-[200px]">
            <Bar 
              data={registrationTrendData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-semibold">Recent Users</h2>
          <Link to="/users" className="text-blue-600 hover:text-blue-800">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.users.rows.slice(0, 5).map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'admin' ? 'bg-indigo-100 text-indigo-800' :
                      user.role === 'employee' ? 'bg-purple-100 text-purple-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Companies Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-semibold">Recent Companies</h2>
          <Link to="/companies" className="text-blue-600 hover:text-blue-800">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Industry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.company.rows.map(company => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        src={company.companyLogo} 
                        alt={company.companyName}
                        className="h-8 w-8 rounded-full mr-3 object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/40?text=Logo';
                        }}
                      />
                      <span className="font-medium">{company.companyName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{company.industry}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{company.companySize}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      company.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {company.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {company.city}, {company.country}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// StatCard Component
const StatCard = ({ icon, title, value, subtitle, color }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 border-${color}-500 hover:shadow-lg transition-shadow`}>
      <div className="flex items-center">
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;