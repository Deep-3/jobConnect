// components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { 
  FaTimes, 
  FaHome, 
  FaUserAlt, 
  FaBriefcase, 
  FaBookmark,
  FaEnvelope,
  FaCog,
  FaSubscript,
  FaSignOutAlt,
  FaBuilding,
  FaUsers,
  FaSearch
} from "react-icons/fa";
import { MdDashboard,MdWork} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../redux/slices/UiSlice";


const Sidebar = () => {

  const job=useSelector((state)=>state.job);
  const dispatch=useDispatch();
  const {isLogin,User}=useSelector((state)=>state.auth)

  const jobseekerMenu=[
    { path: "/", icon: FaHome, label: "Home" },
    { path: "/profile", icon: FaUserAlt, label: "Profile" },
    { path: "/my-jobs", icon: FaBriefcase, label: "My Jobs" },
    { path: "/savejob", icon: FaBookmark, label: "Saved Jobs" },
    { path: "/findjob", icon: FaSearch, label: "Find Job" },
    { path: "/subcription", icon: FaSubscript, label: "Subcription Plan" },
    { path: "/community", icon: FaUsers, label: "Community" },
    { path: "/settings", icon: FaCog, label: "Settings" },
  ];
  const employeeMenu= [
    { path: "/", icon: FaHome, label: "Home" },
    { path: "/employer/dashboard", icon: MdDashboard, label: "Dashboard" },
    { path: "/postedjob", icon: MdWork, label: "Posted Job" },
    { path: "/profile", icon: FaUserAlt, label: "Profile" },
    { path: "/companies", icon: FaBuilding, label: "Companies" },
    { path: "/settings", icon: FaCog, label: "Settings" },
  ];

  const AdminMenu= [
    { path: "/", icon: FaHome, label: "Home" },
    { path: "/admin/dashboard", icon: MdDashboard, label: "Dashboard" },
    { path: "/companies", icon: FaBuilding, label: "Companies" },
    { path: "/messages", icon: FaEnvelope, label: "Messages" },
    { path: "/settings", icon: FaCog, label: "Settings" },
  ];
  const menuItems =User?.role==='jobseeker'?jobseekerMenu:User?.role==="employee"?employeeMenu:AdminMenu;
  const publicMenuItems = [
    { path: "/", icon: FaHome, label: "Home" },
    { path: "/companies", icon: FaBuilding, label: "Contact Us" },
    // { path: "/community", icon: FaUsers, label: "Community" },
    { path: "/contact", icon: FaEnvelope, label: "Contact Us" },

  ];


  return (
    <>
      {/* Overlay */}
      {/* {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )} */}

      {/* Sidebar */}
      <aside className={` h-full w-full bg-white shadow-lg transform transition-transform duration-300
  `}>
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
          <button 
      onClick={() => dispatch(toggleSidebar())}
      className="border-[0.5px] absolute top-1.5 right-1 text-red-500 hover:text-red-600"
    >
      <FaTimes className="w-5 h-5" />
    </button>
          
    <div className="flex items-center mt-2 space-x-3">
  {isLogin ? (
    // Show user profile when logged in
    <>
      <div className="w-10 h-10 rounded-full">
        {/* <FaUserAlt className="w-5 h-5 text-white" />
         */}
         <img className="w-10 h-10 rounded-full flex items-center justify-center" src={`https://api.dicebear.com/5.x/initials/svg?seed=${User?.name.split(" ")[0]} ${User?.name.split(" ")[User.name.split(" ").length-1]}&backgroundColor=0B877D`} alt="logo" /> 
      </div>
      <div className="overflow-hidden">
        <h3 className="font-medium text-gray-800 truncate">{User?.name.split(" ").slice(0,2).join(" ").toLowerCase()}</h3>
        <p className="text-[12px] text-gray-500 truncate font-semibold">{User?.email}</p>
      </div>
    </>
  ) : (
    // Show login/register buttons when logged out
    <div className="flex space-x-3">
      <NavLink 
        to="/login" 
         className={({ isActive }) => `
         ${isActive 
          ? 'px-4 py-2 text-sm font-medium text-white bg-[#0B877D] border border-[#0B877D] rounded-md hover:bg-[#0a7c73]' 
          : 'px-4 py-2 text-sm font-medium text-gray-600 border border-[#0B877D]  rounded-md hover:bg-[#0a7c73]'}
      `}  
        onClick={()=>dispatch(toggleSidebar())}
      >
        Login
      </NavLink>
      <NavLink 
        to="/register" 
        className={({ isActive }) => `
        ${isActive 
          ? 'px-4 py-2 text-sm font-medium text-white bg-[#0B877D] border border-[#0B877D] rounded-md hover:bg-[#0a7c73]' 
          : 'px-4 py-2 text-sm font-medium text-gray-600 border border-[#0B877D]  rounded-md hover:bg-[#0a7c73]'}
      `}   
      onClick={()=>dispatch(toggleSidebar())}
         >
        Register
      </NavLink>
    </div>
  )}
</div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-180px)]">
        {(isLogin ? menuItems : publicMenuItems).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center space-x-3 px-4 py-3 rounded-lg
              transition-colors duration-200
              ${isActive 
                ? 'bg-[#0B877D] text-white' 
                : 'text-gray-600 hover:bg-gray-100'}
            `}
            onClick={() => window.innerWidth<1024 && setIsOpen(false)}
          >
            <item.icon className="w-5 h-5" />
            {item.label==="Saved Jobs"?(<div className="flex gap-12 relative">
              <span>{item.label}</span>
            {job.length>0?(<span className="w-4 h-4 absolute top-1 -right-17 bg-red-500 text-white text-xs rounded-full text-center">{job.length}</span>):""}
              </div>
          ):( <span>{item.label}</span>)}
           
          </NavLink>
        ))}
      </nav>
      </aside>
    </>
  );
};

export default Sidebar;