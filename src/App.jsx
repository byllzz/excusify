import { useState, useEffect, useCallback } from 'react';
import { excuses } from './data/excuses';
import SituationPicker from './components/SituationPicker';
import TonePicker from './components/TonePicker';
import ExcuseCard from './components/ExcuseCard';
import SettingsPanel from './components/SettingsPanel';
import EotdExcuse from './components/EotdExcuse';
import FavoritesTab from './components/FavoritesTab';
import AboutTab from './components/AboutTab';
import HistoryTab from './components/HistoryTab';
import RepoTab from './components/RepoTab';
import KeyboardHelp from './components/KeyboardHelp';

// constants

const LS_KEY = 'excusify_state';
const LS_SETTINGS = 'excusify_settings';
const LS_SETTINGS_TAB = 'excusify_settings_tab';
const LS_QUICK_TAB = 'excusify_quick_tab';
const LS_HISTORY = 'excusify_history';
const LS_FAVORITES = 'excusify_favorites';
const LS_TOTAL = 'excusify_total';
// how many items to show by default in the UI
const DISPLAY_HISTORY = 10;
// cap how many history items we persist to localStorage to avoid unbounded growth
const STORED_HISTORY_LIMIT = 1000;
const MAX_FAVORITES = 20;

const DEFAULT_SETTINGS = {
  localStorage: true,
  autoCopy: false,
  keyboardShortcut: true,
  sound: false,
  theme: 'light',
  showEotd: true,
  showHints: true,
  showCounter: true,
  updateUrl: true,
  toneInCard: true,
  saveHistory: true,
  saveFavorites: true,
  saveCounter: true,
};

// helpers

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    if (!v) return fallback;
    try {
      return JSON.parse(v);
    } catch {
      // fallback: return raw string value when not JSON
      return v;
    }
  } catch {
    return fallback;
  }
}

function playPop() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.12);
  } catch {
    /* audio not available */
  }
}

function buildShareUrl(situation, tone, excuse) {
  try {
    const base = window.location.origin + window.location.pathname;
    const params = new URLSearchParams({
      s: situation,
      t: tone,
      e: btoa(unescape(encodeURIComponent(excuse))),
    });
    return `${base}?${params.toString()}`;
  } catch {
    return window.location.href;
  }
}

function readUrlParams() {
  try {
    const p = new URLSearchParams(window.location.search);
    if (!p.has('s') || !p.has('t') || !p.has('e')) return null;
    return {
      situation: p.get('s'),
      tone: p.get('t'),
      excuse: decodeURIComponent(escape(atob(p.get('e')))),
    };
  } catch {
    return null;
  }
}

// App

