"use client"
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';

const Login = () => {
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
  const watchedPassword = watch('password') || '';
  const watchedEmail = watch('email') || '';
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;


  useEffect(() => {
    if (errors.ServerError || errors.email || errors.password) {
      clearErrors();
    }
  }, [watchedEmail, watchedPassword, errors, clearErrors]);

  const onSubmit = async (data) => {
      try {
          let r = await fetch(`${process.env.NEXT_PUBLIC_URL}/login`, { 
              method: 'POST', 
              credentials: "include", 
              headers: { "Content-Type": "application/json" }, 
              body: JSON.stringify(data) 
          });
          let result = await r.json();
          
          if(r.ok && result.success) {
              console.log("Login successful! Redirecting...");
              reset();
              setError('success', { message: "Login successful! Redirecting..." });
              await new Promise(resolve => setTimeout(resolve, 1000));
              window.location.href = '/dashboard'
          } else {
              
              if(result.field) {
                  setError(result.field, { 
                      message: result.message || 'Invalid input',
                      type: 'server'
                  });
              } else {
                  setError('ServerError', { 
                      message: result.message || 'Login failed'
                  });
              }

              
              if(result.attemptsRemaining !== undefined) {
                  setError('attempts', {
                      message: `${result.attemptsRemaining} login attempts remaining`
                  });
              }

              
              if(result.remainingTime) {
                  setError('ServerError', {
                      message: result.message
                  });
              }
          }
      } catch (e) {
          if(e.name === "TypeError" && e.message === "Failed to fetch") {
              console.error(e);
              setError('ServerError', { message: "Unable to connect to server. Please check your internet connection." });
          } else {
              setError('ServerError', { message: "An error occurred. Please try again later." });
          }
      }

  }

  const hasUpper = /[A-Z]/.test(watchedPassword);
  const hasLower = /[a-z]/.test(watchedPassword);
  const hasNumber = /[0-9]/.test(watchedPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(watchedPassword);

  return (
      <div className='flex items-center justify-center min-h-screen px-4 py-6 md:py-10'>
          <div className='w-full max-w-md bg-white py-4 px-4 md:px-6 rounded-xl shadow-lg'>
              {isSubmitting ? <div className='text-lg md:text-xl text-cyan-300 text-center font-bold'>logging... </div> : (errors.ServerError ? <div className='text-lg md:text-xl text-red-500 text-center font-bold'>{errors.ServerError.message}</div> : <div className='text-2xl md:text-3xl text-green-500 text-center font-bold'>Login</div>)}


              <form action="" className='' onSubmit={handleSubmit(onSubmit)}>

                  <div className = "flex flex-col text-[0.9rem] md:text-base text-bold my-3 md:my-4">
                      <label htmlFor="email" className='mb-1 font-semibold'>Email:</label>

                      <input className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-cyan-400" id = "email" type="email" placeholder="Email" {...register("email", { required: { value: true, message: "This field is required" }, pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Enter a valid Email" }, minLength: { value: 4, message: "Email should have at least 4 characters" }, maxLength: { value: 40, message: "Max Length of Email is 40" } })} />
                      {errors.email && (
                          <p className='text-xs md:text-sm text-red-600 mt-1'>
                              {errors.email.message}
                          </p>
                      )}
                  </div>

                  <div className = "flex flex-col text-[0.9rem] md:text-base text-bold my-3 md:my-4">

                      <label htmlFor="password" className='mb-1 font-semibold'>Password:</label>

                      <div className='relative'>
                          <input id = "password" className="w-full border rounded px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-cyan-400" type={showPassword ? 'text' : 'password'} placeholder="Password" {...register("password", { required: { value: true, message: "This field is required" }, pattern: { value: passwordPattern, message: "Password must include uppercase, lowercase, number and special character" }, minLength: { value: 8, message: "Password should have at least 8 characters" }, maxLength: { value: 50, message: "Max length of Password is 50" } })} />

                          <button type='button' className='absolute right-2 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-600 hover:text-gray-800' onClick={()=>setShowPassword(prev=>!prev)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                              {showPassword ? 'Hide' : 'Show'}
                          </button>
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
                      {errors.password && (
                          <p className='text-xs md:text-sm text-red-600 mt-2'>
                              {errors.password.message}
                          </p>
                      )}
                  </div>


                  <div className='space-y-2 my-4 md:my-5'>
                      {errors.success && (
                          <p className='text-xs md:text-sm text-green-600 text-center font-medium'>
                              {errors.success.message}
                          </p>
                      )}
                      {errors.ServerError && (
                          <p className='text-xs md:text-sm text-red-600 text-center font-medium bg-red-50 p-2 rounded'>
                              {errors.ServerError.message}
                          </p>
                      )}
                      {errors.attempts && (
                          <p className='text-xs md:text-sm text-orange-600 text-center font-medium'>
                              {errors.attempts.message}
                          </p>
                      )}
                  </div>

              <input disabled={isSubmitting} className="mt-3 py-1 w-full bg-cyan-500 outline-2 outline-cyan-800 rounded-3xl text-white text-[1 rem] p-1 hover:scale-105 flex justify-self-center cursor-pointer" type="submit" value="Login" />
              </form>
          </div>
      </div>
  )
}

export default Login
