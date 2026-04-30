import { useEffect, useRef, useState } from 'react';

// ── icons ──────────────────────────────────────────────────────────────────

const IconSettings = () => (
  <svg
    className="w-[15px] h-[15px] flex-shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// ── primitives ──────────────────────────────────────────────────────────────

function SectionLabel({ children, isDark }) {
  return (
    <p
      className={`text-[10px] font-mono font-semibold uppercase tracking-widest mb-3
      ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}
    >
      {children}
    </p>
  );
}

function Card({ children, isDark }) {
  return (
    <div
      className={`rounded-xl border divide-y mb-5
      ${isDark ? 'border-zinc-800 divide-zinc-800 bg-zinc-800/30' : 'border-zinc-200 divide-zinc-100 bg-zinc-50'}`}
    >
      {children}
    </div>
  );
}

function SettingRow({ label, description, isDark, children }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-mono ${isDark ? 'text-zinc-200' : 'text-zinc-700'}`}>{label}</p>
        {description && (
          <p className={`text-xs font-mono mt-0.5 ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

function Toggle({ on, onToggle, isDark }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={e => {
        e.preventDefault();
        onToggle && onToggle();
      }}
      className={`relative flex-shrink-0 w-9 h-5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 flex items-center
        ${on ? 'bg-emerald-500' : isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200
          ${on ? 'translate-x-4' : 'translate-x-0'}`}
      />
    </button>
  );
}

function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      role="switch"
      aria-pressed={isDark}
      onClick={e => {
        e.preventDefault();
        onToggle && onToggle();
      }}
      className={`flex-shrink-0 w-9 h-5 rounded-full relative transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-300 flex items-center
        ${isDark ? 'bg-zinc-900' : 'bg-amber-100'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full transform transition-transform duration-200 flex items-center justify-center text-[10px]
          ${isDark ? 'translate-x-0 bg-zinc-600 text-white' : 'translate-x-4 bg-amber-400 text-amber-900'}`}
      >
        {isDark ? (
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
            />
          </svg>
        ) : (
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
            />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </span>
    </button>
  );
}

// ── tab content ────────────────────────────────────────────────────────────

function SettingsTab({
  settings,
  onToggle,
  onClearData,
  onClearHistory,
  onClearFavorites,
  onResetSettings,
  isDark,
}) {
  return (
    <div>
      <SectionLabel isDark={isDark}>appearance</SectionLabel>
      <Card isDark={isDark}>
        <SettingRow
          label="theme"
          description={isDark ? 'currently dark' : 'currently light'}
          isDark={isDark}
        >
          <ThemeToggle isDark={isDark} onToggle={() => onToggle('theme')} />
        </SettingRow>
        <SettingRow
          label="show excuse of the day"
          description="daily featured excuse banner"
          isDark={isDark}
        >
          <Toggle
            on={settings.showEotd ?? true}
            onToggle={() => onToggle('showEotd')}
            isDark={isDark}
          />
        </SettingRow>
        <SettingRow label="show active hints" description="feature pills in header" isDark={isDark}>
          <Toggle
            on={settings.showHints ?? true}
            onToggle={() => onToggle('showHints')}
            isDark={isDark}
          />
        </SettingRow>
        <SettingRow
          label="show excuse counter"
          description="session and all-time count"
          isDark={isDark}
        >
          <Toggle
            on={settings.showCounter ?? true}
            onToggle={() => onToggle('showCounter')}
            isDark={isDark}
          />
        </SettingRow>
      </Card>

      <SectionLabel isDark={isDark}>behaviour</SectionLabel>
      <Card isDark={isDark}>
        <SettingRow label="keyboard shortcut" description="press Space to generate" isDark={isDark}>
          <Toggle
            on={settings.keyboardShortcut}
            onToggle={() => onToggle('keyboardShortcut')}
            isDark={isDark}
          />
        </SettingRow>
        <SettingRow
          label="auto-copy on generate"
          description="copies excuse to clipboard instantly"
          isDark={isDark}
        >
          <Toggle on={settings.autoCopy} onToggle={() => onToggle('autoCopy')} isDark={isDark} />
        </SettingRow>
        <SettingRow
          label="sound effects"
          description="subtle audio feedback on generate"
          isDark={isDark}
        >
          <Toggle on={settings.sound} onToggle={() => onToggle('sound')} isDark={isDark} />
        </SettingRow>
        <SettingRow
          label="update URL on generate"
          description="shareable link per excuse in address bar"
          isDark={isDark}
        >
          <Toggle
            on={settings.updateUrl ?? true}
            onToggle={() => onToggle('updateUrl')}
            isDark={isDark}
          />
        </SettingRow>
        <SettingRow
          label="tone in share card"
          description="show tone label on image export"
          isDark={isDark}
        >
          <Toggle
            on={settings.toneInCard ?? true}
            onToggle={() => onToggle('toneInCard')}
            isDark={isDark}
          />
        </SettingRow>
      </Card>

      <SectionLabel isDark={isDark}>storage</SectionLabel>
      <Card isDark={isDark}>
        <SettingRow
          label="save to localStorage"
          description="persist selections across reloads"
          isDark={isDark}
        >
          <Toggle
            on={settings.localStorage}
            onToggle={() => onToggle('localStorage')}
            isDark={isDark}
          />
        </SettingRow>
        <SettingRow
          label="save excuse history"
          description="keep last 10 excuses across sessions"
          isDark={isDark}
        >
          <Toggle
            on={settings.saveHistory ?? true}
            onToggle={() => onToggle('saveHistory')}
            isDark={isDark}
          />
        </SettingRow>
        <SettingRow
          label="save favorites"
          description="persist starred excuses across reloads"
          isDark={isDark}
        >
          <Toggle
            on={settings.saveFavorites ?? true}
            onToggle={() => onToggle('saveFavorites')}
            isDark={isDark}
          />
        </SettingRow>
      </Card>

      <SectionLabel isDark={isDark}>danger zone</SectionLabel>
      <Card isDark={isDark}>
        {[
          { label: 'clear all saved data', fn: onClearData },
          { label: 'clear excuse history', fn: onClearHistory },
          { label: 'clear favorites', fn: onClearFavorites },
          { label: 'reset settings to default', fn: onResetSettings },
        ].map(({ label, fn }) => (
          <button
            key={label}
            onClick={fn}
            className={`w-full text-left text-xs font-mono px-4 py-2.5 transition-all cursor-pointer
              text-red-400 hover:bg-red-500/10`}
          >
            {label}
          </button>
        ))}
      </Card>
    </div>
  );
}

// ── tab config ─────────────────────────────────────────────────────────────

const TABS = [{ id: 'settings', label: 'settings', Icon: IconSettings }];

// main panel ─────────────────────────────────────────────────────────────

export default function SettingsPanel({
  open,
  onClose,
  settings,
  onToggle,
  onClearData,
  onClearHistory,
  onClearFavorites,
  onResetSettings,
}) {
  const panelRef = useRef(null);
  const [tab, setTab] = useState(() => {
    try {
      const t = localStorage.getItem('excusify_settings_tab');
      return t || 'settings';
    } catch {
      return 'settings';
    }
  });

  const isDark = settings.theme === 'dark';

  // outside click
  useEffect(() => {
    if (!open) return;
    function h(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open, onClose]);

  // escape
  useEffect(() => {
    if (!open) return;
    function h(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  const panelBg = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200';
  const topbarBg = isDark ? 'border-zinc-800' : 'border-zinc-200';
  const footerCl = isDark ? 'border-zinc-800 text-zinc-700' : 'border-zinc-200 text-zinc-400';
  const tabActive = isDark
    ? 'border-b-2 border-emerald-400 text-emerald-400'
    : 'border-b-2 border-emerald-500 text-emerald-600';
  const tabInactive = isDark
    ? 'text-zinc-500 hover:text-zinc-300 border-b-2 border-transparent'
    : 'text-zinc-400 hover:text-zinc-600 border-b-2 border-transparent';

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
        className={`fixed top-0 right-0 h-full z-50 w-96 border-l shadow-2xl flex flex-col
          transition-transform duration-300 ease-in-out
          ${panelBg}
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* topbar */}
        <div className={`px-5 pt-4 pb-0 border-b flex-shrink-0 ${topbarBg}`}>
          <div className="flex items-center justify-between mb-3">
            <span
              className={`font-mono text-sm font-semibold ${isDark ? 'text-zinc-100' : 'text-zinc-800'}`}
            >
              excusify
            </span>
            <button
              onClick={onClose}
              className={`text-[10px] font-mono px-2 py-1 rounded-lg border transition-all cursor-pointer
                ${isDark ? 'border-zinc-700 text-zinc-500 hover:text-zinc-200 hover:border-zinc-500' : 'border-zinc-300 text-zinc-400 hover:text-zinc-700'}`}
            >
              esc
            </button>
          </div>

          {/* tab bar */}
          <div className="flex gap-1">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setTab(id);
                  try {
                    localStorage.setItem('excusify_settings_tab', id);
                  } catch {}
                }}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono transition-all cursor-pointer
                  ${tab === id ? tabActive : tabInactive}`}
              >
                <Icon />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {tab === 'settings' && (
            <SettingsTab
              settings={settings}
              onToggle={onToggle}
              onClearData={onClearData}
              onClearHistory={onClearHistory}
              onClearFavorites={onClearFavorites}
              onResetSettings={onResetSettings}
              isDark={isDark}
            />
          )}
          {/* {tab === 'history'   && <HistoryTab   history={history}     onClearHistory={onClearHistory}     isDark={isDark} />}
          {tab === 'favorites' && <FavoritesTab favorites={favorites}  onClearFavorites={onClearFavorites} isDark={isDark} />}
          {tab === 'about'     && <AboutTab     isDark={isDark}        totalCount={totalCount} />} */}
        </div>

        {/* footer */}
        <div className={`px-5 py-3 border-t flex-shrink-0 ${footerCl}`}>
          <p className="text-[10px] font-mono">excusify · all changes saved instantly</p>
        </div>
      </div>
    </>
  );
}
