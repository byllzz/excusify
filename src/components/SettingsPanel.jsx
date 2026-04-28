import { useEffect, useRef } from 'react'

export default function SettingsPanel({ open, onClose, settings, onToggle, onClearData, history, onClearHistory }) {
  const panelRef = useRef(null)

  // close on outside click
  useEffect(() => {
    if (!open) return
    function handler(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, onClose])

  // close on Escape
  useEffect(() => {
    if (!open) return
    function handler(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  const isDark = settings.theme === 'dark'

  return (
    <>
      {/* backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300
          ${open ? 'bg-black/40 pointer-events-auto' : 'bg-transparent pointer-events-none'}`}
      />

      {/* panel */}
      <div
        ref={panelRef}
        className={`
          fixed top-0 right-0 h-full z-50 w-80
          ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'}
          border-l shadow-2xl flex flex-col
          transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-mono text-sm font-semibold">settings</span>
          </div>
          <button
            onClick={onClose}
            className={`font-mono text-xs px-2 py-1 rounded border transition-all cursor-pointer
              ${isDark ? 'border-zinc-700 text-zinc-500 hover:text-zinc-200 hover:border-zinc-500' : 'border-zinc-300 text-zinc-400 hover:text-zinc-700 hover:border-zinc-400'}`}
          >
            esc
          </button>
        </div>

        {/* scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">

          {/* ── Appearance ── */}
          <Section label="appearance" isDark={isDark}>
            <SettingRow
              label="theme"
              description={isDark ? 'currently dark' : 'currently light'}
              isDark={isDark}
            >
              <ThemeToggle isDark={isDark} onToggle={() => onToggle('theme')} />
            </SettingRow>
          </Section>

          {/* ── Behaviour ── */}
          <Section label="behaviour" isDark={isDark}>
            <SettingRow
              label="auto-copy on generate"
              description="copies excuse to clipboard automatically"
              isDark={isDark}
            >
              <Toggle on={settings.autoCopy} onToggle={() => onToggle('autoCopy')} isDark={isDark} />
            </SettingRow>
            <SettingRow
              label="keyboard shortcut"
              description="press Space to generate"
              isDark={isDark}
            >
              <Toggle on={settings.keyboardShortcut} onToggle={() => onToggle('keyboardShortcut')} isDark={isDark} />
            </SettingRow>
            <SettingRow
              label="sound effects"
              description="subtle audio feedback on generate"
              isDark={isDark}
            >
              <Toggle on={settings.sound} onToggle={() => onToggle('sound')} isDark={isDark} />
            </SettingRow>
          </Section>

          {/* ── Storage ── */}
          <Section label="storage" isDark={isDark}>
            <SettingRow
              label="save to localStorage"
              description="persist selections and excuse across reloads"
              isDark={isDark}
            >
              <Toggle on={settings.localStorage} onToggle={() => onToggle('localStorage')} isDark={isDark} />
            </SettingRow>
            {settings.localStorage && (
              <div className="pt-1">
                <button
                  onClick={onClearData}
                  className="text-xs font-mono px-3 py-1.5 rounded-md border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-all cursor-pointer w-full"
                >
                  clear all saved data
                </button>
              </div>
            )}
          </Section>

          {/* ── History ── */}
          <Section label={`excuse history (${history.length})`} isDark={isDark}>
            {history.length === 0 ? (
              <p className={`text-xs font-mono ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
                no excuses generated yet
              </p>
            ) : (
              <div className="space-y-2">
                {history.map((item, i) => (
                  <div
                    key={i}
                    className={`text-xs font-mono rounded-md p-2.5 border leading-relaxed
                      ${isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-600'}`}
                  >
                    <span className="text-emerald-500 mr-1.5">$</span>
                    {item.excuse}
                    <div className={`mt-1 text-[10px] ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
                      {item.situation} · {item.tone}
                    </div>
                  </div>
                ))}
                <button
                  onClick={onClearHistory}
                  className={`text-xs font-mono px-3 py-1.5 rounded-md border transition-all cursor-pointer w-full mt-1
                    ${isDark ? 'border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-500' : 'border-zinc-300 text-zinc-400 hover:text-zinc-600 hover:border-zinc-400'}`}
                >
                  clear history
                </button>
              </div>
            )}
          </Section>

        </div>

        {/* footer */}
        <div className={`px-5 py-3 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <p className={`text-xs font-mono ${isDark ? 'text-zinc-700' : 'text-zinc-400'}`}>
            excusify v0.1 · all settings saved instantly
          </p>
        </div>
      </div>
    </>
  )
}

// ── Reusable sub-components ──────────────────────────────────────────────────

function Section({ label, children, isDark }) {
  return (
    <div>
      <p className={`text-[10px] font-mono font-semibold uppercase tracking-widest mb-3
        ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
        // {label}
      </p>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function SettingRow({ label, description, children, isDark }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-mono ${isDark ? 'text-zinc-200' : 'text-zinc-700'}`}>{label}</p>
        <p className={`text-xs font-mono mt-0.5 ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>{description}</p>
      </div>
      {children}
    </div>
  )
}

function Toggle({ on, onToggle, isDark }) {
  return (
    <button
      onClick={onToggle}
      className={`relative flex-shrink-0 w-10 h-5 rounded-full border transition-all duration-200 cursor-pointer
        ${on
          ? 'bg-emerald-500 border-emerald-500'
          : isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-200 border-zinc-300'
        }`}
    >
      <span className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200
        ${on ? 'left-5 bg-white' : 'left-0.5 ' + (isDark ? 'bg-zinc-500' : 'bg-zinc-400')}`}
      />
    </button>
  )
}

function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`flex-shrink-0 w-10 h-5 rounded-full border relative transition-all duration-200 cursor-pointer
        ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-amber-100 border-amber-300'}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200 flex items-center justify-center text-[8px]
        ${isDark ? 'left-0.5 bg-zinc-500' : 'left-5 bg-amber-400'}`}>
        {isDark ? '🌙' : '☀'}
      </span>
    </button>
  )
}
