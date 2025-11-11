'use client'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';

const SignUp = () => {
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
    const watchedPassword = watch('password') || '';
    const watchedEmail = watch('email') || '';
    const watchedFirstName = watch('firstName') || '';
    const watchedLastName = watch('lastName') || '';
    const watchedCPassword = watch('cPassword') || '';

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;
    

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            clearErrors();
        }
    }, [watchedEmail, watchedFirstName, watchedLastName, watchedPassword, watchedCPassword, errors, clearErrors]);
    
    const hasUpper = /[A-Z]/.test(watchedPassword);
    const hasLower = /[a-z]/.test(watchedPassword);
    const hasNumber = /[0-9]/.test(watchedPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(watchedPassword);

    const password = watch("password","");

    const onSubmit = async (data) => {
        try {
            let r = await fetch(`${process.env.NEXT_PUBLIC_URL}/signup`, { 
                method: 'POST', 
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify(data) 
            });
            let result = await r.json();

            if(r.ok && result.success) {
                setError('success', { 
                    message: "Account created successfully! Redirecting to login..." 
                });
                reset();
                await new Promise(resolve => setTimeout(resolve, 1500));
                window.location.href = '/login'
            } else {
                
                if(result.field) {
                    setError(result.field, { 
                        message: result.message || 'Invalid input',
                        type: 'server'
                    });
                } else {
                    setError('ServerError', { 
                        message: result.message || 'Signup failed. Please try again.'
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
        <div className='flex items-center justify-center min-h-screen px-4 py-6 md:py-10'>
            <div className='w-full max-w-md bg-white py-4 px-4 md:px-6 rounded-xl shadow-lg'>
                {isSubmitting ? <div className='text-lg md:text-xl text-cyan-300 text-center font-bold'>Form is Submitting... </div> : (errors.ServerError ? <div className='text-lg md:text-xl text-red-500 text-center font-bold'>{errors.ServerError.message}</div> : <div className='text-2xl md:text-3xl text-green-500 text-center font-bold'>Sign Up</div>)}


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


                    <div className = "flex flex-col text-[0.9rem] md:text-base text-bold my-3 md:my-4">
                        <label htmlFor="email" className='mb-1 font-semibold'>Email:</label>

                        <input className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-cyan-400" id = "email" type="text" placeholder="Email" {...register("email", { required: { value: true, message: "This field is required" }, pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Enter a valid Email" }, minLength: { value: 4, message: "Email should have at least 4 characters" }, maxLength: { value: 40, message: "Max Length of Email is 40" } })} />
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

                    <div className = "flex flex-col text-[0.9rem] md:text-base text-bold my-3 md:my-4">
                        <label htmlFor="cPassword" className='mb-1 font-semibold'>Confirm Password:</label>

                        <div className='relative'>
                            <input id = "cPassword" className="w-full border rounded px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-cyan-400" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" {...register("cPassword", { required: { value: true, message: "This field is required" }, minLength: { value: 8, message: "Password should have at least 8 characters" }, maxLength: { value: 50, message: "Max Length of Password is 50 characters" }, validate:(value)=> value === watchedPassword || "Password does not match" })} />

                            <button type='button' className='absolute right-2 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-600 hover:text-gray-800' onClick={()=>setShowConfirmPassword(prev=>!prev)} aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
                                {showConfirmPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        {errors.cPassword && (
                            <p className='text-xs md:text-sm text-red-600 mt-1'>
                                {errors.cPassword.message}
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

                    <input disabled={isSubmitting} className="mt-3 py-2 w-full bg-cyan-500 outline-2 outline-cyan-800 rounded-3xl text-white text-sm md:text-base p-2 hover:scale-105 flex justify-self-center cursor-pointer font-semibold transition-transform" type="submit" value="Sign UP" />
                </form>
            </div>
        </div>
    )

}

export default SignUp
