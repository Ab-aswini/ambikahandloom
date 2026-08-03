export default function CatalogLoading() {
  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Section tabs skeleton */}
        <div className="mb-10">
          <div className="h-3 w-24 bg-warm-200 rounded mb-4 animate-pulse" />
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 w-28 bg-warm-200 rounded-full animate-pulse" />
            ))}
          </div>
          <div className="h-14 w-64 bg-warm-200 rounded animate-pulse mb-3" />
          <div className="h-4 w-96 bg-warm-100 rounded animate-pulse" />
        </div>

        {/* Filter pills skeleton */}
        <div className="flex gap-2 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-24 bg-warm-200 rounded-full animate-pulse" />
          ))}
        </div>

        {/* Product grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[3/4] bg-warm-200 rounded-2xl animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 w-20 bg-warm-200 rounded animate-pulse" />
                <div className="h-5 w-48 bg-warm-200 rounded animate-pulse" />
                <div className="h-4 w-24 bg-warm-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
