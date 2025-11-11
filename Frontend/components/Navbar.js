import React from 'react'
import Link from 'next/link'

const Navbar = () => {
    return (
        <header className='bg-zinc-950 text-white px-4 md:px-10 py-3'>
            <div className='max-w-6xl mx-auto flex items-center justify-between'>
                <div className='text-lg md:text-2xl flex items-center gap-2'>
                    <span className='text-green-500'>&lt;</span>
                    <span>Todo</span>
                    <span className='text-green-500'>Tasker/&gt;</span>
                </div>

                <nav className='flex items-center gap-3'>
                    <Link className='bg-green-500 rounded-full px-3 py-1 text-sm md:text-base text-zinc-900 hover:font-bold' href='/signup'>Signup</Link>
                    <Link className='bg-green-500 rounded-full px-3 py-1 text-sm md:text-base text-zinc-900 hover:font-bold' href='/login'>Login</Link>
                </nav>
            </div>
        </header>
    )
}

export default Navbar
