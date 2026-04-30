// Note:
// This component is rendered off-screen and captured by html2canvas.
// Keep styling inline to ensure html2canvas captures consistent fonts/colors.

function IconDownload({ style = { width: 16, height: 16 } }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={style}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 10l5 5 5-5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15V3" />
    </svg>
  );
}

function IconCopy({ style = { width: 16, height: 16 } }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={style}>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path
        d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSlack({ style = { width: 16, height: 16 } }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={style}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 3h3a2 2 0 012 2v3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 21H7a2 2 0 01-2-2v-3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 14v-4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10v4" />
    </svg>
  );
}

function IconWhatsApp({ style = { width: 16, height: 16 } }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={style}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 11.5a8.38 8.38 0 01-1.9 5.4l-.1.1a8.6 8.6 0 01-3.5 2.6l-1 .4a4.2 4.2 0 01-3.7-.9L9 17l.6-1.4a4.2 4.2 0 00.2-3.6L9 10"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 7.5l-.5.5" />
    </svg>
  );
}

function IconTwitter({ style = { width: 16, height: 16 } }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={style}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0012 7v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
      />
    </svg>
  );
}

function IconLinkedIn({ style = { width: 16, height: 16 } }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={style}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-14h4v2"
      />
      <rect x="2" y="9" width="4" height="11" rx="1" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function ShareCard({ excuse, situation, tone, cardRef }) {
  return (
    <div
      ref={cardRef}
      style={{
        position: 'fixed',
        left: '-9999px',
        top: 0,
        width: '600px',
        background: '#0f1724',
        borderRadius: '16px',
        padding: '32px 36px',
        fontFamily: 'Inter, ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
        border: '1px solid rgba(255,255,255,0.03)',
        color: '#e6eef8',
      }}
    >
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#ef4444',
              display: 'inline-block',
            }}
          />
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#eab308',
              display: 'inline-block',
            }}
          />
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#22c55e',
              display: 'inline-block',
            }}
          />
        </div>
        <div style={{ marginLeft: 6, fontSize: 12, color: '#9aa4b2', letterSpacing: 0.8 }}>
          excusify — bash
        </div>
      </div>

      {/* excuse */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 28 }}>
        <span style={{ color: '#34d399', fontSize: 15, marginTop: 2, flexShrink: 0 }}>$</span>
        <p
          style={{
            color: '#eef2ff',
            fontSize: 16,
            lineHeight: 1.6,
            margin: 0,
            whiteSpace: 'pre-wrap',
          }}
        >
          {excuse}
        </p>
      </div>

      {/* share options */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 10px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.03)',
            }}
          >
            <IconDownload />
            <span style={{ fontSize: 12, color: '#b6c3d6' }}>save image</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 10px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.03)',
            }}
          >
            <IconCopy />
            <span style={{ fontSize: 12, color: '#b6c3d6' }}>copy text</span>
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 10px',
              borderRadius: 8,
              background: '#1da1f2',
            }}
          >
            <IconTwitter />
            <span style={{ fontSize: 12, color: '#fff' }}>twitter</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 10px',
              borderRadius: 8,
              background: '#0A66C2',
            }}
          >
            <IconLinkedIn />
            <span style={{ fontSize: 12, color: '#fff' }}>linkedin</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 10px',
              borderRadius: 8,
              background: '#274060',
            }}
          >
            <IconSlack />
            <span style={{ fontSize: 12, color: '#e6eef8' }}>slack</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 10px',
              borderRadius: 8,
              background: '#0f766e',
            }}
          >
            <IconWhatsApp />
            <span style={{ fontSize: 12, color: '#e6eef8' }}>whatsapp</span>
          </div>
        </div>
      </div>

      {/* footer meta */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.03)',
          paddingTop: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span
            style={{
              fontSize: 11,
              color: '#34d399',
              background: 'rgba(52,211,153,0.06)',
              border: '1px solid rgba(52,211,153,0.12)',
              borderRadius: 6,
              padding: '4px 10px',
            }}
          >
            {situation}
          </span>
          <span
            style={{
              fontSize: 11,
              color: '#93a0b3',
              background: 'rgba(147,160,179,0.04)',
              border: '1px solid rgba(147,160,179,0.06)',
              borderRadius: 6,
              padding: '4px 10px',
            }}
          >
            {tone}
          </span>
        </div>
        <span style={{ fontSize: 11, color: '#6b7480', letterSpacing: 0.5 }}>
          excusify.vercel.app
        </span>
      </div>
    </div>
  );
}
