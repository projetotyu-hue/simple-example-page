export default function LoadingMessage() {
  return (
    <div className="flex items-start gap-2 px-4 py-2">
      <div
        className="flex items-center justify-center shrink-0"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#FFEDEE',
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF2D55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="8" cy="21" r="1"></circle>
          <circle cx="19" cy="21" r="1"></circle>
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
        </svg>
      </div>
      <div
        className="py-3 px-4"
        style={{
          backgroundColor: '#F5F5F5',
          borderRadius: '12px',
          padding: '12px',
        }}
      >
        <div className="flex items-center gap-1">
          <span className="dot-animate" style={{ animation: 'dotPulse 1.2s infinite' }}>.</span>
          <span className="dot-animate" style={{ animation: 'dotPulse 1.2s infinite 0.2s' }}>.</span>
          <span className="dot-animate" style={{ animation: 'dotPulse 1.2s infinite 0.4s' }}>.</span>
        </div>
      </div>
    </div>
  )
}
