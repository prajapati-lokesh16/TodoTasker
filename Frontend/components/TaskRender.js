import React, { useEffect, useState,useMemo, useCallback } from 'react'
import Image from 'next/image'
import { useTaskContext } from '@/context/context';

const TaskRender = ({ id, title, description, status }) => {
    const { isSelectMode, deleteArray, setDeleteArray,ToggleTaskStatus } = useTaskContext();



    const handleChanger = useCallback((task, checked) => {
        setDeleteArray(prevIds => {
            if (checked) {
                return [...prevIds, task];
            }
            else {
                return prevIds.filter(id => id !== task);
            }
        });
    }, [setDeleteArray]);



    const isChecked = deleteArray.includes(id);
    return (
        <div className='w-full'>
            <div className='w-11/12 md:w-[60vw] max-w-3xl border-2 h-auto border-gray-300 rounded-xl flex flex-col md:flex-row gap-3 px-4 py-3 my-2 mx-auto'>
                <div className='flex-1'>
                    <div className="text-lg md:text-xl font-medium truncate">{title}</div>
                    <div className="text-sm md:text-base text-gray-600 truncate mt-1">{description}</div>
                </div>

                <div className='flex-shrink-0 flex items-center gap-3 mt-2 md:mt-0'>
                    {status ? (
                        <>
                            <Image src="/toggleon.svg" width={28} height={28} alt="" className='cursor-pointer' onClick={()=>ToggleTaskStatus(id,status)}/>
                            <div className='bg-green-500 rounded-2xl px-2 py-1 flex items-center text-white text-sm'>
                                <Image src="/completed.svg" width={20} height={20} alt="" className='cursor-default invert mr-1' />
                                <span>Completed</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <Image src="/toggleoff.svg" width={28} height={28} alt="" className='cursor-pointer' onClick={()=>ToggleTaskStatus(id,status)}/>
                            <div className='bg-orange-400 rounded-2xl px-2 py-1 flex items-center text-white text-sm'>
                                <Image src="/close.svg" width={20} height={20} alt="" className='cursor-default mr-1' />
                                <span>Pending</span>
                            </div>
                        </>
                    )}

                    {isSelectMode && <div className='flex items-center'>
                        <input type="checkbox" checked={isChecked} onChange={(e) => { handleChanger(id, e.target.checked) }} />
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default React.memo(TaskRender);
