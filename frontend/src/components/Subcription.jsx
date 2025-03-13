import React from 'react'
import { useSelector } from 'react-redux'
import {toast} from 'react-hot-toast';


const Subcription = () => {
   const {User}=useSelector((state)=>state.auth)
    const subscription=async()=>{
        // console.log("hello")
        
        const response=await fetch(`${import.meta.env.VITE_BACKEND_URL}/payment`,
        {
            method: 'GET',
            credentials:'include'
        }
        )
        const data=await response.json()
        if(data.success)
        {
          const {order,key}=data;

          console.log(order);
   
       const options = {
           key, // Replace with your Razorpay key_id
           amount:order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
           currency: 'INR',
           name: 'Job Connect',
           description: 'Subscription plan',
           order_id:order.id   , // This is the order_id created in the backend
           callback_url: `${import.meta.env.VITE_BACKEND_URL}/payment/verifySignature`, // Your success URL
           prefill: {
             name: User.name.split(" ").slice(0,2).join(" "),
             email: User.email,
           },
           theme: {
             color: '#0B877D'
           },
         };
   
         const rzp = new Razorpay(options);
         rzp.open();
       
       }
        else
        {
           toast.success(data.message);
          }

      }
  return (
    <div className='h-screen w-full flex justify-center items-center'>
         <button className='w-10 h-10 border bg-[#0B877D]' onClick={subscription}>
            Pay
         </button>
    </div>
  )
}

export default Subcription
