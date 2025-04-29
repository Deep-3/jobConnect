import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import Upload from '../../common/Upload';
import {toast} from "react-hot-toast";
import ChipInput from '../../common/ChipInput';
const CompanyForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState(null);
  const checkCompany = async() => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/employer/checkcompany`, {
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();
      
      if(data.success) {
        setCompany(data.company);
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
      toast.error("Failed to fetch company data");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    
    checkCompany();
  }, []);

  const onSubmit = async(data) => {
    const formData=new FormData();
    try {
      setLoading(true);
    
      formData.append('companyName', data.companyName);
      formData.append('companyDescription', data.companyDescription);
      formData.append('industry', data.industry); 
      formData.append('companySize', data.companySize);
      formData.append('companyWebsite', data.companyWebsite);
      formData.append('contactEmail', data.contactEmail);
      formData.append('contactPhone', data.contactPhone);
      formData.append('address', data.address);
      formData.append('city', data.city);
      formData.append('country', data.country);
      formData.append('state', data.state);
      formData.append('postalCode', data.postalCode);
      
      // Handle socialLinks array
      formData.append('socialLinks', JSON.stringify(data.socialLinks));
      
      // Append the file correctly
      formData.append('logo', data.logo);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/employer/company`,{
        method: 'POST',
        credentials: 'include',
        body:formData
      });
      
      const companyResponse = await response.json();
      
      if(companyResponse.success) {
        toast.success(companyResponse.message);
        reset();
        checkCompany();
      }
    } catch(error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if(loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0B877D]"></div>
    </div>;
  }

  // Display company status message when company exists
  if(company) {
    if(company.status === "active") {
      return (
        <div className='flex flex-col gap-3'>
            <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
          <div className="bg-green-100 p-4 rounded-md mb-6">
            <h1 className="text-2xl font-bold text-center text-green-800 mb-4">Company Profile Active</h1>
            <p className="text-green-700 text-center">Your company profile has been verified and is active.</p>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex justify-center mb-4">
              {company.companyLogo && (
                <img 
                  src={company.companyLogo} 
                  alt={company.companyName} 
                  className="h-32 w-32 object-cover rounded-md shadow-md"
                />
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 font-semibold">Company Name:</p>
                <p className="font-bold">{company.companyName}</p>
              </div>
              
              <div>
                <p className="text-gray-600 font-semibold">Company Code:</p>
                <p className="font-bold">{company.companyCode}</p>
              </div>
              
              <div>
                <p className="text-gray-600 font-semibold">Industry:</p>
                <p>{company.industry}</p>
              </div>
              
              <div>
                <p className="text-gray-600 font-semibold">Company Size:</p>
                <p>{company.companySize}</p>
              </div>
              
              <div>
                <p className="text-gray-600 font-semibold">Website:</p>
                <a href={company.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-[#0B877D] hover:underline">
                  {company.companyWebsite}
                </a>
              </div>
              
              <div>
                <p className="text-gray-600 font-semibold">Email:</p>
                <p>{company.contactEmail}</p>
              </div>
              
              <div>
                <p className="text-gray-600 font-semibold">Phone:</p>
                <p>{company.contactPhone}</p>
              </div>
              
              <div>
                <p className="text-gray-600 font-semibold">Location:</p>
                <p>{company.address}, {company.city}, {company.state}, {company.country}, {company.postalCode}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-gray-600 font-semibold">Description:</p>
              <p className="text-gray-800">{company.companyDescription}</p>
            </div>
            
            <div className="mt-4">
              <p className="text-gray-600 font-semibold">Subscription:</p>
              <p>Plan: <span className="capitalize">{company.subscriptionPlan}</span> | Status: <span className="capitalize">{company.subscriptionStatus}</span></p>
            </div>
          </div>
        </div>
          
        
          </div>
      );
    } else if(company.status === "pending") {
      return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
          <div className="bg-yellow-100 p-4 rounded-md">
            <h1 className="text-2xl font-bold text-center text-yellow-800 mb-4">Company Profile Pending</h1>
            <p className="text-yellow-700 text-center">Your company profile is under review. We'll notify you once it's approved.</p>
          </div>
          
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Submitted Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 font-semibold">Company Name:</p>
                <p>{company.companyName}</p>
              </div>
              
              <div>
                <p className="text-gray-600 font-semibold">Industry:</p>
                <p>{company.industry}</p>
              </div>
              
              <div>
                <p className="text-gray-600 font-semibold">Email:</p>
                <p>{company.contactEmail}</p>
              </div>
              
              <div>
                <p className="text-gray-600 font-semibold">Submitted On:</p>
                <p>{new Date(company.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
          <div className="bg-red-100 p-4 rounded-md mb-6">
            <h1 className="text-2xl font-bold text-center text-red-800 mb-4">Company Profile Rejected</h1>
            <p className="text-red-700 text-center">Your company profile has been rejected. Please contact support for more information.</p>
          </div>
        </div>
      );
    }
  }

  // Display the form when company doesn't exist
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Company Form</h1>
      <form className='flex flex-col gap-7' onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-5'>
          <div>
            <label htmlFor="companyName" className='text-lg font-bold'>Company Name</label>
            <input id="companyName" type="text" {...register("companyName", { required: "Company Name is required" })} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B877D]" placeholder='Your company Name'/>
            {errors.companyName && <p className='text-red-500'>{errors.companyName.message}</p>}
          </div>

          <div>
            <label htmlFor="companyDescription" className='text-lg font-bold'>Company Description</label>
            <textarea id="companyDescription" {...register("companyDescription", { required: "Description is required", maxLength: { value: 100, message: "Max length is 100" } })} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B877D]" placeholder='Please describe here' rows={4} cols={20} />
            {errors.companyDescription && <p className='text-red-500'>{errors.companyDescription.message}</p>}
          </div>

          <div>
            <label htmlFor="industry" className='text-lg font-bold'>Industry</label>
            <input id="industry" type="text" {...register("industry", { required: "Industry is required" })} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B877D]" placeholder='Industry'/>
            {errors.industry && <p className='text-red-500'>{errors.industry.message}</p>}
          </div>

          <div>
            <label htmlFor="companySize" className='text-lg font-bold'>Company Size</label>
            <input id="companySize" type="text" {...register("companySize", { required: "Company Size is required" })} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B877D]" placeholder='Company Size'/>
            {errors.companySize && <p className='text-red-500'>{errors.companySize.message}</p>}
          </div>

          <div>
            <label htmlFor="companyWebsite" className='text-lg font-bold'>Company Website</label>
            <input id="companyWebsite" type="url" {...register("companyWebsite", { required: "Website is required" })} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B877D]" placeholder='https://example.com'/>
            {errors.companyWebsite && <p className='text-red-500'>{errors.companyWebsite.message}</p>}
          </div>

          <div>
            <label htmlFor="contactEmail" className='text-lg font-bold'>Contact Email</label>
            <input id="contactEmail" type="email" {...register("contactEmail", { required: "Email is required" })} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B877D]" placeholder='Email'/>
            {errors.contactEmail && <p className='text-red-500'>{errors.contactEmail.message}</p>}
          </div>

          <div>
            <label htmlFor="contactPhone" className='text-lg font-bold'>Contact Phone</label>
            <input id="contactPhone" type="tel" {...register("contactPhone", { required: "Phone number is required" })} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B877D]" placeholder='Phone'/>
            {errors.contactPhone && <p className='text-red-500'>{errors.contactPhone.message}</p>}
          </div>

          <div>
            <label htmlFor="address" className='text-lg font-bold'>Address</label>
            <input id="address" type="text" {...register("address", { required: "Address is required" })} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B877D]" placeholder='Address'/>
            {errors.address && <p className='text-red-500'>{errors.address.message}</p>}
          </div>

          <div>
            <label htmlFor="city" className='text-lg font-bold'>City</label>
            <input id="city" type="text" {...register("city", { required: "City is required" })} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B877D]" placeholder='City'/>
            {errors.city && <p className='text-red-500'>{errors.city.message}</p>}
          </div>

          <div>
            <label htmlFor="country" className='text-lg font-bold'>Country</label>
            <input id="country" type="text" {...register("country", { required: "Country is required" })} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B877D]" placeholder='Country'/>
            {errors.country && <p className='text-red-500'>{errors.country.message}</p>}
          </div>

          <div>
            <label htmlFor="state" className='text-lg font-bold'>State</label>
            <input id="state" type="text" {...register("state", { required: "State is required" })} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B877D]" placeholder='State'/>
            {errors.state && <p className='text-red-500'>{errors.state.message}</p>}
          </div>

          <div>
            <label htmlFor="postalCode" className='text-lg font-bold'>Postal Code</label>
            <input id="postalCode" type="text" {...register("postalCode", { required: "Postal Code is required" })} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B877D]" placeholder='Postal Code'/>
            {errors.postalCode && <p className='text-red-500'>{errors.postalCode.message}</p>}
          </div>

          <div>
            <label htmlFor="socialLinks" className='text-lg font-bold'>Social Links</label>
            <ChipInput
              label="socialLinks"
              name="socialLinks"
              placeholder="Enter all socialLinks using Comma or Enter"
              register={register}
              errors={errors}
              setValue={setValue}
            />
          </div>

          <div>
            <label htmlFor="CompanyLogo" className='text-lg font-bold'>Company Logo</label>
            <Upload
              name="logo"
              register={register}
              errors={errors}
              setValue={setValue}
            />
          </div>

          <button type="submit" className="p-3 bg-[#0B877D] text-white rounded-md hover:bg-[#086F63]">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default CompanyForm;