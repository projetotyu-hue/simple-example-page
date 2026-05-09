import { ShoppingCart } from 'lucide-react'

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
        <ShoppingCart size={20} style={{ color: '#FF2D55' }} />
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
