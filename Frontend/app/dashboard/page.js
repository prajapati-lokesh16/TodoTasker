"use client"
import React, { useEffect } from 'react'
import DashNavbar from '@/components/DashNavbar'
import Task from '@/components/Task'
import { useTaskContext } from '@/context/context'
import TaskRender from '@/components/TaskRender'
import Image from 'next/image'

const Page = () => {
  const { tasks, isLoading, fetchTasks, isSelectMode, setIsSelectMode, deleteTasks, filterStatus } = useTaskContext();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks])

  
      const tasksFiltered  =
        tasks.filter(task=>{
          if(filterStatus === 'All')
          {
            return true;
          }
          if(filterStatus === 'Active')
          {
            return !task.isComplete;
          }
          if(filterStatus === 'Completed'){
            return task.isComplete;
          }
        })

  return (
    <div className='min-h-screen'>
      <DashNavbar />
      <div className='max-w-5xl mx-auto px-4 py-6'>
        <Task />
        {isLoading && <div className='py-4'>Loading tasks....</div>}
        <h2 className='text-2xl font-semibold py-2'>{tasksFiltered.length > 0 ? 'Tasks' : 'No Tasks Yet'}</h2>

        {tasksFiltered.length > 0 && (
          <div className='space-y-2 max-h-[60vh] overflow-y-auto'>
            {tasksFiltered.map(task => (
              <TaskRender key={task._id} id={task._id} title={task.name} description={task.description} status={task.isComplete} />
            ))}
          </div>
        )}

        {isSelectMode && <div className='flex justify-end gap-3 mt-4'>
          <button onClick={()=>{deleteTasks();setIsSelectMode(!isSelectMode);}} className='flex items-center bg-[#2563eb] rounded-2xl px-3 py-2 text-white hover:scale-105 hover:bg-cyan-400 cursor-pointer gap-2'><Image src="/delete.svg" width={20} height={20} alt="" className='invert'/>Delete</button>
          <button className='flex items-center bg-gray-200 rounded-2xl px-3 py-2 text-black cursor-pointer' onClick={()=>setIsSelectMode(!isSelectMode)}>Cancel</button>
        </div>}
      </div>
    </div>

  )
}

export default React.memo(Page)
