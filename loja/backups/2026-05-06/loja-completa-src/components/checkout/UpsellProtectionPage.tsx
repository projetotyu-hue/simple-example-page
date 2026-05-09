import { Shield, CheckCircle2, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PixPopup from './PixPopup'

export default function UpsellProtectionPage() {
  const navigate = useNavigate()
  const [showPix, setShowPix] = useState(false)

  const handleGeneratePix = () => {
    setShowPix(true)
  }

  const handlePixClose = () => {
    setShowPix(false)
  }

  return (
    <div className="min-h-screen bg-[#f1f2f6] flex flex-col items-center py-6 px-4">
      {/* Top Logo */}
      <div className="flex justify-center mb-4">
        <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
          <Shield size={20} />
        </div>
      </div>

      {/* Success Banner */}
      <div className="w-full max-w-md bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 mb-4 shadow-sm flex items-start gap-3">
        <CheckCircle2 className="text-[#16a34a] shrink-0 mt-0.5" size={24} />
        <div>
          <h2 className="text-[#15803d] font-bold text-sm">Pedido Realizado com Sucesso!</h2>
          <p className="text-[#16a34a] text-xs">Seu pedido foi confirmado e está sendo processado</p>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="w-full max-w-md bg-[#fff7ed] border border-[#ffedd5] rounded-xl p-4 mb-6 shadow-sm flex items-start gap-3">
        <AlertTriangle className="text-[#ea580c] shrink-0 mt-0.5" size={24} />
        <div>
          <h3 className="text-[#ea580c] font-bold text-sm">Atenção: Proteção Anti-Roubo</h3>
          <p className="text-[#9a3412] text-xs leading-relaxed mt-1">
            Para garantir a segurança total da sua compra, é necessário ativar o Seguro Anti-Roubo no valor de <strong>R$ 26,14</strong>.
          </p>
        </div>
      </div>

      {/* Product Card */}
      <div className="w-full max-w-md bg-white rounded-xl p-5 mb-4 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
            <Shield size={24} className="text-[#00C4A7]" />
          </div>
          <div className="flex-1">
            <p className="text-[12px] font-bold text-gray-800 leading-tight">Seguro Anti-Roubo Total</p>
            <p className="text-[11px] text-gray-500">Proteção completa contra roubo e furto</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-gray-400 line-through">R$ 382,00</p>
            <p className="text-[14px] font-bold text-[#00C4A7]">R$ 26,14</p>
          </div>
        </div>

        <button
          onClick={handleGeneratePix}
          className="w-full bg-[#00C4A7] text-white font-medium py-3.5 rounded-lg text-[15px] flex items-center justify-center gap-2 hover:bg-[#00b894] transition-colors shadow-sm"
        >
          <Shield size={16} />
          Gerar código PIX
        </button>
      </div>

      {/* Info Box */}
      <div className="w-full max-w-md bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-start gap-2">
          <Shield size={16} className="text-[#00C4A7] shrink-0 mt-0.5" />
          <div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              O Seguro Anti-Roubo garante a reposição do seu produto em caso de roubo ou furto durante o transporte.
              <strong>Ativação imediata</strong> após o pagamento do PIX.
            </p>
          </div>
        </div>
      </div>

      {/* PixPopup */}
      {showPix && <PixPopup onClose={handlePixClose} amount={26.14} />}
    </div>
  )
}
