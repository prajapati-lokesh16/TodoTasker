"use client"
import React, { useEffect, useState, useMemo,useCallback} from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import ChangePassword from './ChangePassword'
import ChangeProfile from './ChangeProfile'

const Profile = ({ userData, isLoading, profileMenu, isOpen, close,ProfileLogout }) => {
    const [isSettingOpen,setIsSettingOpen] = useState(false);
    const [isOpenPassword,setIsOpenPassword]= useState(false);
    const [isOpenProfileChange,setIsOpenProfileChange] = useState(false);
    const router = useRouter();

    const handleLogout = useCallback(async () => {
        try {
            let r = await fetch(`${process.env.NEXT_PUBLIC_URL}/logout`, { 
                method: "POST", 
                credentials: "include", 
                headers: { "Content-Type": "application/json" } 
            });
            let x = await r.json();
            if(r.ok && x.success) {
                ProfileLogout();
                console.log("You are successfully logged out");
                window.location.href = '/';
                return null;
            }
            if(!r.ok){
                throw new Error('Failed to logout.')
            }
        } catch (error) {
            console.log("error:", error);
            alert("Logout failed. Please try again.");
        }
    }, [ProfileLogout]);

    return (
        <div className="relative">
            {(isLoading && !userData) ? <div>Loading the profile:</div> : <div></div>}
            {userData ? <div className={`z-50 ${isOpen ? 'sideAnimation' : 'hideAnimation'} bg-[#dfefff] border border-zinc-300 gap-2 px-3 py-2 shadow-md fixed md:absolute md:top-3 md:right-0 md:rounded-xl w-full md:w-64 h-full md:h-auto top-0 right-0 rounded-none`}>
                <div className='flex justify-between items-center mb-2 md:mb-0'>
                    <div className='text-xs text-left truncate w-3/4'>{userData.email}</div>
                    <button className='ml-2 text-[14px] p-1 rounded-md' onClick={close} aria-label="Close profile"><Image src="/close.svg" width={20} height={20} alt="x" className='cursor-pointer '/></button>
                </div>
                <div className='flex flex-col items-center mb-4 md:mb-2'>
                    <div className='w-12 h-12 text-2xl rounded-full bg-blue-400 text-white flex items-center justify-center'>{userData.firstLetter}</div>
                    <div className='w-full text-[16px] truncate text-center mt-2'>Hi, {userData.fullname}!</div>
                </div>
                <div className='my-1 flex flex-col w-full'>
                    <button onClick={()=>setIsSettingOpen(!isSettingOpen)} className='h-10 w-full text-[14px] text-left px-3 border-b border-[#dfefff] bg-white flex items-center gap-3 hover:bg-[#cce3fb] cursor-pointer rounded-t-xl justify-between'>
                       <span className='flex gap-3'> <Image src="/setting.svg" width={18} height={18} alt="" /><span className='truncate'>Settings</span></span> {isSettingOpen ? <Image src="/arrowDown.svg" width={18} height={18} alt=""  className='justify-self-end'/> : <Image src="/arrowUp.svg" width={18} height={18} alt="" className='justify-self-end' />}</button>

                        {isSettingOpen && <div>
                        <button onClick={()=>setIsOpenProfileChange(!isOpenProfileChange)} className='h-10 w-full text-[14px] text-left px-3 border-b border-[#dfefff] bg-white flex items-center gap-3 hover:bg-[#cce3fb] cursor-pointer justify-start'>
                        <Image src="/profile.svg" width={18} height={18} alt="" /><span className='truncate'>Change Profile Name</span></button>
                        <button onClick={()=>setIsOpenPassword(!isOpenPassword)} className='h-10 w-full text-[14px] text-left px-3 border-b border-[#dfefff] bg-white flex items-center gap-3 hover:bg-[#cce3fb] cursor-pointer justify-start'>
                        <Image src="/password.svg" width={18} height={18} alt="" /><span className='truncate'>Change Password</span></button>
                        </div>}

                    <button className='h-10 w-full text-[14px] px-3 text-left bg-white flex items-center gap-3 hover:bg-[#cce3fb] cursor-pointer justify-start rounded-b-xl' onClick = {handleLogout}>
                        <Image src="/logout2.svg" width={18} height={18} alt="" /><span className='truncate'>Logout</span>
                    </button>
                </div>
            </div>

                : <div></div>}
                {isOpenPassword && <ChangePassword close={()=>setIsOpenPassword(!isOpenPassword)}/>}
                {isOpenProfileChange && <ChangeProfile close={()=>setIsOpenProfileChange(!isOpenProfileChange)}/>}
        </div>
    )
}

export default React.memo(Profile);
