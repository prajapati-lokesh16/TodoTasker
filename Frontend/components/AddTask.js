"use client"
import React, { useContext, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { useTaskContext } from '@/context/context';
import { useRouter } from 'next/navigation';

const AddTask = ({closeAddTask}) => {
    const router = useRouter();
    const { addTasks } = useTaskContext();
    const {
        register,
        handleSubmit,
        watch,
        setError,
        clearErrors,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    const watchedTaskName = watch('taskName') || '';
    const watchedTaskDesc = watch('taskDesc') || '';

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            clearErrors();
        }
    }, [watchedTaskName, watchedTaskDesc, errors, clearErrors]);

    const onSubmit = useCallback(async (data) => {

        const r = await addTasks(data);
        if (r) {
            reset();
            closeAddTask();
        }
        else {
            setError('ServerError', { message: "Adding task failed" });
        }
    }, [addTasks, closeAddTask, setError, reset]);

return (
    <div className='fixed inset-0 w-full h-full backdrop-blur-sm flex items-start md:items-center justify-center p-4 z-50'>

        <div className='w-full max-w-md bg-white my-10 md:my-0 py-4 px-4 md:px-6 rounded-xl shadow-lg'>
            {isSubmitting ? <div className='text-lg md:text-xl text-cyan-300 text-center font-bold'>Adding task... </div> : (errors.ServerError ? <div className='text-lg md:text-xl text-red-500 text-center font-bold'>{errors.ServerError.message}</div> : <div className='text-2xl md:text-3xl text-green-500 text-center font-bold'>Add Task</div>)}


            <form action="" className='' onSubmit={handleSubmit(onSubmit)}>

                <div className="flex flex-col text-[0.9rem] md:text-base text-bold my-3 md:my-4">
                    <label htmlFor="taskName" className='mb-1 font-semibold'>Task name:</label>

                    <input className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-cyan-400" id="taskName" type="text" placeholder="Task name" {...register("taskName", { required: { value: true, message: "This field is required" }, minLength: { value: 1, message: "Task Name should have at least 1 characters" }, maxLength: { value: 40, message: "Max Length of Task Name is 40" } })} />
                    {errors.taskName && <p className='text-xs md:text-sm text-red-600 mt-1'>{errors.taskName.message}</p>}
                </div>

                <div className="flex flex-col text-[0.9rem] md:text-base text-bold my-3 md:my-4">

                    <label htmlFor="taskDesc" className='mb-1 font-semibold'>Description:</label>

                    <input id="taskDesc" className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-cyan-400" type="text" placeholder="Description" {...register("taskDesc", { required: { value: true, message: "This field is required" }, minLength: { value: 4, message: "Description should have at least 4 characters" }, maxLength: { value: 50, message: "Max length of Description is 50" } })} />
                    {errors.taskDesc && <p className='text-xs md:text-sm text-red-600 mt-1'>{errors.taskDesc.message}</p>}
                </div>


                <div className='flex gap-3 mt-4 md:mt-5'>
                    <input disabled={isSubmitting} className="flex-1 py-2 bg-cyan-500 rounded-3xl text-white text-sm md:text-base font-semibold hover:scale-105 cursor-pointer transition-transform" type="submit" value="Add task" />
                    <button disabled={isSubmitting} type="button" onClick={closeAddTask} className="flex-1 py-2 bg-gray-400 rounded-3xl text-white text-sm md:text-base font-semibold hover:scale-105 cursor-pointer transition-transform">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
)
}

export default React.memo(AddTask);