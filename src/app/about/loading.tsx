export default function AboutLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-warm-100 to-cream" />
        <div className="relative max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="h-3 w-20 bg-warm-200 rounded animate-pulse mb-4" />
          <div className="h-16 w-80 bg-warm-200 rounded animate-pulse mb-4" />
          <div className="h-5 w-full max-w-xl bg-warm-100 rounded animate-pulse" />
        </div>
      </section>

      {/* Content skeleton */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-4">
            <div className="h-6 w-48 bg-warm-200 rounded animate-pulse" />
            <div className="h-4 w-full bg-warm-100 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-warm-100 rounded animate-pulse" />
            <div className="h-4 w-4/6 bg-warm-100 rounded animate-pulse" />
          </div>
          <div className="aspect-[4/3] bg-warm-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
