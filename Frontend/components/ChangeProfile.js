"use client"
import React ,{ useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';

const ChangeProfile = ({close}) => {
   const {
          register,
          handleSubmit,
          watch,
          setError,
          clearErrors,
          reset,
          formState: { errors, isSubmitting },
      } = useForm();
  
    const watchedFirstName = watch('firstName') || '';
    const watchedLastName = watch('lastName') || '';

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            clearErrors();
        }
    }, [watchedFirstName, watchedLastName, errors, clearErrors]);
  
      const onSubmit = async (data) => {
          try {
              let r = await fetch(`${process.env.NEXT_PUBLIC_URL}/changeprofile`, { 
                  method: 'PUT', 
                  credentials:'include',
                  headers: { "Content-Type": "application/json" }, 
                  body: JSON.stringify(data) 
              });
              let result = await r.json();
  
              if(r.ok && result.success) {
                  setError('success', { 
                      message: "Profile Changed successfully! Redirecting to dashboard..." 
                  });
                  reset();
                  await new Promise(resolve => setTimeout(resolve, 1500));
                  close();
              } else {
                  
                  if(result.field) {
                      setError(result.field, { 
                          message: result.message || 'Invalid input',
                          type: 'server'
                      });
                  } else {
                      setError('ServerError', { 
                          message: result.message || 'Profile Updating failed. Please try again.'
                      });
                  }
              }
          } catch (e) {
              if(e.name === "TypeError" && e.message === "Failed to fetch") {
                  console.error(e);
                  setError('ServerError', { 
                      message: "Unable to connect to server. Please check your internet connection." 
                  });
              } else {
                  setError('ServerError', { 
                      message: "An error occurred. Please try again later." 
                  });
              }
          }
  
      }
  
      return (
         <div className='fixed inset-0 w-full h-full backdrop-blur-sm z-50 flex items-start md:items-center justify-center p-4'>
          <div className='w-full max-w-md bg-white my-10 md:my-0 py-4 px-4 md:px-6 rounded-xl shadow-lg'>
              {isSubmitting ? <div className='text-lg md:text-xl text-cyan-300 text-center font-bold'>Form is Submitting... </div> : (errors.ServerError ? <div className='text-lg md:text-xl text-red-500 text-center font-bold'>{errors.ServerError.message}</div> : <div className='text-2xl md:text-3xl text-green-500 text-center font-bold'>Change Profile</div>)}


              <form action="" className='' onSubmit={handleSubmit(onSubmit)}>
                  <div className = "flex flex-col text-[0.9rem] md:text-base text-bold my-3 md:my-4">
                      <label htmlFor="first" className='mb-1 font-semibold'>First Name:</label>

                      <input id = "first" className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-cyan-400" type="text" placeholder="First Name" {...register("firstName", { required: { value: true, message: "This field is required" }, minLength: { value: 2, message: "First Name should have at least 2 characters" }, maxLength: { value: 25, message: "Max Length of First Name is 25 characters" } })} />
                      {errors.firstName && (
                          <p className='text-xs md:text-sm text-red-600 mt-1'>
                              {errors.firstName.message}
                          </p>
                      )}
                  </div>

                  <div className = "flex flex-col text-[0.9rem] md:text-base text-bold my-3 md:my-4">
                      <label htmlFor="last" className='mb-1 font-semibold'>Last Name:</label>

                      <input className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-cyan-400" id = "last" type="text" placeholder="Last Name" {...register("lastName", { required: { value: true, message: "This field is required" }, minLength: { value: 2, message: "Last Name should have at least 2 characters" }, maxLength: { value: 25, message: "Max Length of Last Name is 25 characters" } })} />
                      {errors.lastName && (
                          <p className='text-xs md:text-sm text-red-600 mt-1'>
                              {errors.lastName.message}
                          </p>
                      )}
                  </div>


                  <div className='space-y-2 my-4 md:my-5'>
                      {errors.success && (
                          <p className='text-xs md:text-sm text-green-600 text-center font-medium bg-green-50 p-2 rounded'>
                              {errors.success.message}
                          </p>
                      )}
                      {errors.ServerError && (
                          <p className='text-xs md:text-sm text-red-600 text-center font-medium bg-red-50 p-2 rounded'>
                              {errors.ServerError.message}
                          </p>
                      )}
                  </div>

                  <div className='flex gap-3 mt-4 md:mt-5'>
                      <input disabled={isSubmitting} className="flex-1 py-2 bg-cyan-500 outline-2 outline-cyan-800 rounded-3xl text-white text-sm md:text-base font-semibold hover:scale-105 cursor-pointer transition-transform" type="submit" value="Update Profile" />
                      <button disabled={isSubmitting} type="button" onClick={close} className="flex-1 py-2 bg-gray-400 rounded-3xl text-white text-sm md:text-base font-semibold hover:scale-105 cursor-pointer transition-transform">
                          Cancel
                      </button>
                  </div>
              </form>
          </div>
          </div>
      )  }

export default React.memo(ChangeProfile);
