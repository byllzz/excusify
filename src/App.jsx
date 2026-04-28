import { useState, useEffect, useCallback } from 'react'
import { excuses } from './data/excuses'
import SituationPicker from './components/SituationPicker'
import TonePicker from './components/TonePicker'
import ExcuseCard from './components/ExcuseCard'
import SettingsPanel from './components/SettingsPanel'
import EotdBanner from './components/EotdBanner';

// ── constants

const LS_KEY        = 'excusify_state'
const LS_SETTINGS   = 'excusify_settings'
const LS_HISTORY    = 'excusify_history'
const LS_FAVORITES  = 'excusify_favorites'
const LS_TOTAL      = 'excusify_total'
const MAX_HISTORY   = 10
const MAX_FAVORITES = 20

const DEFAULT_SETTINGS = {
  localStorage:     true,
  autoCopy:         false,
  keyboardShortcut: true,
  sound:            false,
  theme:            'dark',
}

// ── helpers


// load function:
function load(key, fallback) {
  if (typeof window === 'undefined') return fallback; // Safety check for SSR
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch { return fallback }
}

function playPop() {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)()
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(600, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08)
    gain.gain.setValueAtTime(0.08, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.12)
  } catch { /* audio not available */ }
}

// build shareable URL for current excuse
function buildShareUrl(situation, tone, excuse) {
  const base   = window.location.origin + window.location.pathname
  const params = new URLSearchParams({
    s: situation,
    t: tone,
    e: btoa(unescape(encodeURIComponent(excuse))), // base64 encode excuse text
  })
  return `${base}?${params.toString()}`
}

// read excuse from URL on first load
function readUrlParams() {
  try {
    const p = new URLSearchParams(window.location.search)
    if (!p.has('s') || !p.has('t') || !p.has('e')) return null
    return {
      situation: p.get('s'),
      tone:      p.get('t'),
      excuse:    decodeURIComponent(escape(atob(p.get('e')))),
    }
  } catch { return null }
}

// ── App

