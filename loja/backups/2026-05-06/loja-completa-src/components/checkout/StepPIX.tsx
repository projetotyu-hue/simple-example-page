import { useState, useEffect } from 'react'
import { useCheckout } from '../../context/CheckoutContext'
import { Copy, Loader2 } from 'lucide-react'

export default function StepPIX() {
  const { state, dispatch } = useCheckout()
  const [copied, setCopied] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)

  const pixCode = "00020101021226820014br.gov.bcb.pix2560pix.stone.com.br/pix/v2/9ae19313-0562-47a2-aadc-69662a781b85520400005303986540529.905802BR5925Pagar Me Instituicao De P6014RIO DE JANEIRO62290525fa54f664a51b85b01a2194da76304634A"

  const handleCopy = () => {
    navigator.clipboard.writeText(pixCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  useEffect(() => {
    // Apenas manter a lógica do timer ou pausar se necessário,
    // mas sem redirecionar.
  }, [dispatch])

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 w-full bg-white flex flex-col pt-4 pb-10 px-4">
      {/* Container Principal do PIX */}
      <div className="border border-green-200 bg-[#f3fcf6] rounded-xl p-5 w-full flex flex-col items-center mb-6 shadow-sm">
        <h3 className="text-[#15803d] font-bold text-sm uppercase tracking-wide mb-4">
          COPIE O CODIGO PIX ABAIXO
        </h3>
        
        <div className="w-full bg-white border border-green-200 rounded-lg p-3 mb-4 shadow-inner">
          <p className="text-[11px] font-mono text-gray-700 break-all leading-relaxed text-center opacity-80">
            {pixCode}
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="w-full bg-[#34d399] hover:bg-[#10b981] transition-colors text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 text-sm uppercase shadow-sm"
        >
          <Copy size={18} />
          {copied ? 'CÓDIGO COPIADO!' : 'COPIAR CODIGO PIX'}
        </button>
      </div>

      {/* Divisor */}
      <div className="flex items-center w-full mb-6">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="px-4 text-xs font-medium text-gray-400">ou escaneie</span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      {/* QR Code */}
      <div className="flex justify-center mb-6">
        <div className="bg-white p-3 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100">
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(pixCode)}`} 
            alt="QR Code PIX" 
            className="w-36 h-36"
          />
        </div>
      </div>

      {/* Como Pagar Instructions */}
      <div className="bg-[#f0f7ff] rounded-xl p-5 mb-8 border border-blue-50">
        <h4 className="text-[#1e3a8a] font-bold text-center mb-3">Como pagar:</h4>
        <ul className="text-sm text-[#2563eb] space-y-2 font-medium">
          <li>1. Copie o codigo PIX acima</li>
          <li>2. Abra seu banco ou app de pagamentos</li>
          <li>3. Cole o codigo e confirme</li>
        </ul>
      </div>

      {/* Loading Spinner */}
      <div className="flex items-center justify-center gap-2 text-gray-500">
        <Loader2 className="animate-spin text-yellow-400" size={20} />
        <span className="text-sm font-medium">Aguardando pagamento...</span>
      </div>
    </div>
  )
}
