import { useState } from 'react'
import { useCheckout } from '../../context/CheckoutContext'

// Static PIX code - in production, this would come from backend
const PIX_CODE = '00020126580014BR.GOV.BCB.PIX0136aec6a3e8-1234-4b56-7890-abcd1234567895204000053039865802BR5925Loja Garimpo LTDA6009SAO PAULO62290525ch_1234567890abcdef6304A1B2'

export default function PIXCodeDisplay() {
  const [copied, setCopied] = useState(false)
  const { dispatch } = useCheckout()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PIX_CODE)
      setCopied(true)
      dispatch({ type: 'SET_PIX_COPIED', payload: true })
      setTimeout(() => {
        setCopied(false)
        dispatch({ type: 'SET_PIX_COPIED', payload: false })
      }, 2000)
    } catch {
      // Fallback for non-HTTPS
      const textarea = document.createElement('textarea')
      textarea.value = PIX_CODE
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      dispatch({ type: 'SET_PIX_COPIED', payload: true })
      setTimeout(() => {
        setCopied(false)
        dispatch({ type: 'SET_PIX_COPIED', payload: false })
      }, 2000)
    }
  }

  return (
    <div>
      <p className="text-sm font-medium text-[#1A1A1A] mb-2">Código PIX Copia e Cola</p>
      <div className="bg-[#F5F5F5] rounded-lg p-4 mb-3">
        <p
          className="text-xs font-mono text-[#1A1A1A] break-all leading-relaxed"
          style={{ fontFamily: 'monospace' }}
        >
          {PIX_CODE}
        </p>
      </div>
      <button
        onClick={handleCopy}
        className="w-full font-semibold transition-colors checkout-btn"
        style={{
          backgroundColor: copied ? '#22C55E' : '#FF0040',
          color: '#FFFFFF',
          borderRadius: '10px',
          height: '48px',
          fontSize: '15px',
        }}
      >
        {copied ? 'Código copiado!' : 'Copiar código PIX'}
      </button>
    </div>
  )
}
