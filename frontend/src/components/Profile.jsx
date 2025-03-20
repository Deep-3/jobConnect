import React from 'react';
import { useSelector } from 'react-redux';
import { FaRegEdit } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Profile = () => {
 
   const navigate=useNavigate();
  const {User}=useSelector((state)=>state.auth)
  return (
   <div className='flex flex-col ml-40 gap-10 mt-10'>
       
       <div className='text-3xl font-semibold'>
          My Profile
       </div>
   
       <div className='w-[80%] bg-[white] rounded-lg shadow-lg bg-white flex justify-between px-20 items-center'>
    
        <div className=' py-[18px] flex gap-3 m-3 justify-between items-center'>
        <div>
         <img className="w-18 h-18 rounded-full flex items-center justify-center" src={`https://api.dicebear.com/5.x/initials/svg?seed=${User?.name.split(" ")[0]} ${User?.name.split(" ")[User.name.split(" ").length-1]}&backgroundColor=0B877D`} alt="logo" /> 
         </div>
         <div >
            <p className='text-xl font-bold'>{User?.name}</p>
            <p className='font-semibold'>{User?.email}</p>
         </div>
        </div>
        
         <div className='flex items-center gap-2 px-4 py-2 bg-[#0B877D] text-white font-medium rounded-lg hover:bg-[#097267]' >
            <button className='flex items-center gap-2' onClick={()=>navigate("/settings")}>
              Edit <FaRegEdit className='w-3 h-3'/>
            </button>
         </div>
       </div>

       <div className='rounded-lg shadow-lg flex flex-col gap-3 bg-white w-[80%]'>
          <div className='flex py-6 mx-3 px-17 justify-between items-center'>
            <div className='text-xl font-bold'>
              About
            </div>
            <div className='flex items-center gap-2 px-4 py-2 bg-[#0B877D] text-white font-medium rounded-lg hover:bg-[#097267]' >
            <button className='flex items-center gap-2 ' onClick={()=>navigate("/settings")}>
              Edit <FaRegEdit className='w-3 h-3' />
            </button>
         </div>
          </div>
          <div className='px-20 text-start mb-2'>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste rerum explicabo quod eaque doloribus voluptates at id, ratione minima est eius hic illum repellendus! Soluta dolore aliquid, labore voluptas totam cum repellendus esse fugiat provident dolor eveniet consequatur, error quae ea libero, officia amet delectus.
          </div>
        </div>

        <div className='rounded-lg shadow-lg flex flex-col gap-3 bg-white w-[80%] mb-20'>
        <div className='flex py-6 mx-3 px-17 justify-between items-center'>
            <div className='text-xl font-bold'>
              Personal Details
            </div>
            <div className='flex items-center gap-2 px-4 py-2 bg-[#0B877D] text-white font-medium rounded-lg hover:bg-[#097267]' >
            <button className='flex items-center gap-2' onClick={()=>navigate("/settings")}>
              Edit <FaRegEdit className='w-3 h-3'/>
            </button>
         </div>
          </div>
        <div className='px-20'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque sint asperiores odio reprehenderit et consectetur perspiciatis, laudantium corrupti est! Provident earum ad repellat omnis eum a quisquam vel ipsam enim corrupti optio illum quae veritatis, sit, consequatur iusto et delectus. Repellendus dolores culpa ipsa repellat.</div>
        </div>


   </div>
  )
}

export default Profile
