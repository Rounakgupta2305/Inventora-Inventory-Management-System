"use client"
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

function Header() {

    const path=usePathname();
    useEffect(()=>{
        console.log(path)
    },[])

  return (
    <div className='flex py-4 pl-8 pr-10 items-center justify-between bg-secondary drop-shadow-[6px_6px_13px_rgba(0,0,0,0.3)]'>
      <div className='text-[#094e6e]'>
        <h1 className="text-[26px] font-bold mb-[-4px]">Inventora</h1>
        <p className='text-[13px]'>An Inventory Management System</p>
      </div>
      <UserButton/>
    </div>
  )
}

export default Header