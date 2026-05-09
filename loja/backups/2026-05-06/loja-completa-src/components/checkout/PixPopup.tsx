import { useState, useEffect } from 'react'
import { Copy, Clock, ShieldCheck, X, Check } from 'lucide-react'

interface PixPopupProps {
  onClose: () => void
  amount: number
}

export default function PixPopup({ onClose, amount }: PixPopupProps) {
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const pixCode = "00020126880014br.gov.bcb.pix2566opsqrc.7trust.com.br/qr/v3/at/02e27a9c-233b-4791-9631-2bbf9c5060cf5204000053039865802BR5925HICONEX_TECNOLOGIA_E_PAGA6007GOIANIA62070503***6304745B"

  const handleCopy = () => {
    navigator.clipboard.writeText(pixCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatPrice = (p: number) => p.toFixed(2).replace('.', ',')

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-[#F8F9FA] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-white flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="w-8" /> {/* Spacer for centering */}
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

        {/* Main Content */}
        <div className="p-5 bg-white mb-2">
          <h3 className="text-[17px] font-bold text-gray-800 mb-4">Pague com PIX</h3>
          
          <p className="text-[11px] font-bold text-gray-700 mb-2">Código PIX Copia e Cola</p>
          
          <div className="bg-[#f4f4f5] border border-gray-200 rounded-lg p-3 mb-4">
            <p className="text-[10px] text-gray-500 break-all leading-relaxed font-mono">
              {pixCode}
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
      </div>
    </div>
  )
}
