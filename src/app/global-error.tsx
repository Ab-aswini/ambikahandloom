"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Boundary Caught:", error);
  }, [error]);

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <title>Something went wrong — Ambika Handloom</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased bg-[#FDFBF7] text-obsidian min-h-screen flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="w-16 h-16 bg-crimson-muted/10 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-crimson-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h1 className="font-serif text-3xl md:text-4xl tracking-tight leading-tight">
              A Thread Has Broken
            </h1>
            <p className="text-sm text-obsidian/60 leading-relaxed">
              We encountered an unexpected error while preparing your experience. Every masterpiece takes careful calibration, let us try to reset the loom.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => reset()}
              title="Reset the application and try again"
              className="magnetic-btn w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-obsidian text-cream px-8 py-3.5 text-xs tracking-[0.15em] uppercase font-medium hover:bg-indigo-deep transition-all duration-500 rounded-xl"
            >
              Reset the Loom
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
