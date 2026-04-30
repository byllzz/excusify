import { useEffect } from 'react';

export default function KeyboardHelp({ onClose, isDark }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose?.();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className={`w-full max-w-md p-6 rounded-2xl ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-zinc-200'}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className={`font-mono font-semibold text-sm ${isDark ? 'text-white' : 'text-zinc-900'}`}
        >
          Keyboard Shortcuts
        </h3>
        <button onClick={() => onClose?.()} className="text-xs font-mono px-2 py-1 rounded border">
          Close
        </button>
      </div>

      <ul className={`space-y-2 text-sm font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
        <li>
          <strong>Space</strong>: Generate excuse
        </li>
        <li>
          <strong>S</strong>: Focus Situation picker
        </li>
        <li>
          <strong>T</strong>: Focus Tone picker
        </li>
        <li>
          <strong>C</strong>: Copy current excuse
        </li>
        <li>
          <strong>F</strong>: Favorite/Unfavorite current excuse
        </li>
        <li>
          <strong>?</strong>: Open this help panel
        </li>
      </ul>
    </div>
  );
}
