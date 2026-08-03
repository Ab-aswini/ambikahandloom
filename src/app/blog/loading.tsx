export default function BlogLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-warm-100 to-cream" />
        <div className="relative max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="h-3 w-20 bg-warm-200 rounded animate-pulse mb-4" />
          <div className="h-14 w-96 bg-warm-200 rounded animate-pulse mb-4" />
          <div className="h-5 w-80 bg-warm-100 rounded animate-pulse" />
        </div>
      </section>

      {/* Blog grid skeleton */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16">
        <div className="flex gap-3 mb-12">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-20 bg-warm-200 rounded-full animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[16/10] bg-warm-200 rounded-2xl animate-pulse" />
              <div className="h-3 w-16 bg-warm-200 rounded animate-pulse" />
              <div className="h-5 w-full bg-warm-200 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-warm-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