export default function App() {
  const [settings, setSettings] = useState(() => load(LS_SETTINGS, DEFAULT_SETTINGS));

  const fromUrl = readUrlParams();
  const saved = settings.localStorage ? load(LS_KEY, null) : null;

  const [activeSit, setActiveSit] = useState(
    fromUrl?.situation ?? saved?.activeSit ?? 'bug still exists',
  );
  const [activeTone, setActiveTone] = useState(
    fromUrl?.tone ?? saved?.activeTone ?? 'professional',
  );
  const [excuse, setExcuse] = useState(fromUrl?.excuse ?? saved?.excuse ?? null);
  const [rated, setRated] = useState(saved?.rated ?? null);
  const [count, setCount] = useState(saved?.count ?? 0);
  const [copied, setCopied] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [tabOpen, setTabOpen] = useState(() => load(LS_QUICK_TAB, null));
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  const [history, setHistory] = useState(() => load(LS_HISTORY, []));
  const [favorites, setFavorites] = useState(() => load(LS_FAVORITES, []));
  const [totalCount, setTotalCount] = useState(() => load(LS_TOTAL, 0));
  const [customTone, setCustomTone] = useState(null);

  // displaySit/displayTone capture the situation/tone used when the current
  // excuse was generated so they don't change if the user updates the pickers.
  const [displaySit, setDisplaySit] = useState(
    fromUrl?.situation ?? saved?.activeSit ?? 'bug still exists',
  );
  const [displayTone, setDisplayTone] = useState(
    fromUrl?.tone ?? saved?.activeTone ?? 'professional',
  );

  const isDark = settings.theme === 'dark';
  const currentSituation = customTone ? customTone.situation : displaySit;
  const currentTone = customTone ? customTone.tone : displayTone;

  // ── persist ────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!settings.localStorage) return;
    // persist core state (do not persist transient UI like the settings panel open state)
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ activeSit, activeTone, excuse, rated, count }));
    } catch {}
  }, [activeSit, activeTone, excuse, rated, count, settings.localStorage]);

  useEffect(() => {
    localStorage.setItem(LS_SETTINGS, JSON.stringify(settings));
  }, [settings]);
  useEffect(() => {
    localStorage.setItem(LS_HISTORY, JSON.stringify(history));
  }, [history]);
  useEffect(() => {
    localStorage.setItem(LS_FAVORITES, JSON.stringify(favorites));
  }, [favorites]);
  useEffect(() => {
    localStorage.setItem(LS_TOTAL, JSON.stringify(totalCount));
  }, [totalCount]);

  // persist quick-open tab (favorites/history/about) so it survives reloads
  useEffect(() => {
    if (!settings.localStorage) return;
    try {
      if (tabOpen) localStorage.setItem(LS_QUICK_TAB, JSON.stringify(tabOpen));
      else localStorage.removeItem(LS_QUICK_TAB);
    } catch {}
  }, [tabOpen, settings.localStorage]);

  // ── generate ───────────────────────────────────────────────────────────────

  const generate = useCallback(() => {
    const pool = excuses[activeSit][activeTone];
    const prev = excuse;
    let next = prev;
    if (pool.length > 1) {
      while (next === prev) next = pool[Math.floor(Math.random() * pool.length)];
    } else {
      next = pool[0];
    }

    setExcuse(next);
    setCustomTone(null);
    // lock the situation/tone that were used to generate this excuse
    setDisplaySit(activeSit);
    setDisplayTone(activeTone);
    setRated(null);
    setCopied(false);
    setCount(c => c + 1);
    setTotalCount(c => c + 1);

    setHistory(prev => {
      const entry = { excuse: next, situation: activeSit, tone: activeTone };
      return [entry, ...prev.filter(h => h.excuse !== next)].slice(0, STORED_HISTORY_LIMIT);
    });

    if (settings.sound) playPop();
    if (settings.autoCopy) {
      navigator.clipboard.writeText(next).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    if (settings.updateUrl) {
      window.history.replaceState({}, '', buildShareUrl(activeSit, activeTone, next));
    }
  }, [activeSit, activeTone, excuse, settings]);

  // ── keyboard shortcut ──────────────────────────────────────────────────────

  useEffect(() => {
    if (!settings.keyboardShortcut) return;
    function handler(e) {
      if (e.code === 'Space' && e.target === document.body && !panelOpen) {
        e.preventDefault();
        generate();
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [settings.keyboardShortcut, generate, panelOpen]);

  // extra keyboard shortcuts: ?, S, T, C, F
  useEffect(() => {
    function kb(e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const targetTag = e.target?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea') return;

      if (e.key === '?') {
        e.preventDefault();
        setShowKeyboardHelp(true);
        return;
      }

      if (e.key.toLowerCase() === 's') {
        const el = document.getElementById('situation-picker')?.querySelector('button');
        if (el) {
          e.preventDefault();
          el.focus();
        }
        return;
      }

      if (e.key.toLowerCase() === 't') {
        const el = document.getElementById('tone-picker')?.querySelector('button');
        if (el) {
          e.preventDefault();
          el.focus();
        }
        return;
      }

      if (e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleCopy();
        return;
      }

      if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        handleFavorite();
        return;
      }
    }
    window.addEventListener('keydown', kb);
    return () => window.removeEventListener('keydown', kb);
  }, [handleCopy, handleFavorite]);

  // ── handlers ───────────────────────────────────────────────────────────────

  function handleToggle(key) {
    setSettings(prev => ({
      ...prev,
      [key]: key === 'theme' ? (prev.theme === 'dark' ? 'light' : 'dark') : !prev[key],
    }));
  }

  function handleClearData() {
    localStorage.removeItem(LS_KEY);
    setExcuse(null);
    setRated(null);
    setCount(0);
    setActiveSit('bug still exists');
    setActiveTone('professional');
    setCustomTone(null);
    window.history.replaceState({}, '', window.location.pathname);
  }

  function handleResetSettings() {
    setSettings(DEFAULT_SETTINGS);
  }

  function handleCopy() {
    if (!excuse) return;
    navigator.clipboard.writeText(excuse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleRate(val) {
    if (rated) return;
    setRated(val);
  }

  function handleFavorite() {
    if (!excuse) return;
    const entry = { excuse, situation: currentSituation, tone: currentTone };
    setFavorites(prev => {
      const already = prev.some(f => f.excuse === excuse);
      if (already) return prev.filter(f => f.excuse !== excuse);
      return [entry, ...prev].slice(0, MAX_FAVORITES);
    });
  }

  function handleUseEotd({ excuse: e, situation, tone }) {
    setExcuse(e);
    setCustomTone({ situation, tone });
    setDisplaySit(situation);
    setDisplayTone(tone);
    setRated(null);
    setCopied(false);
    setCount(c => c + 1);
    setTotalCount(c => c + 1);
    setHistory(prev =>
      [{ excuse: e, situation, tone }, ...prev.filter(h => h.excuse !== e)].slice(
        0,
        STORED_HISTORY_LIMIT,
      ),
    );
    if (settings.updateUrl) window.history.replaceState({}, '', buildShareUrl(situation, tone, e));
  }

  // customSituation removed — keep `customTone` for EoTD reuse

  const isFavorite = favorites.some(f => f.excuse === excuse);

  // ── theme classes ──────────────────────────────────────────────────────────

  const bg = isDark ? 'bg-zinc-950' : 'bg-zinc-100';
  const cardBg = isDark ? 'bg-zinc-900' : 'bg-white';
  const cardBdr = isDark ? 'border-zinc-800' : 'border-zinc-200';
  const titleCl = isDark ? 'text-white' : 'text-zinc-900';
  const subCl = isDark ? 'text-zinc-500' : 'text-zinc-400';
  const footerCl = isDark ? 'text-zinc-700' : 'text-zinc-400';
  const winBar = isDark ? 'text-zinc-600' : 'text-zinc-400';
  const hintCl = isDark ? 'border-zinc-800 text-zinc-600' : 'border-zinc-300 text-zinc-400';
  const settBtn = isDark
    ? 'border-zinc-800 text-zinc-500 hover:text-zinc-200 hover:border-zinc-600 hover:bg-zinc-900'
    : 'border-zinc-300 text-zinc-400 hover:text-zinc-700 hover:border-zinc-400 hover:bg-white';

  return (
    <div
      className={`min-h-screen ${bg} ${isDark ? 'bg-grid-dark' : 'bg-grid-light'} flex flex-col items-center px-4 py-16 transition-colors duration-300`}
    >
      {/* header */}
      <div className="w-full max-w-xl mb-6 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className={`text-3xl font-mono font-bold tracking-tight ${titleCl}`}>excusify</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full border border-yellow-500/40 bg-yellow-500/10 text-yellow-400">
              v0.1-dev
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* settings button */}
            <button
              onClick={() => setPanelOpen(true)}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${settBtn}`}
              title="settings"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
            {/* history */}
            <button
              onClick={() => setTabOpen('history')}
              className={`relative p-2 rounded-lg border transition-all cursor-pointer ${settBtn}`}
              title="history"
            >
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
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {history.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-4 px-1.5 rounded-full flex items-center justify-center text-[10px] font-mono bg-emerald-500 text-white">
                  {history.length}
                </span>
              )}
            </button>
            {/* favs */}
            <button
              onClick={() => setTabOpen('favs')}
              className={`relative p-2 rounded-lg border transition-all cursor-pointer ${settBtn}`}
              title="favorites"
            >
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
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-4 px-1.5 rounded-full flex items-center justify-center text-[10px] font-mono bg-yellow-500 text-white">
                  {favorites.length}
                </span>
              )}
            </button>
            {/* about */}
            <button
              onClick={() => setTabOpen('about')}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${settBtn}`}
              title="settings"
            >
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
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>
            </button>
            {/* repo */}
            <button
              onClick={() => setTabOpen('repo')}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${settBtn}`}
              title="repo"
            >
              <svg
                className="w-[15px] h-[15px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.5 0-.25-.01-.92-.01-1.8-2.78.6-3.37-1.34-3.37-1.34-.45-1.17-1.11-1.48-1.11-1.48-.91-.62.07-.61.07-.61 1.01.07 1.54 1.04 1.54 1.04.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.26.1-2.63 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0112 6.8c.85.004 1.7.115 2.5.337 1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.38.1 2.63.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85 0 1.33-.01 2.4-.01 2.73 0 .28.18.6.69.5A10.01 10.01 0 0022 12c0-5.52-4.48-10-10-10z"
                />
              </svg>
            </button>
            {/* keyboard help */}
            <button
              onClick={() => setShowKeyboardHelp(true)}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${settBtn}`}
              title="keyboard help"
            >
              ?
            </button>
          </div>
        </div>

        <p className={`font-mono text-sm ${subCl}`}>
          // because "i don't know" isn't always professional enough
        </p>

        {/* active hints */}
        {settings.showHints && (
          <div className="flex gap-2 flex-wrap pt-1">
            {settings.keyboardShortcut && (
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${hintCl}`}>
                space to generate
              </span>
            )}
            {settings.autoCopy && (
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${hintCl}`}>
                auto-copy on
              </span>
            )}
            {settings.sound && (
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${hintCl}`}>
                sound on
              </span>
            )}
          </div>
        )}
      </div>

      {/* excuse of the day */}
      {settings.showEotd && <EotdExcuse isDark={isDark} onUse={handleUseEotd} />}

      {/* main card */}
      <div
        className={`w-full max-w-xl border ${cardBdr} rounded-2xl ${cardBg} p-6 space-y-6 shadow-2xl shadow-black/20 transition-colors duration-300`}
      >
        {/* window dots */}
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
          <span className={`ml-3 font-mono text-xs ${winBar}`}>excusify — bash</span>
        </div>

        <div id="situation-picker" className="focus:outline-none">
          <SituationPicker
            active={activeSit}
            onChange={v => {
              setActiveSit(v);
              setCustomTone(null);
            }}
            isDark={isDark}
          />
        </div>
        <div id="tone-picker" className="focus:outline-none">
          <TonePicker
            active={activeTone}
            onChange={v => {
              setActiveTone(v);
              setCustomTone(null);
            }}
            isDark={isDark}
          />
        </div>

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

        {settings.showCounter && count > 0 && (
          <p
            className={`text-center text-xs font-mono ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}
          >
            {count} this session
            {totalCount > count && (
              <span className="ml-2 opacity-50">· {totalCount.toLocaleString()} all time</span>
            )}
          </p>
        )}
      </div>

      {/* custom situation removed */}

      {/* footer */}
      <p className={`mt-8 font-mono text-xs ${footerCl}`}>
        excusify · open source · still in development
        {totalCount > 0 && (
          <span className="ml-2 opacity-60">· {totalCount.toLocaleString()} excuses generated</span>
        )}
      </p>

      {/* panel (settings + history + favorites + about) */}
      <SettingsPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        settings={settings}
        onToggle={handleToggle}
        onClearData={handleClearData}
        onResetSettings={handleResetSettings}
        // history={history}
        onClearHistory={() => setHistory([])}
        // favorites={favorites}
        onClearFavorites={() => setFavorites([])}
        // totalCount={totalCount}
      />

      {/* centered overlay for quick tabs (favorites, history, about, repo) */}
      {tabOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setTabOpen(null)} />
          <div
            className={`relative z-10 w-full max-w-2xl mx-4 rounded-2xl p-6 shadow-2xl transition-all ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-zinc-200'}`}
          >
            <div className="flex items-start justify-end -mt-2 -mr-2">
              <button
                onClick={() => setTabOpen(null)}
                className={`p-2 rounded-lg border ${settBtn}`}
                aria-label="close"
              >
                ✕
              </button>
            </div>

            {tabOpen === 'favs' && (
              <FavoritesTab
                favorites={favorites}
                onClearFavorites={() => setFavorites([])}
                isDark={isDark}
                onClose={() => setTabOpen(null)}
              />
            )}

            {tabOpen === 'about' && (
              <AboutTab isDark={isDark} totalCount={totalCount} onClose={() => setTabOpen(null)} />
            )}

            {tabOpen === 'repo' && <RepoTab isDark={isDark} onClose={() => setTabOpen(null)} />}

            {tabOpen === 'history' && (
              <HistoryTab
                history={history}
                onClearHistory={() => setHistory([])}
                isDark={isDark}
                onClose={() => setTabOpen(null)}
              />
            )}
          </div>
        </div>
      )}

      {/* keyboard help overlay */}
      {showKeyboardHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowKeyboardHelp(false)}
          />
          <div className="relative z-10 mx-4">
            <KeyboardHelp isDark={isDark} onClose={() => setShowKeyboardHelp(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
