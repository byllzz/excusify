import { tones } from '../data/tones'

export default function TonePicker({ active, onChange, isDark }) {
  const toneColors = {
    professional: active === 'professional' ? 'border-sky-400 bg-sky-400/10 text-sky-400'         : '',
    chaotic:      active === 'chaotic'      ? 'border-orange-400 bg-orange-400/10 text-orange-400' : '',
    desperate:    active === 'desperate'    ? 'border-red-400 bg-red-400/10 text-red-400'          : '',
    corporate:    active === 'corporate'    ? 'border-violet-400 bg-violet-400/10 text-violet-400' : '',
  }

  const inactiveClass = isDark
    ? 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
    : 'border-zinc-300 bg-white text-zinc-500 hover:border-zinc-400 hover:text-zinc-700'

  return (
    <div>
      <p className={`text-xs font-mono font-semibold uppercase tracking-widest mb-3
        ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
        // tone
      </p>
      <div className="flex flex-wrap gap-2">
        {tones.map((tone) => (
          <button
            key={tone.id}
            onClick={() => onChange(tone.id)}
            className={`
              px-4 py-1.5 rounded-full text-sm font-mono border transition-all duration-150 cursor-pointer
              ${toneColors[tone.id] || inactiveClass}
            `}
          >
            {tone.label}
          </button>
        ))}
      </div>
    </div>
  )
}
