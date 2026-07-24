import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* 
        Left Side - Image/Visual Container 
        Hidden on mobile (< 1024px), takes up 50% width on large screens.
      */}
      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-red-50 lg:flex">
        {/* Placeholder container for your future image */}
        <div className="absolute inset-0 z-0 bg-grey-100">
          {/* 
            When you add your image, use this pattern so it perfectly fills the space without overflowing:
            <img src={YourImage} alt="Auth Background" className="h-full w-full object-cover" /> 
          */}
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-sm font-semibold tracking-widest text-grey-300 uppercase">
              Illustration Placeholder
            </span>
          </div>
        </div>

        {/* Optional: You can place text or a semi-transparent overlay over your image here */}
        <div className="relative z-10 flex max-w-md flex-col p-8 text-center text-white">
           {/* Add marketing text similar to the MongoDB example here if desired */}
        </div>
      </div>

      {/* 
        Right Side - Form Container
        Takes 100% width on mobile, 50% on desktop.
      */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16 xl:px-24">
        {/* max-w-sm ensures the form doesn't stretch too wide on ultra-wide screens */}
        <div className="mx-auto w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  );
};