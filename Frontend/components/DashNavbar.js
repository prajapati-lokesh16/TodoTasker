import React,{useEffect,useState} from 'react'
import Image from 'next/image'
import { useTaskContext } from '@/context/context'
import Profile from './Profile'


const DashNavbar = () => {

    const { profile, fetchProfile, isLoadingProfile,setProfile } = useTaskContext();
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile])

    const [profileMenu,setProfileMenu] = useState(false);
        const [isMenuOpen, setIsMenuOpen] = useState(false);
    
        useEffect(() => {
            if (isMenuOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'unset';
            }
            return () => {
                document.body.style.overflow = 'unset';
            };
        }, [isMenuOpen]);
    
        const profileData = {
        fullname:profile ? `${profile.firstname} ${profile.lastname}`: 'Guest',
        firstLetter:profile ? profile.firstname?.[0]?.toUpperCase(): 'G',
        email:profile ? profile.email:'Guest account'
    }

    const handleProfileClose = () => {
        setProfileMenu(false);
        setIsMenuOpen(false);
    }

    const handleProfileOpen = () => {
        setProfileMenu(true);
        setIsMenuOpen(true);
    }


    return (
        <nav className='bg-white text-black px-4 md:px-10 py-3 relative'>
            <div className='max-w-6xl mx-auto flex items-center justify-between'>
                <div className='text-lg md:text-2xl flex items-center gap-2'>
                    <span className='text-green-500'>&lt;</span>
                    <span>Todo</span>
                    <span className='text-green-500'>Tasker/&gt;</span>
                </div>

                <div className='relative'>
                    <button 
                        aria-label="profile" 
                        className='w-8 h-8 rounded-2xl bg-cyan-400 text-center flex items-center justify-center cursor-pointer hover:outline-2 outline-zinc-300 hover:bg-cyan-300' 
                        onClick={handleProfileOpen}
                    >
                        {profileData.firstLetter}
                    </button>
                    {profileMenu && <div className='fixed inset-0 md:fixed md:inset-auto md:right-4 md:top-16 z-40'>
                        <div className='fixed inset-0 md:hidden' onClick={handleProfileClose}></div>
                        <div className='md:absolute md:right-0 md:top-full md:mt-2 w-full md:w-auto h-full md:h-auto'>
                            <Profile userData = {profileData} isLoading = {isLoadingProfile} isOpen = {profileMenu} close={handleProfileClose} ProfileLogout={()=>{setProfile(null); handleProfileClose();}}/>
                        </div>
                    </div>}
                </div>
            </div>
        </nav>
    )
}

export default React.memo(DashNavbar);
