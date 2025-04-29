// App.jsx
import { useState, useEffect } from 'react';
import { Route, Routes,useNavigate } from "react-router-dom";
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Login from './components/Login';
import SignUp from './components/SignUp';
import OTP from './components/Otp';
import SelectRole from './components/SelectRole';
import Layout from './components/Layout';
import Community from './components/Community';
import FindJob from './components/FindJob';
import SaveJob from './components/SaveJob';
import Subcription from './components/Subcription';
import PaymentSuccess from './components/PaymentSuccess';
import Chatbot from './components/Chatbot';
import Profile from './components/Profile';
import Settings from './components/Setting';
import Myjob from './components/Myjob';
import CompanyForm from './components/Employer/CompanyForm';
import PostedJob from './components/Employer/PostedJob';
import JobApplication from './components/Employer/JobApplication';
import Dashboard from './components/Employer/Dashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import {setLogin, setUser} from "./redux/slices/AuthSlice"
import toast from 'react-hot-toast';
import { getuser } from './services/api';
import { apiconnector } from './services/apiconnector';
import { requestFcmToken,onMessageListener } from './utils/FirebaseUtils';
import VerifyCompany from './components/Admin/VerifyCompany';
function App() {
  const {isLogin,User}=useSelector((state)=>state.auth);
  const dispatch=useDispatch()
  const[fcmtoken,setfcmtoken]=useState(null)
  const [isLoading,setisLoading]=useState(false);
  const navigate = useNavigate();
 

 useEffect(()=>{
    console.log("token",fcmtoken)
 },[fcmtoken])
  
  useEffect(() => {
  
    const checkAuth = async () => {
      setisLoading(true);
      try {
  
        const {data} = await apiconnector("GET",getuser.GETUSER_URL)
        // console.log("uuuser",data)
        
        if (data.user) {
          if(data.user.pendingRegistration)
          {
              navigate('/selectrole',{state:{email:data.user.email},replace:true});
              toast.error("please complete your verification")
          }
          else
          {
          dispatch(setLogin(true))
          dispatch(setUser(data.user))
          }
         
        } else {
          dispatch(setLogin(false))
          dispatch(setUser(null))
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        dispatch(setLogin(false))
        dispatch(setUser(null))
      } finally {
         setisLoading(false);
        //  console.log("hello")
      }
    };
  
    checkAuth();
  },[isLogin]);

  useEffect(()=>{
    
    const fccmtoken=async()=>{
      try
      {
        const token=await requestFcmToken();
        setfcmtoken(token)

        if(User)
        {
          const response=await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/addfcmtoken`,{
            method:"PUT",
            headers:{
              "Content-Type":"application/json",
            },
            credentials:'include',
            body:JSON.stringify({fcmtoken})
          })
          const data=await response.json();
          console.log(data)
          
          if(data.success)
          {
            console.log("fcmtoken added")
          }
       
        }

       }
      catch(error)
      {
        console.log(error)
      }
     
    }
    fccmtoken();

    onMessageListener().then((payload)=>{
      toast.success(payload.notification.body)
      console.log("message received",payload)
    })
    .catch((error)=>{
      console.log("error",error)
      })
  },[User])


  if (isLoading) {
    return (
      <div className='h-screen w-full flex justify-center items-center'>
              <div className="loader"></div>
      </div>

    );
  }

  return (

    <>
     <Routes>
      <Route path="/" element={
        <Layout> 
        </Layout>
      }>
        <Route index element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/community" element={<Community />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<SignUp/>} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/selectrole" element={<SelectRole/>} />
        <Route path="/findjob" element={<FindJob/>} />
        <Route path="/savejob" element={<SaveJob/>} />
        <Route path="/subcription" element={<Subcription/>} />
        <Route path="/payment-success" element={<PaymentSuccess/>} />
       <Route path="/profile" element={<Profile/>}/>
       <Route path="/my-jobs" element={<Myjob/>}/>
       <Route path="/settings" element={<Settings/>}/>
       <Route path="/companies" element={User?.role==='employee'?<CompanyForm/>:<VerifyCompany/>}/>
       <Route path="/postedjob" element={<PostedJob/>}/>
       <Route path="/jobapplication/:id" element={<JobApplication/>}/>
       <Route path="/employer/dashboard" element={<Dashboard/>}/>
       <Route path="/admin/dashboard" element={<AdminDashboard/>}/>






        <Route 
          path="*" 
          element={
            <div className="flex items-center justify-center h-[calc(100vh-64px)]">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">Page not found</h2>
                <p className="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
              </div>
            </div>
          }
        />
      </Route>
    </Routes>
    {isLogin && <Chatbot/>}

    </>
   
  );
}

export default App;