export default function App() {
  const [settings, setSettings] = useState(() => load(LS_SETTINGS, DEFAULT_SETTINGS))

  const fromUrl = readUrlParams()
  const saved   = settings.localStorage ? load(LS_KEY, null) : null

  const [activeSit,    setActiveSit]    = useState(fromUrl?.situation ?? saved?.activeSit  ?? 'bug still exists')
  const [activeTone,   setActiveTone]   = useState(fromUrl?.tone      ?? saved?.activeTone ?? 'professional')
  const [excuse,       setExcuse]       = useState(fromUrl?.excuse    ?? saved?.excuse     ?? null)
  const [rated,        setRated]        = useState(saved?.rated       ?? null)
  const [count,        setCount]        = useState(saved?.count       ?? 0)
  const [copied,       setCopied]       = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [history,      setHistory]      = useState(() => load(LS_HISTORY,   []))
  const [favorites,    setFavorites]    = useState(() => load(LS_FAVORITES, []))
  const [totalCount,   setTotalCount]   = useState(() => load(LS_TOTAL, 0))
  const [customTone,   setCustomTone]   = useState(null) // set when AI excuse is active

  const isDark = settings.theme === 'dark'

  // current situation label — could be a custom one
  const currentSituation = customTone ? customTone.situation : activeSit
  const currentTone      = customTone ? 'ai-generated'       : activeTone

  // ── persist ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!settings.localStorage) return
    localStorage.setItem(LS_KEY, JSON.stringify({ activeSit, activeTone, excuse, rated, count }))
  }, [activeSit, activeTone, excuse, rated, count, settings.localStorage])

  useEffect(() => {
    localStorage.setItem(LS_SETTINGS,  JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    localStorage.setItem(LS_HISTORY,   JSON.stringify(history))
  }, [history])

  useEffect(() => {
    localStorage.setItem(LS_FAVORITES, JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem(LS_TOTAL,     JSON.stringify(totalCount))
  }, [totalCount])

  // ── generate ─────────────────────────────────────────────────────────────────

  const generate = useCallback(() => {
    const pool = excuses[activeSit][activeTone]
    const prev = excuse
    let next   = prev
    if (pool.length > 1) {
      while (next === prev) next = pool[Math.floor(Math.random() * pool.length)]
    } else { next = pool[0] }

    setExcuse(next)
    setCustomTone(null)
    setRated(null)
    setCopied(false)
    setCount(c => c + 1)
    setTotalCount(c => c + 1)

    setHistory(prev => {
      const entry   = { excuse: next, situation: activeSit, tone: activeTone }
      return [entry, ...prev.filter(h => h.excuse !== next)].slice(0, MAX_HISTORY)
    })

    if (settings.sound)     playPop()
    if (settings.autoCopy) {
      navigator.clipboard.writeText(next).catch(() => {})
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }

    // update URL with shareable params
    const url = buildShareUrl(activeSit, activeTone, next)
    window.history.replaceState({}, '', url)

  }, [activeSit, activeTone, excuse, settings.sound, settings.autoCopy])

  // ── keyboard shortcut ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (!settings.keyboardShortcut) return
    function handler(e) {
      if (e.code === 'Space' && e.target === document.body && !settingsOpen) {
        e.preventDefault()
        generate()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [settings.keyboardShortcut, generate, settingsOpen])

  // ── handlers ──────────────────────────────────────────────────────────────────

  function handleToggle(key) {
    setSettings(prev => ({
      ...prev,
      [key]: key === 'theme' ? (prev.theme === 'dark' ? 'light' : 'dark') : !prev[key],
    }))
  }

  function handleClearData() {
    localStorage.removeItem(LS_KEY)
    setExcuse(null); setRated(null); setCount(0)
    setActiveSit('bug still exists'); setActiveTone('professional')
    setCustomTone(null)
    window.history.replaceState({}, '', window.location.pathname)
  }

  function handleCopy() {
    if (!excuse) return
    navigator.clipboard.writeText(excuse)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleRate(val) {
    if (rated) return
    setRated(val)
  }

  function handleFavorite() {
    if (!excuse) return
    const entry = { excuse, situation: currentSituation, tone: currentTone }
    setFavorites(prev => {
      const already = prev.some(f => f.excuse === excuse)
      if (already) return prev.filter(f => f.excuse !== excuse)
      return [entry, ...prev].slice(0, MAX_FAVORITES)
    })
  }

  const isFavorite = favorites.some(f => f.excuse === excuse)

  // ── from EOTD banner ──────────────────────────────────────────────────────────

  function handleUseEotd({ excuse: e, situation, tone }) {
    setExcuse(e)
    setCustomTone({ situation, tone })
    setRated(null); setCopied(false)
    setCount(c => c + 1); setTotalCount(c => c + 1)
    setHistory(prev => [{ excuse: e, situation, tone }, ...prev.filter(h => h.excuse !== e)].slice(0, MAX_HISTORY))
    window.history.replaceState({}, '', buildShareUrl(situation, tone, e))
  }

  // ── from custom situation / AI ────────────────────────────────────────────────

  function handleCustomExcuse({ excuse: e, situation, tone }) {
    setExcuse(e)
    setCustomTone({ situation, tone })
    setRated(null); setCopied(false)
    setCount(c => c + 1); setTotalCount(c => c + 1)
    setHistory(prev => [{ excuse: e, situation, tone }, ...prev.filter(h => h.excuse !== e)].slice(0, MAX_HISTORY))
    window.history.replaceState({}, '', buildShareUrl(situation, tone, e))
  }

  // ── theme helpers ─────────────────────────────────────────────────────────────

  const bg       = isDark ? 'bg-zinc-950'     : 'bg-zinc-100'
  const cardBg   = isDark ? 'bg-zinc-900'     : 'bg-white'
  const cardBdr  = isDark ? 'border-zinc-800' : 'border-zinc-200'
  const titleCl  = isDark ? 'text-white'      : 'text-zinc-900'
  const subCl    = isDark ? 'text-zinc-500'   : 'text-zinc-400'
  const footerCl = isDark ? 'text-zinc-700'   : 'text-zinc-400'
  const winBar   = isDark ? 'text-zinc-600'   : 'text-zinc-400'
  const hintCl   = isDark ? 'border-zinc-800 text-zinc-600' : 'border-zinc-300 text-zinc-400'
  const settBtn  = isDark
    ? 'border-zinc-800 text-zinc-500 hover:text-zinc-200 hover:border-zinc-600 hover:bg-zinc-900'
    : 'border-zinc-300 text-zinc-400 hover:text-zinc-700 hover:border-zinc-400 hover:bg-white'

  return (
    <div className={`min-h-screen ${bg} flex flex-col items-center px-4 py-16 transition-colors duration-300`}>

      {/* ── header ── */}
      <div className="w-full max-w-xl mb-6 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className={`text-3xl font-mono font-bold tracking-tight ${titleCl}`}>excusify</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full border border-yellow-500/40 bg-yellow-500/10 text-yellow-400">
              v0.1-dev
            </span>
          </div>

          <button
            onClick={() => setSettingsOpen(true)}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${settBtn}`}
            title="settings"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        <p className={`font-mono text-sm ${subCl}`}>
          // because "i don't know" isn't always professional enough
        </p>

        {/* active feature hints */}
        <div className="flex gap-2 flex-wrap pt-1">
          {settings.keyboardShortcut && (
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${hintCl}`}>space to generate</span>
          )}
          {settings.autoCopy && (
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${hintCl}`}>auto-copy on</span>
          )}
          {settings.sound && (
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${hintCl}`}>sound on</span>
          )}
        </div>
      </div>

      {/* ── excuse of the day ── */}
      <EotdBanner isDark={isDark} onUse={handleUseEotd} />

      {/* ── main card ── */}
      <div className={`w-full max-w-xl border ${cardBdr} rounded-2xl ${cardBg} p-6 space-y-6 shadow-2xl shadow-black/20 transition-colors duration-300`}>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
          <span className={`ml-3 font-mono text-xs ${winBar}`}>excusify — bash</span>
        </div>

        <SituationPicker active={activeSit}  onChange={(v) => { setActiveSit(v); setCustomTone(null) }} isDark={isDark} />
        <TonePicker      active={activeTone} onChange={(v) => { setActiveTone(v); setCustomTone(null) }} isDark={isDark} />

        <button
          onClick={generate}
          className="w-full py-3 rounded-xl font-mono text-sm font-semibold
            bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98]
            text-zinc-950 transition-all duration-150 cursor-pointer shadow-lg shadow-emerald-900/20"
        >
          generate excuse
        </button>

        {excuse && (
          <ExcuseCard
            excuse={excuse}
            situation={currentSituation}
            tone={currentTone}
            onCopy={handleCopy}
            copied={copied}
            onRate={handleRate}
            rated={rated}
            isFavorite={isFavorite}
            onFavorite={handleFavorite}
            isDark={isDark}
          />
        )}

        {count > 0 && (
          <p className={`text-center text-xs font-mono ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
            {count} this session
            {totalCount > count && (
              <span className="ml-2 opacity-50">· {totalCount.toLocaleString()} all time</span>
            )}
          </p>
        )}
      </div>


      {/* ── footer ── */}
      <p className={`mt-8 font-mono text-xs ${footerCl}`}>
        excusify · open source · still in development
        {totalCount > 0 && (
          <span className="ml-2 opacity-60">· {totalCount.toLocaleString()} excuses generated</span>
        )}
      </p>

      {/* ── settings panel ── */}
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onToggle={handleToggle}
        onClearData={handleClearData}
        history={history}
        onClearHistory={() => setHistory([])}
        favorites={favorites}
        onClearFavorites={() => setFavorites([])}
      />
    </div>
  )
}
