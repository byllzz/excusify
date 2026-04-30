import { useEffect } from "react";
export default function AboutTab({ isDark, totalCount, onClose }) {
    useEffect(() => {
      if(!onClose) return;
      function handleKey(e) {
        if(e.key === 'Escape') onClose();
      }
      window.addEventListener('keydown', handleKey);
      return () => window.removeEventListener('keydown', handleKey);
    })
  return (
    <div>
      <div className="mb-5">
        <p
          className={`text-xl font-mono font-bold tracking-tight mb-1 ${isDark ? 'text-white' : 'text-zinc-900'}`}
        >
          excusify
        </p>
        <p className={`text-xs font-mono ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
          // because "i don't know" isn't always professional enough
        </p>
      </div>

      <p
        className={`text-[10px] font-mono font-semibold uppercase tracking-widest mb-3
      ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}
        isDark={isDark}
        isDark={isDark}
      >
        info
      </p>
      <div
        className={`rounded-xl border divide-y mb-5
      ${isDark ? 'border-zinc-800 divide-zinc-800 bg-zinc-800/30' : 'border-zinc-200 divide-zinc-100 bg-zinc-50'}`}
        isDark={isDark}
      >
        <StatRow label="version" value="0.0.1" isDark={isDark} />
        <StatRow label="status" value="complete" isDark={isDark} accent="text-emerald-500" />
        <StatRow label="situations" value="6" isDark={isDark} />
        <StatRow label="tones" value="4" isDark={isDark} />
        <StatRow label="excuses" value="72 built-in" isDark={isDark} />
        <StatRow label="deployed on" value="Vercel" isDark={isDark} />
        <StatRow label="license" value="MIT" isDark={isDark} />
        <StatRow
          label="all-time generated"
          value={totalCount?.toLocaleString() ?? '0'}
          isDark={isDark}
        />
      </div>

      <p
        className={`text-[10px] font-mono font-semibold uppercase tracking-widest mb-3
      ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}
        isDark={isDark}
        isDark={isDark}
      >
        author
      </p>
      <div
        className={`rounded-xl border divide-y mb-5
      ${isDark ? 'border-zinc-800 divide-zinc-800 bg-zinc-800/30' : 'border-zinc-200 divide-zinc-100 bg-zinc-50'}`}
        isDark={isDark}
      >
        <StatRow label="built by" value="Bilal Malik" isDark={isDark} />
        <StatRow label="github" value="@byllzz" isDark={isDark} accent="text-emerald-500" />
        <StatRow label="email" value="bilalmlkdev@gmail.com" isDark={isDark} accent="text-emerald-500" />

      </div>
    </div>
  );
}


function StatRow({ label, value, isDark, accent }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <span className={`text-xs font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{label}</span>
      <span className={`text-xs font-mono font-medium ${accent || (isDark ? 'text-zinc-200' : 'text-zinc-700')}`}>{value}</span>
    </div>
  )
}
