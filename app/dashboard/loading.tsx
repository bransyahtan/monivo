export default function Loading() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div className="space-y-4">
          <div className="h-12 w-64 bg-white/5 rounded-2xl animate-pulse" />
          <div className="h-4 w-96 bg-white/5 rounded-lg animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-8 rounded-4xl bg-surface/30 border border-white/5 animate-pulse space-y-4"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5" />
            <div className="space-y-2">
              <div className="h-4 w-24 bg-white/5 rounded-md" />
              <div className="h-8 w-32 bg-white/10 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 p-8 rounded-4xl bg-surface/30 border border-white/5 h-[400px] animate-pulse" />
        <div className="lg:col-span-4 p-8 rounded-4xl bg-surface/30 border border-white/5 h-[400px] animate-pulse" />
      </div>

      <div className="p-8 rounded-4xl bg-surface/30 border border-white/5 h-[600px] animate-pulse" />
    </div>
  );
}
