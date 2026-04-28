// This component is rendered off-screen and captured by html2canvas.
// It's always dark-themed for a consistent share card look.

export default function ShareCard({ excuse, situation, tone, cardRef }) {
  return (
    <div
      ref={cardRef}
      style={{
        position: 'fixed',
        left: '-9999px',
        top: 0,
        width: '600px',
        background: '#18181b',
        borderRadius: '16px',
        padding: '36px 40px',
        fontFamily: 'monospace',
        border: '1px solid #3f3f46',
      }}
    >
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#eab308', display: 'inline-block' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
        <span style={{ marginLeft: 10, fontSize: 11, color: '#52525b', letterSpacing: 1 }}>excusify — bash</span>
      </div>

      {/* excuse */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 28 }}>
        <span style={{ color: '#4ade80', fontSize: 14, marginTop: 2, flexShrink: 0 }}>$</span>
        <p style={{ color: '#f4f4f5', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
          {excuse}
        </p>
      </div>

      {/* footer meta */}
      <div style={{
        borderTop: '1px solid #27272a',
        paddingTop: 16,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{
            fontSize: 11, color: '#4ade80', background: 'rgba(74,222,128,0.08)',
            border: '1px solid rgba(74,222,128,0.25)', borderRadius: 6, padding: '2px 10px',
          }}>
            {situation}
          </span>
          <span style={{
            fontSize: 11, color: '#a1a1aa', background: 'rgba(161,161,170,0.08)',
            border: '1px solid rgba(161,161,170,0.2)', borderRadius: 6, padding: '2px 10px',
          }}>
            {tone}
          </span>
        </div>
        <span style={{ fontSize: 11, color: '#3f3f46', letterSpacing: 0.5 }}>excusify.vercel.app</span>
      </div>
    </div>
  )
}
