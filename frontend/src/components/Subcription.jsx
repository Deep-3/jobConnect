import React, { useState } from 'react'
import { useSelector,} from 'react-redux'
import {toast} from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const Subcription = () => {
  const navigate=useNavigate();
  const [loading,setloading]=useState(false);
   const {User}=useSelector((state)=>state.auth)
    const subscription=async()=>{
        // console.log("hello")
        setloading(true);
        const response=await fetch(`${import.meta.env.VITE_BACKEND_URL}/payment`,
        {
            method: 'GET',
            credentials:'include'
        }
        )
        const data=await response.json()
        setloading(false);
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
          //  callback_url: `${import.meta.env.VITE_BACKEND_URL}/payment/verifySignature`, // Your success
           Handler:function(response)
           {
              verifySignature(response);
           },
           prefill: {
             name: User.name.split(" ").slice(0,2).join(" "),
             email: User.email,
             contact:'9999999999'
           },
           theme: {
             color: '#0B877D'
           },
         };
   
         const rzp = new window.Razorpay(options);
         rzp.open();
       
       }
        else
        {
           toast.success(data.message);
          }

      }

    const verifySignature=async(bodyData)=>
    {
      console.log("bodydata",bodyData)
      try
      {
        setloading(true);
      const response=await fetch(`${import.meta.env.VITE_BACKEND_URL}/payment/verifySignature`
        ,{
          method: 'POST',
          credentials:'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body:JSON.stringify(bodyData)
        })
        const data= await response.json();
        if(data.success)
        {
          navigate('/payment-success',{replace:true});
          toast.success(data.message);
        }
        else
        {
          toast.error(data.message)
        }
      }
      catch(error)
      {
        console.error(error);
        toast.error('Internal server error');
      }
      setloading(false);
    }
      
     
  return (
    <div className='h-screen w-full flex flex-col justify-center items-center'>
  
        {!loading?(<button className='p-3 w-20 rounded-lg bg-[#0B877D] text-white font-semibold' onClick={subscription}>
            Pay
         </button>):(<div>Loading...</div>)
         }
    </div>
  )
}


export default Subcription;