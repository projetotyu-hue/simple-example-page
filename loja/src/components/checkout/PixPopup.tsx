import { useState, useEffect } from 'react'
import { Copy, Clock, ShieldCheck, X, Check, Loader2 } from 'lucide-react'
import { useCheckout } from '../../context/CheckoutContext'
import { useNavigate } from 'react-router-dom'

interface PixPopupProps {
  onClose: () => void
  amount: number
  nextUpsell?: string // '/upsell2', '/upsell3', '/compra-realizada'
}

export default function PixPopup({ onClose, amount, nextUpsell }: PixPopupProps) {
  const { createPayment } = useCheckout()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pixData, setPixData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes
  const [paid, setPaid] = useState(false)

  // Generate PIX on mount
  useEffect(() => {
    async function generatePix() {
      try {
        const order = {
          customer: { fullName: 'Upsell', cpf: '00000000000', email: 'upsell@loja.com', phone: '00000000000' },
          address: { cep: '', address: '', number: '', complement: '', neighborhood: '', city: '', state: '' },
          shipping: null,
          payment: { method: 'pix' as const, status: 'pending' as const, transactionId: null, provider: null },
          totals: { subtotal: amount, shipping: 0, upsell: 0, total: amount },
          items: [],
        }
        const result = await createPayment(order)
        setPixData(result)
      } catch (e: any) {
        console.error('Erro ao gerar PIX upsell:', e)
        setError(e.message || 'Erro ao gerar PIX')
      } finally {
        setLoading(false)
      }
    }
    generatePix()
  }, [amount])

  // Countdown timer
  useEffect(() => {
    if (paid || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0)
    }, 1000)
    return () => clearInterval(timer)
  }, [paid, timeLeft])

  // Listen for payment status via Supabase (realtime)
  useEffect(() => {
    if (!pixData?.transactionId || paid) return
    let channel: any
    import('../../integrations/supabase/client').then(({ supabase }) => {
      channel = supabase
        .channel(`pix-status-${pixData.transactionId}`)
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
              setPaid(true)
              setTimeout(() => {
                if (nextUpsell) {
                  navigate(nextUpsell)
                } else {
                  navigate('/compra-realizada')
                }
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
  }, [pixData, paid, navigate, nextUpsell])

  const handleCopy = () => {
    if (!pixData?.copyPaste) return
    navigator.clipboard.writeText(pixData.copyPaste)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const formatPrice = (p: number) => p.toFixed(2).replace('.', ',')

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
        <div className="bg-[#F8F9FA] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
          <div className="bg-white flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-rose-600" size={48} />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
        <div className="bg-[#F8F9FA] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
          <div className="bg-white flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="w-8" />
            <h2 className="text-[13px] font-bold text-gray-800">Erro</h2>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <X size={18} />
            </button>
          </div>
          <div className="p-5 text-center">
            <p className="text-red-500 text-sm mb-4">{error}</p>
            <button onClick={onClose} className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm">
              Fechar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-[#F8F9FA] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="bg-white flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="w-8" />
          <h2 className="text-[13px] font-bold text-gray-800">Pagamento PIX</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Secure Banner */}
        <div className="bg-[#eafaf1] py-2 flex justify-center items-center gap-1.5 border-b border-green-100">
          <ShieldCheck size={14} className="text-[#16a34a]" />
          <span className="text-[11px] text-[#16a34a] font-medium">Pagamento seguro</span>
        </div>

        {paid ? (
          /* Payment Success */
          <div className="p-10 text-center">
            <Check size={64} className="text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-800 mb-2">Pagamento Confirmado!</h3>
            <p className="text-xs text-gray-500">Redirecionando...</p>
          </div>
        ) : (
          <>
            {/* Main Content */}
            <div className="p-5 bg-white mb-2">
              <h3 className="text-[17px] font-bold text-gray-800 mb-4">Pague com PIX</h3>

              <p className="text-[11px] font-bold text-gray-700 mb-2">Código PIX Copia e Cola</p>

              <div className="bg-[#f4f4f5] border border-gray-200 rounded-lg p-3 mb-4">
                <p className="text-[10px] text-gray-500 break-all leading-relaxed font-mono">
                  {pixData?.copyPaste}
                </p>
              </div>

              <button
                onClick={handleCopy}
                className="w-full py-3.5 rounded-lg text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                style={{ backgroundColor: '#E1143C' }}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? 'Código copiado!' : 'Copiar código PIX'}
              </button>
            </div>

            {/* Instructions */}
            <div className="p-5 bg-white">
              <p className="text-[11px] font-bold text-gray-700 mb-4">Como pagar</p>

              <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-800">Copie o código</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Clique no botão acima para copiar o código PIX.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-800">Abra o app do seu banco</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Acesse a área PIX do aplicativo do seu banco ou instituição financeira.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-800">Cole o código e pague</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Selecione "PIX Copia e Cola", cole o código e confirme o pagamento.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-white p-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] text-gray-500">Total a pagar</span>
              <span className="text-lg font-bold text-[#E1143C]">R$ {formatPrice(amount)}</span>
            </div>
            <div className="bg-white pb-4 flex justify-center">
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                <Clock size={12} />
                <span>Expira em: <span className="font-bold">{formatTime(timeLeft)}</span></span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
