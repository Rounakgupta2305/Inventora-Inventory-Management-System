import { SignUp } from "@clerk/nextjs";
import Image from 'next/image';
import TransitionProvider from '@/components/transitionProvider';

export default function Page() {
  return (
    <TransitionProvider>
      <div className="flex flex-col sm:flex-row min-h-screen bg-gray-100">
        <div className="relative sm:w-1/2 sm:h-screen hidden sm:block">
          <Image
            src="/logo.jpg"
            alt="Image"
            fill
            style={{ objectFit: 'cover' }}
            className="absolute drop-shadow-[10px_10px_30px_rgba(0,0,0,0.7)]" // Custom drop shadow
          />
        </div>
        <div className="flex items-center justify-center sm:w-1/2 h-screen bg-gradient-to-r from-gray-200 to-[#a3c7d8]">
          <SignUp className="drop-shadow-2xl" />
        </div>
      </div>
    </TransitionProvider>
  );
}
