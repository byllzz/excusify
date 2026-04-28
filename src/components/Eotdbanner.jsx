import { useMemo } from 'react'
import { excuses } from '../data/excuses'

// ── seeded random (mulberry32) ────────────────────────────────────────────────
function seededRandom(seed) {
  let t = seed + 0x6D2B79F5
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

function getTodaySeed() {
  const d = new Date()
  // seed = YYYYMMDD as integer
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
}

function getEotd() {
  const seed   = getTodaySeed()
  const sitKeys  = Object.keys(excuses)
  const sitIndex = Math.floor(seededRandom(seed)       * sitKeys.length)
  const sit      = sitKeys[sitIndex]

  const toneKeys  = Object.keys(excuses[sit])
  const toneIndex = Math.floor(seededRandom(seed + 1)  * toneKeys.length)
  const tone      = toneKeys[toneIndex]

  const pool       = excuses[sit][tone]
  const excuseIndex = Math.floor(seededRandom(seed + 2) * pool.length)

  return { excuse: pool[excuseIndex], situation: sit, tone }
}

export default function EotdBanner({ isDark, onUse }) {
  const eotd = useMemo(() => getEotd(), [])

  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  const wrap  = isDark ? 'border-zinc-800 bg-zinc-900/40'   : 'border-zinc-200 bg-zinc-50'
  const label = isDark ? 'text-yellow-400'                  : 'text-yellow-600'
  const meta  = isDark ? 'text-zinc-600'                    : 'text-zinc-400'
  const text  = isDark ? 'text-zinc-300'                    : 'text-zinc-600'
  const badge = isDark ? 'border-zinc-700 text-zinc-500'    : 'border-zinc-300 text-zinc-400'
  const btn   = isDark
    ? 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
    : 'border-zinc-300 text-zinc-500 hover:border-zinc-400 hover:text-zinc-700'

  return (
    <div className={`w-full max-w-xl border rounded-xl p-4 mb-6 transition-colors duration-300 ${wrap}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono font-semibold ${label}`}>✦ excuse of the day</span>
          <span className={`text-[10px] font-mono ${meta}`}>{today}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${badge}`}>
            {eotd.situation}
          </span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${badge}`}>
            {eotd.tone}
          </span>
        </div>
      </div>

      <p className={`font-mono text-sm leading-relaxed mb-3 ${text}`}>
        <span className="text-emerald-400 mr-2">$</span>
        {eotd.excuse}
      </p>

      <button
        onClick={() => onUse(eotd)}
        className={`text-xs font-mono px-3 py-1 rounded-md border transition-all cursor-pointer ${btn}`}
      >
        use this excuse ↗
      </button>
    </div>
  )
}
