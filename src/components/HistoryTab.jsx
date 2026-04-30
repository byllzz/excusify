import { useEffect, useState } from 'react';

export default function HistoryTab({ history, onClearHistory, isDark, onClose }) {
  const DEFAULT_SHOW = 10;
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    if (!onClose) return;
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p
            className={`text-xs font-mono font-semibold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}
          >
            Recent
          </p>
          <p className={`text-[10px] font-mono ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
            {history.length} items{' '}
            {history.length > DEFAULT_SHOW &&
              !showAll &&
              `(showing ${Math.min(DEFAULT_SHOW, history.length)})`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className={`text-xs font-mono px-3 py-1 rounded-lg border transition-all cursor-pointer ${isDark ? 'border-zinc-700 text-zinc-400 hover:text-zinc-200' : 'border-zinc-200 text-zinc-600 hover:text-zinc-800'}`}
            >
              Clear
            </button>
          )}
          {history.length > DEFAULT_SHOW && (
            <button
              onClick={() => setShowAll(s => !s)}
              className={`text-xs font-mono px-3 py-1 rounded-lg border transition-all cursor-pointer ${isDark ? 'border-zinc-700 text-zinc-400 hover:text-zinc-200' : 'border-zinc-200 text-zinc-600 hover:text-zinc-800'}`}
            >
              {showAll ? 'Show recent' : 'Show all'}
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className={`text-xs font-mono px-2 py-1 rounded-lg border ${isDark ? 'border-zinc-700 text-zinc-400' : 'border-zinc-200 text-zinc-600'}`}
            >
              Close
            </button>
          )}
        </div>
      </div>

      {history.length === 0 ? (
        <div
          className={`py-12 text-center text-sm font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}
        >
          No excuses generated yet
        </div>
      ) : (
        <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-2">
          {(showAll ? history : history.slice(0, DEFAULT_SHOW)).map((item, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl border ${isDark ? 'bg-zinc-800/40 border-zinc-700' : 'bg-white border-zinc-100'}`}
            >
              <p className={`text-sm font-mono ${isDark ? 'text-zinc-200' : 'text-zinc-700'}`}>
                {item.excuse}
              </p>
              <div
                className={`mt-2 flex items-center justify-between text-[11px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}
              >
                <span className="truncate">
                  {item.situation} · {item.tone}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(item.excuse);
                    }}
                    className="text-[11px] px-2 py-0.5 rounded border text-zinc-500 hover:bg-zinc-100"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
