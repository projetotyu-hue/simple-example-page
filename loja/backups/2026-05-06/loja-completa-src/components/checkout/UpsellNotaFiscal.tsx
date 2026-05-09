import { ShieldCheck, CheckCircle2, Package, AlertTriangle, Truck, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import PixPopup from './PixPopup'

export default function UpsellNotaFiscal() {
  const navigate = useNavigate()
  const [showPix, setShowPix] = useState(false)

  const handleGeneratePix = () => {
    setShowPix(true)
  }

  const currentDate = new Date().toLocaleDateString('pt-BR')
  const currentTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="min-h-screen bg-[#f1f2f6] flex flex-col items-center py-6 px-4">
      
      {/* Top Banner & Logo */}
      <div className="w-full max-w-md bg-white rounded-t-xl p-6 flex flex-col items-center justify-center">
        <div className="flex items-center gap-2 mb-6">
          <div className="text-[#34d399] font-black text-4xl tracking-tighter">NF<span className="text-[#fbbf24]">e</span></div>
          <div className="flex flex-col text-[10px] font-bold text-[#fbbf24] leading-tight uppercase">
            <span>Nota Fiscal</span>
            <span>Eletrônica</span>
            <span>Ouro</span>
          </div>
        </div>
        
        <h2 className="text-[17px] font-black text-gray-800 mb-2">Seu pedido foi realizado com sucesso!</h2>
        <p className="text-xs text-gray-500 text-center leading-relaxed">
          Para finalizar o processo de envio, e necessario efetuar o pagamento da Taxa de Emissao da Nota Fiscal (TENF) no valor de <strong>R$ 17,20</strong>.
        </p>
      </div>

      <div className="w-full max-w-md bg-white p-5">
        {/* Red Warning Banner */}
        <div className="bg-[#ef4444] rounded-lg p-4 text-center text-white mb-8 shadow-md">
          <h3 className="font-bold text-[13px] tracking-wide mb-1">AVISO</h3>
          <p className="text-[10px] font-medium leading-relaxed">
            O nao pagamento da TENF resultara no cancelamento do pedido e anotacao no CPF.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative pl-6 mb-8 border-l-2 border-gray-100 ml-4 space-y-8">
          
          {/* Step 1 */}
          <div className="relative">
            <div className="absolute -left-[35px] top-0 bg-[#f0fdf4] border border-[#86efac] rounded-full w-8 h-8 flex items-center justify-center">
              <CheckCircle2 className="text-[#22c55e] w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-gray-800 leading-none mb-1">Pedido Realizado</h4>
              <p className="text-[10px] text-gray-500 mb-0.5">Pedido confirmado com sucesso</p>
              <p className="text-[9px] text-gray-400">{currentDate} {currentTime}</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="absolute -left-[35px] top-0 bg-[#f0fdf4] border border-[#86efac] rounded-full w-8 h-8 flex items-center justify-center">
              <Package className="text-[#22c55e] w-4 h-4" />
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-gray-800 leading-none mb-1">Pedido pronto para envio</h4>
              <p className="text-[10px] text-gray-500 mb-0.5">Aguardando liberacao</p>
              <p className="text-[9px] text-gray-400">{currentDate} {currentTime}</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className="absolute -left-[35px] top-0 bg-[#fef2f2] border border-[#fca5a5] rounded-full w-8 h-8 flex items-center justify-center">
              <AlertTriangle className="text-[#ef4444] w-4 h-4" />
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-gray-800 leading-none mb-1">Taxa de nota fiscal</h4>
              <p className="text-[10px] text-gray-500">Aguardando pagamento da taxa TENF</p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative opacity-40">
            <div className="absolute -left-[35px] top-0 bg-[#f8fafc] border border-gray-200 rounded-full w-8 h-8 flex items-center justify-center">
              <Truck className="text-gray-400 w-4 h-4" />
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-gray-800 leading-none mb-1">Em transito</h4>
              <p className="text-[10px] text-gray-500">Passo anterior nao concluido</p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="relative opacity-40">
            <div className="absolute -left-[35px] top-0 bg-[#f8fafc] border border-gray-200 rounded-full w-8 h-8 flex items-center justify-center">
              <CheckCircle className="text-gray-400 w-4 h-4" />
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-gray-800 leading-none mb-1">Pedido Entregue</h4>
              <p className="text-[10px] text-gray-500">Passo anterior nao concluido</p>
            </div>
          </div>
        </div>

        {/* Note Gray Box */}
        <div className="bg-[#f8fafc] border border-gray-100 rounded-lg p-4 mb-8 text-[10px] text-gray-600 leading-relaxed">
          <strong>Nota:</strong> O nao pagamento da Nota Fiscal resulta no cancelamento do pedido, impossibilitando novas compras por um prazo maximo de 90 dias e anotacao no CPF.
        </div>

        {/* Checkout Section */}
        <div className="flex flex-col items-center">
          <h3 className="text-sm font-bold text-gray-800 mb-1">Pague via Pix</h3>
          <p className="text-[10px] text-gray-500 mb-3">O pagamento sera confirmado imediatamente</p>
          
          <div className="text-3xl font-black text-[#00c853] mb-6 tracking-tight">R$ 17,20</div>
          
          <button 
            onClick={handleGeneratePix}
            className="w-full bg-[#00c853] hover:bg-[#00e676] transition-colors text-white font-bold py-4 rounded-lg mb-4 text-[15px] shadow-lg shadow-green-200"
          >
            Efetuar pagamento
          </button>

          <div className="flex items-center gap-1.5 text-[#00c853] text-[10px] font-bold">
            <ShieldCheck size={14} />
            Ambiente seguro
          </div>
        </div>

      </div>
      
      {/* Footer rounded bottom */}
      <div className="w-full max-w-md bg-white rounded-b-xl h-4 mb-10"></div>

      {showPix && (
        <PixPopup onClose={() => setShowPix(false)} amount={17.20} />
      )}
    </div>
  )
}
