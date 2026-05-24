export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div className="space-y-4 w-full">
          <div className="h-12 md:h-16 w-48 md:w-64 bg-white/5 rounded-2xl animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-full md:w-3/4 bg-white/5 rounded-lg animate-pulse" />
            <div className="h-4 w-2/3 bg-white/5 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>

      <div className="space-y-16">
        {/* Form Skeleton */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-1">
            <div className="w-1.5 h-6 bg-primary/20 rounded-full"></div>
            <div className="h-4 w-32 bg-white/5 rounded-lg animate-pulse" />
          </div>
          <div className="w-full lg:max-w-4xl p-8 rounded-4xl bg-surface/30 border border-white/10 space-y-8 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-20 bg-white/5 rounded-md" />
                  <div className="h-14 w-full bg-white/5 rounded-2xl" />
                </div>
              ))}
            </div>
            <div className="h-14 w-full bg-primary/10 rounded-xl" />
          </div>
        </section>

        {/* List Skeleton */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-1">
            <div className="w-1.5 h-6 bg-primary/20 rounded-full"></div>
            <div className="h-4 w-48 bg-white/5 rounded-lg animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="p-8 rounded-4xl bg-surface/30 border border-white/5 animate-pulse space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 w-12 h-12 rounded-2xl bg-white/5" />
                  <div className="w-20 h-6 rounded-full bg-white/5" />
                </div>

                <div className="space-y-2">
                  <div className="h-7 w-3/4 bg-white/10 rounded-lg" />
                  <div className="h-4 w-1/2 bg-white/5 rounded-lg" />
                </div>

                <div className="pt-4 border-t border-white/5 space-y-3">
                  <div className="h-3 w-1/4 bg-white/5 rounded-lg" />
                  <div className="h-8 w-2/3 bg-white/10 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
