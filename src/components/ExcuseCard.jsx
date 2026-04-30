import { useRef } from 'react';
import ShareCard from './Sharecard';

const IconStar = ({ filled, className = 'w-5 h-5' }) =>
  filled ? (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  ) : (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.174c.969 0 1.371 1.24.588 1.81l-3.38 2.46a1 1 0 00-.364 1.118l1.287 3.967c.3.921-.755 1.688-1.538 1.118l-3.38-2.46a1 1 0 00-1.176 0l-3.38 2.46c-.783.57-1.838-.197-1.538-1.118l1.287-3.967a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.174a1 1 0 00.95-.69L11.05 2.927z"
      />
    </svg>
  );

const IconCheck = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const IconX = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconCopy = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden
  >
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path
      d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconDownload = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 10l5 5 5-5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15V3" />
  </svg>
);

const IconTwitter = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0012 7v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
    />
  </svg>
);

const IconLinkedIn = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-14h4v2"
    />
    <rect x="2" y="9" width="4" height="11" rx="1" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function ExcuseCard({
  excuse,
  situation,
  tone,
  onCopy,
  copied,
  onRate,
  rated,
  isFavorite,
  onFavorite,
  isDark,
}) {
  if (!excuse) return null;

  const cardClass = isDark
    ? 'border-zinc-700 bg-zinc-900/60 backdrop-blur'
    : 'border-zinc-200 bg-zinc-50';
  const divider = isDark ? 'border-zinc-800' : 'border-zinc-200';
  const textClass = isDark ? 'text-zinc-100' : 'text-zinc-800';
  const inactiveBtn = isDark
    ? 'border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
    : 'border-zinc-300 text-zinc-400 hover:border-zinc-400 hover:text-zinc-600';

  const shareRef = useRef(null);

  // share as image
  async function handleShareImage() {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(shareRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });
      canvas.toBlob(blob => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'excusify.png';
        link.click();
        URL.revokeObjectURL(url);
      });
    } catch (e) {
      console.error('Share image failed:', e);
    }
  }

  //  slack deep link
  function handleSlackShare() {
    const text = encodeURIComponent(
      `*Excuse [${situation} · ${tone}]*\n${excuse}\n_via excusify.vercel.app_`,
    );
    window.open(`slack://open?team=&channel=&message=${text}`, '_blank');
  }

  //  whatsapp share
  function handleWhatsAppShare() {
    const text = encodeURIComponent(
      `*${situation}* (${tone})\n\n${excuse}\n\n_via excusify.vercel.app_`,
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }

  // twitter share
  function handleTwitterShare() {
    const text = encodeURIComponent(`${excuse} — ${situation} (${tone})`);
    const url = encodeURIComponent('https://excusify.vercel.app');
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  }

  // linkedin share
  function handleLinkedInShare() {
    const url = encodeURIComponent('https://excusify.vercel.app');
    const title = encodeURIComponent(`${situation} — Excuse`);
    const summary = encodeURIComponent(excuse);
    window.open(
      `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${summary}`,
      '_blank',
    );
  }

  //  copy as slack block
  function handleCopySlack() {
    const block = `*Excuse · ${situation} · ${tone}*\n>${excuse}\n_excusify.vercel.app_`;
    navigator.clipboard.writeText(block).catch(() => {});
  }

  return (
    <>
      {/* hidden card for html2canvas */}
      <ShareCard cardRef={shareRef} excuse={excuse} situation={situation} tone={tone} />

      <div className={`card border rounded-xl p-5 space-y-4 ${cardClass}`}>
        {/* excuse and favorite */}
        <div className="flex items-start gap-3">
          <span className="text-emerald-400 font-mono text-sm mt-0.5 select-none">$</span>
          <p className={`font-mono text-sm leading-relaxed flex-1 ${textClass}`}>{excuse}</p>
          <button
            onClick={onFavorite}
            title={isFavorite ? 'unfavorite' : 'save to favorites'}
            className={`shrink-0 transition-all cursor-pointer mt-0.5 flex items-center justify-center
              ${isFavorite ? 'text-yellow-400' : isDark ? 'text-zinc-700 hover:text-yellow-400' : 'text-zinc-300 hover:text-yellow-500'}`}
          >
            <IconStar filled={isFavorite} className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded border ${isDark ? 'border-zinc-700 text-zinc-500' : 'border-zinc-200 text-zinc-500'}`}
          >
            {situation}
          </span>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded border ${isDark ? 'border-zinc-700 text-zinc-500' : 'border-zinc-200 text-zinc-500'}`}
          >
            {tone}
          </span>
        </div>

        <div className={`border-t ${divider} pt-3 space-y-2`}>
          {/* rate and copy */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-2">
              <button
                onClick={() => onRate('believable')}
                className={`text-xs font-mono px-3 py-1 rounded-md border transition-all cursor-pointer flex items-center gap-2
                  ${rated === 'believable' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : inactiveBtn}`}
              >
                <IconCheck className="w-3.5 h-3.5" />
                believable
              </button>
              <button
                onClick={() => onRate('obvious')}
                className={`text-xs font-mono px-3 py-1 rounded-md border transition-all cursor-pointer flex items-center gap-2
                  ${rated === 'obvious' ? 'border-red-500 bg-red-500/10 text-red-400' : inactiveBtn}`}
              >
                <IconX className="w-3.5 h-3.5" />
                too obvious
              </button>
            </div>
            <button
              onClick={onCopy}
              className={`text-xs font-mono px-3 py-1 rounded-md border transition-all cursor-pointer flex items-center gap-2
                ${copied ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : inactiveBtn}`}
            >
              {copied ? (
                <>
                  <IconCheck className="w-3.5 h-3.5" /> copied!
                </>
              ) : (
                <>
                  <IconCopy className="w-3.5 h-3.5" /> copy
                </>
              )}
            </button>
          </div>

          {/* share actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleShareImage}
              className={`text-xs font-mono px-3 py-1 rounded-md border transition-all cursor-pointer ${inactiveBtn} flex items-center gap-2`}
            >
              <IconDownload className="w-3.5 h-3.5" /> save image
            </button>
            <button
              onClick={handleCopySlack}
              className={`text-xs font-mono px-3 py-1 rounded-md border transition-all cursor-pointer ${inactiveBtn} flex items-center gap-2`}
            >
              slack block
            </button>
            <button
              onClick={handleSlackShare}
              className={`text-xs font-mono px-3 py-1 rounded-md border transition-all cursor-pointer ${inactiveBtn} flex items-center gap-2`}
            >
              <IconTwitter className="w-3.5 h-3.5" /> twitter
            </button>
            <button
              onClick={handleLinkedInShare}
              className={`text-xs font-mono px-3 py-1 rounded-md border transition-all cursor-pointer ${inactiveBtn} flex items-center gap-2`}
            >
              <IconLinkedIn className="w-3.5 h-3.5" /> linkedin
            </button>
            <button
              onClick={handleWhatsAppShare}
              className={`text-xs font-mono px-3 py-1 rounded-md border transition-all cursor-pointer ${inactiveBtn} flex items-center gap-2`}
            >
              <IconDownload className="w-3.5 h-3.5" /> whatsapp
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
