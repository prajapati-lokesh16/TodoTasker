import React,{useEffect, useState} from 'react'
import AddTask from './AddTask';
import Image from 'next/image';
import { useTaskContext } from '@/context/context';


const Task = () => {
    const [isOpen,setIsOpen] = useState(false);
    const {isSelectMode,setIsSelectMode,filterStatus,setFilterStatus} = useTaskContext();
    const on = '/selectOn.svg';
    const off = '/selectOff.svg';
    

  return (
    <div>
      <nav className='flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6'>
        <div className='flex gap-2 w-full md:w-auto flex-wrap items-center'>
          <button onClick={()=>setIsOpen(!isOpen)} className='flex items-center bg-[#2563eb] rounded-2xl px-3 py-2 md:px-4 md:py-2 text-white hover:scale-105 hover:bg-cyan-400 cursor-pointer transition-shadow gap-2 text-sm md:text-base whitespace-nowrap'>
            <Image src="/add.svg" width={18} height={18} alt="" className='invert'/>
            <span className='leading-none'>Add Task</span>
          </button>

          <button onClick={()=>setIsSelectMode(!isSelectMode)} className='flex items-center bg-[#2563eb] rounded-2xl px-3 py-2 md:px-4 md:py-2 text-white hover:scale-105 hover:bg-cyan-400 cursor-pointer transition-shadow gap-2 text-sm md:text-base whitespace-nowrap'>
            <Image src={ isSelectMode ? on : off} width={18} height={18} alt="" className='invert'/>
            <span className='leading-none'>Select Task</span>
          </button>
        </div>

        <div className='flex items-center bg-white rounded-2xl px-3 py-2 text-black gap-2 w-full md:w-auto justify-between md:justify-start'>
          <Image src="/filter.svg" width={16} height={16} alt=""/>
          <div className='flex gap-2'>
            <button className={`rounded-2xl px-2 text-sm ${(filterStatus === 'All') ? 'bg-cyan-100' :'hover:bg-cyan-50'} `} onClick={()=>{setFilterStatus('All')}}>All</button>
            <button className={`rounded-2xl px-2 text-sm ${(filterStatus === 'Active') ? 'bg-cyan-100' :'hover:bg-cyan-50'} `} onClick={()=>{setFilterStatus('Active')}}>Active</button>
            <button className={`rounded-2xl px-2 text-sm ${(filterStatus === 'Completed') ? 'bg-cyan-100' :'hover:bg-cyan-50'} `} onClick={()=>{setFilterStatus('Completed')}}>Completed</button>
          </div>
        </div>
      </nav>
      <div className='relative z-50'>
        {isOpen && <AddTask closeAddTask={()=>{setIsOpen(!isOpen)}}/>}
      </div>
    </div>
  )
}

export default React.memo(Task)
