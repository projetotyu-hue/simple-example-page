import { Lock, Loader2 } from 'lucide-react'
import type { CheckoutStep } from '../../types/checkout'

interface CheckoutFooterProps {
  step: CheckoutStep
  isSubmitting: boolean
  onClick: () => void
}

// O footer fixo só aparece no step 1
export default function CheckoutFooter({ step, isSubmitting, onClick }: CheckoutFooterProps) {
  if (step !== 1) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        background: '#fff',
        borderTop: '1px solid #f0f0f0',
        padding: '12px 16px',
        zIndex: 9999,
        boxSizing: 'border-box',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
      }}
    >
      {/* Barra de segurança */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginBottom: 8 }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span style={{ fontSize: 11, color: '#666' }}>Pagamento 100% seguro e criptografado</span>
      </div>

      <button
        onClick={onClick}
        disabled={isSubmitting}
        style={{
          width: '100%',
          height: 54,
          borderRadius: 12,
          background: isSubmitting ? '#c41232' : '#E1143C',
          color: '#fff',
          fontSize: 16,
          fontWeight: 700,
          border: 'none',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          transition: 'background 0.15s',
          WebkitTapHighlightColor: 'transparent',
          letterSpacing: 0.3,
        }}
        onTouchStart={(e) => { if (!isSubmitting) e.currentTarget.style.background = '#c41232' }}
        onTouchEnd={(e) => { if (!isSubmitting) e.currentTarget.style.background = '#E1143C' }}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Validando...</span>
          </>
        ) : (
          <>
            <Lock size={16} />
            <span>Continuar para revisão</span>
          </>
        )}
      </button>
    </div>
  )
}
