"use client"
import React,{ useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

const ChangePassword = ({close}) => {
    const router = useRouter();
  const {
          register,
          handleSubmit,
          watch,
          setError,
          clearErrors,
          reset,
          formState: { errors, isSubmitting },
      } = useForm();
  
      const [showPassword, setShowPassword] = useState(false);
      const [showConfirmPassword, setShowConfirmPassword] = useState(false);
      const [showOldPassword,setShowOldPassword] = useState(false);
      const watchedPassword = watch('password') || '';
      const watchedOldPassword = watch('oldpassword') || '';
      const watchedCPassword = watch('cPassword') || '';
      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

      useEffect(() => {
          if (Object.keys(errors).length > 0) {
              clearErrors();
          }
      }, [watchedOldPassword, watchedPassword, watchedCPassword, errors, clearErrors]);
      
      const hasUpper = /[A-Z]/.test(watchedPassword);
      const hasLower = /[a-z]/.test(watchedPassword);
      const hasNumber = /[0-9]/.test(watchedPassword);
      const hasSpecial = /[^A-Za-z0-9]/.test(watchedPassword);
  
      const password = watch("password","");
  
      const onSubmit = async (data) => {
          try {
              let r = await fetch(`${process.env.NEXT_PUBLIC_URL}/changePassword`, { 
                  method: 'PUT', 
                  credentials: 'include',
                  headers: { "Content-Type": "application/json", "Accept": "application/json" }, 
                  body: JSON.stringify(data) 
              });
              let result = await r.json();
  
              if(r.ok && result.success) {
                  setError('success', { 
                      message: "Password Changed successfully! Redirecting to dashboard..." 
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
                          message: result.message || 'Password updating failed. Please try again.'
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
              {isSubmitting ? <div className='text-lg md:text-xl text-cyan-300 text-center font-bold'>Form is Submitting... </div> : (errors.ServerError ? <div className='text-lg md:text-xl text-red-500 text-center font-bold'>{errors.ServerError.message}</div> : <div className='text-2xl md:text-3xl text-green-500 text-center font-bold'>Change Password</div>)}


              <form action="" className='' onSubmit={handleSubmit(onSubmit)}>

                    <div className = "flex flex-col text-[0.9rem] md:text-base text-bold my-3 md:my-4">
                      <label htmlFor="oldpassword" className='mb-1 font-semibold'>Old Password:</label>

                      <div className='relative'>
                          <input id = "oldpassword" className="w-full border rounded px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-cyan-400" type={showOldPassword ? 'text' : 'password'} placeholder="Password" {...register("oldpassword", { required: { value: true, message: "This field is required" }, pattern: { value: passwordPattern, message: "Password must include uppercase, lowercase, number and special character" }, minLength: { value: 8, message: "Password should have at least 8 characters" }, maxLength: { value: 50, message: "Max length of Password is 50" } })} />

                          <button type='button' className='absolute right-2 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-600 hover:text-gray-800' onClick={()=>setShowOldPassword(prev=>!prev)} aria-label={showOldPassword ? 'Hide password' : 'Show password'}>
                              {showOldPassword ? 'Hide' : 'Show'}
                          </button>
                      </div>
                    </div>


                  <div className = "flex flex-col text-[0.9rem] md:text-base text-bold my-3 md:my-4">
                      <label htmlFor="password" className='mb-1 font-semibold'>New Password:</label>

                      <div className='relative'>
                          <input id = "password" className="w-full border rounded px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-cyan-400" type={showPassword ? 'text' : 'password'} placeholder="Password" {...register("password", { required: { value: true, message: "This field is required" }, pattern: { value: passwordPattern, message: "Password must include uppercase, lowercase, number and special character" }, minLength: { value: 8, message: "Password should have at least 8 characters" }, maxLength: { value: 50, message: "Max length of Password is 50" } })} />

                          <button type='button' className='absolute right-2 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-600 hover:text-gray-800' onClick={()=>setShowPassword(prev=>!prev)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                              {showPassword ? 'Hide' : 'Show'}
                          </button>
                      </div>

                  <div className = "flex flex-col text-[0.9rem] md:text-base text-bold my-3 md:my-4">
                      <label htmlFor="cPassword" className='mb-1 font-semibold'>Confirm New Password:</label>

                      <div className='relative'>
                          <input id = "cPassword" className="w-full border rounded px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-cyan-400" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" {...register("cPassword", { required: { value: true, message: "This field is required" }, minLength: { value: 8, message: "Password should have at least 8 characters" }, maxLength: { value: 50, message: "Max Length of Password is 50 characters" }, validate:(value)=> value === watchedPassword || "Password does not match" })} />

                          <button type='button' className='absolute right-2 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-600 hover:text-gray-800' onClick={()=>setShowConfirmPassword(prev=>!prev)} aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
                              {showConfirmPassword ? 'Hide' : 'Show'}
                          </button>
                      </div>
                  </div>

                      <div className='mt-3 text-xs md:text-sm'>
                          <p className='text-gray-600 mb-2 font-semibold'>Your password must have:</p>
                          <div className={`flex items-center gap-2 mb-1 ${hasUpper ? 'text-green-600' : 'text-gray-400'}`}>
                              <span className='font-bold text-lg'>{hasUpper ? '✓' : '○'}</span>
                              <span>At least one capital letter (A-Z)</span>
                          </div>
                          <div className={`flex items-center gap-2 mb-1 ${hasLower ? 'text-green-600' : 'text-gray-400'}`}>
                              <span className='font-bold text-lg'>{hasLower ? '✓' : '○'}</span>
                              <span>At least one small letter (a-z)</span>
                          </div>
                          <div className={`flex items-center gap-2 mb-1 ${hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
                              <span className='font-bold text-lg'>{hasNumber ? '✓' : '○'}</span>
                              <span>At least one number (0-9)</span>
                          </div>
                          <div className={`flex items-center gap-2 ${hasSpecial ? 'text-green-600' : 'text-gray-400'}`}>
                              <span className='font-bold text-lg'>{hasSpecial ? '✓' : '○'}</span>
                              <span>At least one special character (!@#$%^&* etc.)</span>
                          </div>
                      </div>
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
                      <input disabled={isSubmitting} className="flex-1 py-2 bg-cyan-500 outline-2 outline-cyan-800 rounded-3xl text-white text-sm md:text-base font-semibold hover:scale-105 cursor-pointer transition-transform" type="submit" value="Update Password" />
                      <button disabled={isSubmitting} type="button" onClick={close} className="flex-1 py-2 bg-gray-400 rounded-3xl text-white text-sm md:text-base font-semibold hover:scale-105 cursor-pointer transition-transform">
                          Cancel
                      </button>
                  </div>
              </form>
          </div></div>
      )  }
export default React.memo(ChangePassword);
