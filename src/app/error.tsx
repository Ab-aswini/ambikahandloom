"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Sub-Route Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-obsidian bg-[#FDFBF7] pt-24 md:pt-32">
      <div className="max-w-md mx-auto text-center space-y-8">
        <div className="w-16 h-16 bg-crimson-muted/10 rounded-full flex items-center justify-center mx-auto animate-pulse-soft">
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

        <div className="space-y-3">
          <h1 className="font-serif text-3xl md:text-4xl tracking-tight leading-tight">
            Weaving Interrupted
          </h1>
          <p className="text-sm text-obsidian/60 leading-relaxed max-w-sm mx-auto">
            A minor error occurred while rendering this section. Our master weavers are on it! Try reloading or head back to home.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => reset()}
            title="Reload the section"
            className="magnetic-btn w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-obsidian text-cream px-8 py-3.5 text-xs tracking-[0.15em] uppercase font-medium hover:bg-indigo-deep transition-all duration-500 rounded-xl"
          >
            <RefreshCw size={14} className="animate-spin-slow" />
            Try Again
          </button>
          
          <Link
            href="/"
            title="Return to Homepage"
            className="magnetic-btn w-full sm:w-auto inline-flex items-center justify-center gap-3 border border-obsidian/20 text-obsidian px-8 py-3.5 text-xs tracking-[0.15em] uppercase font-medium hover:bg-obsidian hover:text-cream transition-all duration-500 rounded-xl"
          >
            <Home size={14} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
