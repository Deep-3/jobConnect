import React from 'react'

const Profile = () => {
  return (
    <div className='flex flex-col items-center justify-between'>
        <div className='font-semibold flex flex-start text-4xl'>
            <h1>Profile</h1>
        </div>
        <div className='w-4/12 flex flex-rows items-center justify-around'>
            <div className='flex flex-col'>
                <label htmlFor="firstname">Firstname</label>
                 <input type='text' id="firstname" name="firstname" className='border-b'placeholder='Your Name'>
                 </input>
            </div>
            <div  className='flex flex-col'>
            <label htmlFor="lastname">Lastname</label>
                 <input type='text' id="lastname" name="lastname" className='border-b'placeholder='Your Name'>
                 </input>
            </div>

            
        </div>
        <div className=''>
                <p>Email</p>
            </div>
    </div>
  )
}

export default Profile
