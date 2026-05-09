import { useState, useEffect } from 'react'
import { Copy, Loader2, Check, CheckCircle2, ArrowLeft } from 'lucide-react'
import { useCheckout } from '../../context/CheckoutContext'
import { useNavigate } from 'react-router-dom'

export default function StepPIX() {
  const { state, dispatch } = useCheckout()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)

  // Lê dados do contexto (já criado no StepRevisao)
  const pixData = state.pixData

  useEffect(() => {
    if (!pixData) {
      // Se não tem dados, volta para o step 1
      dispatch({ type: 'SET_STEP', payload: 1 })
      navigate('/carrinho')
    }
  }, [])

  // Real-time status update via Supabase
  useEffect(() => {
    if (!pixData?.transactionId || paymentComplete) return

    let channel: any
    import('../../integrations/supabase/client').then(({ supabase }) => {
      channel = supabase
        .channel(`order-status-${pixData.transactionId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'orders',
            filter: `transaction_id=eq.${pixData.transactionId}`,
          },
          (payload: any) => {
            if (payload.new?.status === 'paid') {
              setPaymentComplete(true)
              dispatch({ type: 'PAUSE_TIMER' })
              // Redireciona para upsell1 após pagar
              setTimeout(() => {
                navigate('/upsell1')
              }, 2000)
            }
          }
        )
        .subscribe()
    })

    return () => {
      if (channel) {
        import('../../integrations/supabase/client').then(({ supabase }) => {
          supabase.removeChannel(channel)
        })
      }
    }
  }, [pixData, paymentComplete, dispatch, navigate])

  const handleCopy = async () => {
    if (!pixData?.copyPaste) return
    try {
      await navigator.clipboard.writeText(pixData.copyPaste)
      setCopied(true)
      dispatch({ type: 'SET_PIX_COPIED', payload: true })
      setTimeout(() => setCopied(false), 3000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = pixData.copyPaste
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }

  if (!pixData) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-300 w-full bg-white flex flex-col pt-4 pb-10 px-4">
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-rose-600 mb-4" size={48} />
          <p className="text-gray-500 text-sm">Carregando...</p>
        </div>
      </div>
    )
  }

  if (paymentComplete) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-300 w-full bg-white flex flex-col pt-4 pb-10 px-4">
        <div className="flex flex-col items-center justify-center py-20">
          <CheckCircle2 className="text-green-500 mb-4" size={64} />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Pagamento Confirmado!</h2>
          <p className="text-gray-500 text-sm">Redirecionando...</p>
        </div>
      </div>
    )
  }

  // Format countdown from context timer
  const minutes = String(Math.floor(state.timerSeconds / 60)).padStart(2, '0')
  const seconds = String(state.timerSeconds % 60).padStart(2, '0')

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 w-full bg-white flex flex-col pt-4 pb-10 px-4">
      {/* Header */}
      <div className="w-full flex items-center mb-4">
        <button onClick={() => navigate('/carrinho')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-800 ml-2">Pagamento PIX</h1>
      </div>

      {/* QR Code */}
      {pixData?.qrCodeBase64 && (
        <div className="flex flex-col items-center mb-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <img src={pixData.qrCodeBase64} alt="QR Code PIX" className="w-48 h-48" />
          </div>
          <p className="text-xs text-gray-400 mt-2">Escaneie o código com seu app de banco</p>
        </div>
      )}

      {/* Copy Paste */}
      <div className="w-full mb-6">
        <label className="text-xs text-gray-500 mb-1 block">Código PIX (Copia e Cola)</label>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={pixData?.copyPaste || ''}
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 flex items-center gap-1"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>
      </div>

      {/* Timer */}
      <div className="w-full bg-gray-50 rounded-xl p-4 mb-6 text-center">
        <p className="text-xs text-gray-500 mb-1">Expira em:</p>
        <p className="text-2xl font-bold text-rose-600">
          {minutes}:{seconds}
        </p>
      </div>

      {/* Instructions */}
      <div className="w-full bg-blue-50 rounded-xl p-4 mb-6">
        <h3 className="text-sm font-bold text-blue-800 mb-2">Como pagar:</h3>
        <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
          <li>Abra o app do seu banco</li>
          <li>Escolha a opção PIX</li>
          <li>Escaneie o QR Code ou cole o código acima</li>
          <li>Confirme o pagamento</li>
        </ol>
      </div>
    </div>
  )
}
