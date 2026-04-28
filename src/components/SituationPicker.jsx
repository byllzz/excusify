import { situations } from '../data/situations'

export default function SituationPicker({ active, onChange, isDark }) {
  return (
    <div>
      <p className={`text-xs font-mono font-semibold uppercase tracking-widest mb-3
        ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
        // situation
      </p>
      <div className="flex flex-wrap gap-2">
        {situations.map((item) => (
          <button
            key={item.id}
            onClick={() => onChange(item.label)}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-mono
              border transition-all duration-150 cursor-pointer
              ${active === item.label
                ? 'border-emerald-400 bg-emerald-400/10 text-emerald-400'
                : isDark
                  ? 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
                  : 'border-zinc-300 bg-white text-zinc-500 hover:border-zinc-400 hover:text-zinc-700'
              }
            `}
          >
            <span className="text-xs">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}
