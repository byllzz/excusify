import { useEffect } from "react"

export default function FavoritesTab({ favorites, onClearFavorites, isDark , onClose}) {
  const entryBg = isDark ? 'bg-zinc-800/50 border-zinc-700' : 'bg-zinc-50 border-zinc-200'
  const metaCl  = isDark ? 'text-zinc-600' : 'text-zinc-400'
  const textCl  = isDark ? 'text-zinc-300' : 'text-zinc-600'
  const clearCl = isDark
    ? 'border-zinc-700 text-zinc-500 hover:text-zinc-200 hover:border-zinc-500'
    : 'border-zinc-300 text-zinc-400 hover:text-zinc-700 hover:border-zinc-400'

  useEffect(() => {
    if (!onClose) return;
    function handleKey(e) {
      if(e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p
          className={`text-[10px] font-mono font-semibold uppercase tracking-widest mb-3
      ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}
          isDark={isDark}
        >
          starred ({favorites.length})
        </p>
        {favorites.length > 0 && (
          <button
            onClick={onClearFavorites}
            className={`text-xs font-mono px-3 py-1 rounded-lg border transition-all cursor-pointer -mt-3 ${clearCl}`}
          >
            clear all
          </button>
        )}
      </div>
      {favorites.length === 0 ? (
        <p className={`text-xs font-mono ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
          no favorites yet — star an excuse to save it
        </p>
      ) : (
        <div className="space-y-2">
          {favorites.map((item, i) => (
            <div
              key={i}
              className={`text-xs font-mono rounded-xl border p-3 flex gap-2.5 ${entryBg}`}
            >
              <span className="text-yellow-400 flex-shrink-0 mt-0.5">★</span>
              <div>
                <span className={textCl}>{item.excuse}</span>
                <div className={`mt-1.5 text-[10px] ${metaCl}`}>
                  {item.situation} · {item.tone}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
