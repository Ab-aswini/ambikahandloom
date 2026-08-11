"use client";

export default function DiscoverLoading() {
  return (
    <>
      {/* Hero Skeleton */}
      <section className="relative pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-warm-100 to-cream" />
        <div className="relative max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-48 bg-warm-200 rounded" />
            <div className="h-14 w-80 bg-warm-200 rounded" />
            <div className="h-14 w-64 bg-warm-200 rounded" />
            <div className="h-5 w-96 bg-warm-200 rounded mt-4" />
          </div>
        </div>
      </section>

      {/* Quiz Skeleton */}
      <section className="pb-20 md:pb-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="bg-warm-100/50 border border-warm-200 rounded-3xl p-6 md:p-10 lg:p-12 animate-pulse">
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-warm-200" />
                  <div className="h-3 w-12 bg-warm-200 rounded hidden sm:block" />
                </div>
              ))}
            </div>
            <div className="h-1 bg-warm-200 rounded-full mb-10" />
            <div className="h-8 w-72 bg-warm-200 rounded mb-2" />
            <div className="h-4 w-96 bg-warm-200 rounded mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-36 rounded-2xl bg-warm-200"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
