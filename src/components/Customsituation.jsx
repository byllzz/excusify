import { useState } from 'react'

export default function CustomSituation({ isDark, onExcuse }) {
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const wrap     = isDark ? 'border-zinc-800 bg-zinc-900/40'    : 'border-zinc-200 bg-zinc-50'
  const label    = isDark ? 'text-zinc-400'                     : 'text-zinc-500'
  const inputCl  = isDark
    ? 'bg-zinc-900 border-zinc-700 text-zinc-100 placeholder-zinc-600 focus:border-emerald-500 focus:ring-emerald-500/20'
    : 'bg-white border-zinc-300 text-zinc-800 placeholder-zinc-400 focus:border-emerald-500 focus:ring-emerald-500/20'
  const errCl    = isDark ? 'text-red-400' : 'text-red-500'

  async function handleGenerate() {
    const trimmed = input.trim()
    if (!trimmed) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are Excusify, a developer excuse generator.
Given a custom situation a developer is in, generate ONE single believable, professional-sounding excuse they can use at work.
The excuse should sound technical and plausible.
Respond with ONLY the excuse text — no quotes, no preamble, no explanation. Just the excuse sentence(s).`,
          messages: [{ role: 'user', content: `Situation: ${trimmed}` }],
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data?.error?.message || 'API error')

      const text = data.content?.find(b => b.type === 'text')?.text?.trim()
      if (!text) throw new Error('No response from API')

      onExcuse({ excuse: text, situation: trimmed, tone: 'ai-generated', isCustom: true })
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleGenerate()
    }
  }

  return (
    <div className={`w-full border rounded-xl p-4 transition-colors duration-300 ${wrap}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs font-mono font-semibold ${label}`}>
          ✦ custom situation
        </span>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-violet-500/30 bg-violet-500/10 text-violet-400">
          ai-powered
        </span>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="e.g. why my PR is 3k lines long..."
          className={`
            flex-1 text-sm font-mono px-3 py-2 rounded-lg border outline-none
            focus:ring-2 transition-all
            ${inputCl}
          `}
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !input.trim()}
          className={`
            text-sm font-mono px-4 py-2 rounded-lg border transition-all cursor-pointer
            ${loading || !input.trim()
              ? 'border-zinc-700 text-zinc-600 cursor-not-allowed'
              : 'bg-violet-500 hover:bg-violet-400 border-violet-500 text-white active:scale-[0.98]'
            }
          `}
        >
          {loading ? '...' : 'generate'}
        </button>
      </div>

      {error && (
        <p className={`text-xs font-mono mt-2 ${errCl}`}>✗ {error}</p>
      )}
    </div>
  )
}
