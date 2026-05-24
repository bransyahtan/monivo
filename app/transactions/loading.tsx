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

      <div className="grid grid-cols-1 gap-16 px-4 md:px-0">
        {/* Form Skeleton */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-1">
            <div className="w-1.5 h-6 bg-primary/20 rounded-full"></div>
            <div className="h-4 w-32 bg-white/5 rounded-lg animate-pulse" />
          </div>
          <div className="w-full lg:max-w-4xl p-8 rounded-4xl bg-surface/30 border border-white/5 space-y-6 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="h-3 w-16 bg-white/5 rounded-md" />
                <div className="h-12 w-full bg-white/5 rounded-xl md:rounded-2xl" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-16 bg-white/5 rounded-md" />
                <div className="h-12 w-full bg-white/5 rounded-xl md:rounded-2xl" />
              </div>
            </div>
            <div className="h-12 w-full bg-primary/10 rounded-xl md:rounded-2xl" />
          </div>
        </section>

        {/* List Skeleton */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-1">
            <div className="w-1.5 h-6 bg-primary/20 rounded-full"></div>
            <div className="h-4 w-48 bg-white/5 rounded-lg animate-pulse" />
          </div>

          <div className="p-8 rounded-4xl bg-surface/30 border border-white/5 animate-pulse space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="space-y-2">
                <div className="h-6 w-48 bg-white/10 rounded-lg" />
                <div className="h-4 w-64 bg-white/5 rounded-lg" />
              </div>
            </div>

            <div className="space-y-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 py-2 opacity-40"
                >
                  <div className="w-2 h-10 bg-white/10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/2 bg-white/10 rounded-lg" />
                    <div className="h-3 w-1/4 bg-white/5 rounded-lg" />
                  </div>
                  <div className="w-24 h-6 bg-white/10 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
