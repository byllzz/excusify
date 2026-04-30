export default function StatsCard({ count, totalCount, isDark }) {
  return (
    <div
      className={`p-6 rounded-2xl border ${isDark ? 'border-zinc-800 bg-zinc-800/50' : 'border-zinc-200 bg-zinc-50'}`}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span
            className={`text-sm font-mono uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}
          >
            Session
          </span>
          <span
            className={`text-2xl font-mono font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}
          >
            {count}
          </span>
        </div>
        <div className="w-full h-1 bg-zinc-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((count / 100) * 100, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-mono uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}
          >
            Lifetime
          </span>
          <span
            className={`text-lg font-mono font-semibold ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}
          >
            {totalCount.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
