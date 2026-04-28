import { useRef } from 'react'
import ShareCard from './ShareCard'

export default function ExcuseCard({
  excuse, situation, tone,
  onCopy, copied,
  onRate, rated,
  isFavorite, onFavorite,
  isDark,
}) {
  if (!excuse) return null

  const shareRef = useRef(null)

  const cardClass   = isDark ? 'border-zinc-700 bg-zinc-900/60 backdrop-blur' : 'border-zinc-200 bg-zinc-50'
  const divider     = isDark ? 'border-zinc-800' : 'border-zinc-200'
  const textClass   = isDark ? 'text-zinc-100'   : 'text-zinc-800'
  const inactiveBtn = isDark
    ? 'border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
    : 'border-zinc-300 text-zinc-400 hover:border-zinc-400 hover:text-zinc-600'

  // ── share as image ──────────────────────────────────────────────────────────
  async function handleShareImage() {
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(shareRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      })
      canvas.toBlob(blob => {
        if (!blob) return
        const url  = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href     = url
        link.download = 'excusify.png'
        link.click()
        URL.revokeObjectURL(url)
      })
    } catch (e) {
      console.error('Share image failed:', e)
    }
  }

  // ── slack deep link ─────────────────────────────────────────────────────────
  function handleSlackShare() {
    const text = encodeURIComponent(`*Excuse [${situation} · ${tone}]*\n${excuse}\n_via excusify.vercel.app_`)
    window.open(`slack://open?team=&channel=&message=${text}`, '_blank')
  }

  // ── whatsapp share ──────────────────────────────────────────────────────────
  function handleWhatsAppShare() {
    const text = encodeURIComponent(`*${situation}* (${tone})\n\n${excuse}\n\n_via excusify.vercel.app_`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  // ── copy as slack block ─────────────────────────────────────────────────────
  function handleCopySlack() {
    const block = `*Excuse · ${situation} · ${tone}*\n>${excuse}\n_excusify.vercel.app_`
    navigator.clipboard.writeText(block).catch(() => {})
  }

  return (
    <>
      {/* hidden card for html2canvas — always rendered off-screen */}
      <ShareCard cardRef={shareRef} excuse={excuse} situation={situation} tone={tone} />

      <div className={`border rounded-xl p-5 space-y-4 ${cardClass}`}>

        {/* excuse text + favorite */}
        <div className="flex items-start gap-3">
          <span className="text-emerald-400 font-mono text-sm mt-0.5 select-none">$</span>
          <p className={`font-mono text-sm leading-relaxed flex-1 ${textClass}`}>{excuse}</p>
          <button
            onClick={onFavorite}
            title={isFavorite ? 'unfavorite' : 'save to favorites'}
            className={`flex-shrink-0 text-base transition-all cursor-pointer mt-0.5
              ${isFavorite
                ? 'text-yellow-400'
                : isDark ? 'text-zinc-700 hover:text-yellow-400' : 'text-zinc-300 hover:text-yellow-500'
              }`}
          >
            {isFavorite ? '★' : '☆'}
          </button>
        </div>

        <div className={`border-t ${divider} pt-3 space-y-2`}>

          {/* row 1 — rate + copy */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-2">
              <button
                onClick={() => onRate('believable')}
                className={`text-xs font-mono px-3 py-1 rounded-md border transition-all cursor-pointer
                  ${rated === 'believable' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : inactiveBtn}`}
              >
                ✓ believable
              </button>
              <button
                onClick={() => onRate('obvious')}
                className={`text-xs font-mono px-3 py-1 rounded-md border transition-all cursor-pointer
                  ${rated === 'obvious' ? 'border-red-500 bg-red-500/10 text-red-400' : inactiveBtn}`}
              >
                ✗ too obvious
              </button>
            </div>
            <button
              onClick={onCopy}
              className={`text-xs font-mono px-3 py-1 rounded-md border transition-all cursor-pointer
                ${copied ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : inactiveBtn}`}
            >
              {copied ? '✓ copied!' : '⎘ copy'}
            </button>
          </div>

          {/* row 2 — share */}
          <div className="flex flex-wrap gap-2">
            <button onClick={handleShareImage}  className={`text-xs font-mono px-3 py-1 rounded-md border transition-all cursor-pointer ${inactiveBtn}`}>↓ save image</button>
            <button onClick={handleCopySlack}   className={`text-xs font-mono px-3 py-1 rounded-md border transition-all cursor-pointer ${inactiveBtn}`}># slack block</button>
            <button onClick={handleSlackShare}  className={`text-xs font-mono px-3 py-1 rounded-md border transition-all cursor-pointer ${inactiveBtn}`}>⇗ slack</button>
            <button onClick={handleWhatsAppShare} className={`text-xs font-mono px-3 py-1 rounded-md border transition-all cursor-pointer ${inactiveBtn}`}>⇗ whatsapp</button>
          </div>
        </div>
      </div>
    </>
  )
}
