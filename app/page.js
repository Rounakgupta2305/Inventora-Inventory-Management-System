import Image from 'next/image';
import { Button } from '@mui/material'; 
import Link from 'next/link';


export default function Home() {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-t from-blue-100 to-gray-200 text-[#094e6e]">
      <div className="flex flex-col items-center">
        <div className="animate-bounce">
          <Image
            src="/home.png"
            alt="Example Image"
            width={350}
            height={350}
            style={{ objectFit: 'cover' }}
          />
        </div>
        
        <div className="mt-6 border border-black rounded-lg px-4 py-7 shadow-2xl">
          <h2 className="text-5xl font-bold">Welcome to Inventora!!</h2>
          <p className="text-xl mt-2">An Inventory Management System</p>
          <div className="flex gap-2 text-xl mt-4">
            <Link href="/dashboard">
              <button class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-[#094e6e] to-gray-400 group-hover:from-[#094e6e] group-hover:to-gray-400 hover:text-white dark:text-white focus:outline-none">
                <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-100 dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  Get Started
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
