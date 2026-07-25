import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  /** The large headline text on the dark red background */
  heading?: string;
  /** The smaller paragraph text below the headline */
  description?: string;
}

export const AuthLayout = ({
  children,
  heading = "Streamline your CampusDesk operations",
  description = "Connect with facility managers, utilize AI-driven routing, and track real-time issue updates. Report and resolve campus maintenance efficiently for a new generation of students.",
}: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* 
        Left Side - Visual Container
        Hidden on mobile, takes 50% width on desktop. Uses a very dark red base.
      */}
      <div className="relative hidden w-1/2 flex-col overflow-hidden bg-[#4a0400] lg:flex">
        {/* Custom SVG Wave & Gradient - Mimics the MongoDB curve */}
        <div className="absolute inset-0 z-0">
          <svg
            className="absolute -right-24 -bottom-24 h-full w-[150%] object-cover opacity-90"
            viewBox="0 0 800 800"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="redGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="var(--color-red-400)" />
                <stop offset="100%" stopColor="var(--color-red-500)" />
              </linearGradient>
            </defs>
            <path
              fill="url(#redGradient)"
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45,.39,75.38,16.6,146.7,51.84,203.22,106.18,52.26,50.24,84,119.86,97.77,192.34,14.61,77,7.1,157.06-19.16,230.15-27.18,75.64-77,141.77-142.3,188.75-68.5,49.27-152.12,71.74-236,73.55-84.34,1.82-169.17-18-243.68-56.12-70.36-36-129.54-91.82-165.73-162.77-35.34-69.29-45.71-150-32-225.56,12.83-70.57,47.88-135.53,99.16-184.23C237,130,282.8,92.51,321.39,56.44Z"
            />
          </svg>
        </div>

        {/* Abstract Background Icon 1: Map Pin with Wrench */}
        <div className="absolute top-24 right-12 z-0 opacity-15">
          <svg
            width="280"
            height="280"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-red-100)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <path d="M14.7 9.3a4 4 0 0 1-5.66 0L8 8.24a1.41 1.41 0 0 0-2 0 1.41 1.41 0 0 0 0 2l1.06 1.04a4 4 0 0 1 0 5.66"></path>
            <path d="M12.7 11.3 9 15"></path>
          </svg>
        </div>

        {/* Abstract Background Icon 2: Settings/Gear */}
        <div className="absolute right-32 -bottom-16 z-0 opacity-10">
          <svg
            width="320"
            height="320"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-red-200)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </div>

        {/* Text Overlay - Now completely dynamic based on props */}
        <div className="relative z-10 flex h-full flex-col justify-center px-12 text-white xl:px-20">
          <h1 className="mb-6 max-w-lg text-4xl leading-tight font-bold md:text-5xl">
            {heading}
          </h1>

          <p className="mb-10 max-w-md text-base leading-relaxed text-red-100/90">
            {description}
          </p>
        </div>
      </div>

      {/* Right Side - Form Container */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
};
