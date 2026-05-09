import { CheckCircle2, AlertTriangle, FileText, Package, Clock, ShieldCheck, Lock } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PixPopup from './PixPopup'

export default function UpsellAlfandega() {
  const navigate = useNavigate()
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minutes
  const [showPix, setShowPix] = useState(false)

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

  const handleGeneratePix = () => {
    setShowPix(true)
  }

  return (
    <div className="min-h-screen bg-[#f1f2f6] flex flex-col items-center py-6 px-4">
      {/* Top Logo - Assuming TikTok logo from reference or empty */}
      <div className="flex justify-center mb-4">
        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold italic text-xs">
          TikTok
        </div>
      </div>

      {/* Success Banner */}
      <div className="w-full max-w-md bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 mb-4 shadow-sm flex items-start gap-3">
        <CheckCircle2 className="text-[#16a34a] shrink-0 mt-0.5" size={24} />
        <div>
          <h2 className="text-[#15803d] font-bold text-sm">Pedido Realizado com Sucesso!</h2>
          <p className="text-[#16a34a] text-xs">Seu pedido foi confirmado e esta sendo processado</p>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="w-full max-w-md bg-[#fff7ed] border border-[#ffedd5] rounded-xl p-4 mb-6 shadow-sm flex items-start gap-3">
        <AlertTriangle className="text-[#ea580c] shrink-0 mt-0.5" size={24} />
        <div>
          <h2 className="text-[#c2410c] font-bold text-sm leading-tight mb-1">
            Atencao: seu pedido so sera enviado apos a confirmacao do pagamento da taxa obrigatoria
          </h2>
          <p className="text-[#ea580c] text-[10px] leading-relaxed">
            De acordo com a legislacao tributaria brasileira (IN RFB n 1.737/2017), todos os produtos importados estao sujeitos a tributacao e liberacao alfandegaria.
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm overflow-hidden mb-4 border border-gray-100">
        
        {/* Blue Header */}
        <div className="bg-[#2563eb] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package size={24} />
            <div>
              <h2 className="font-bold text-[13px]">Liberacao Alfandegaria Expressa</h2>
              <p className="text-[10px] opacity-80">IN RFB n 1.737/2017</p>
            </div>
          </div>
          <div className="bg-white text-[#2563eb] text-[10px] font-black px-2 py-0.5 rounded">RFB</div>
        </div>

        <div className="p-5">
          {/* Info Box */}
          <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-lg p-3 mb-5">
            <p className="text-[#1d4ed8] text-[10px] font-semibold leading-relaxed mb-1">
              Essa taxa e obrigatoria e sem ela o produto nao pode ser despachado
            </p>
            <p className="text-[#1d4ed8] text-[10px] leading-relaxed">
              Caso nao haja pagamento, o pedido sera bloqueado e cancelado
            </p>
          </div>

          {/* Steps */}
          <div className="flex items-center justify-between gap-2 mb-6">
            <div className="flex-1 flex flex-col items-center justify-center p-2 bg-[#f8fafc] rounded-lg border border-gray-100 h-20">
              <FileText className="text-gray-400 mb-1" size={20} />
              <span className="text-[9px] text-gray-500 font-semibold text-center uppercase">Aguardando<br/>Documentacao</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-2 bg-[#f8fafc] rounded-lg border border-gray-100 h-20">
              <Package className="text-gray-400 mb-1" size={20} />
              <span className="text-[9px] text-gray-500 font-semibold text-center uppercase">Liberacao<br/>Alfandegaria</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-2 bg-[#f8fafc] rounded-lg border border-gray-100 h-20">
              <Clock className="text-gray-400 mb-1" size={20} />
              <span className="text-[9px] text-gray-500 font-semibold text-center uppercase">Proximo<br/>Processamento<br/>Expresso</span>
            </div>
          </div>

          {/* Detalhes do Processo */}
          <div className="bg-[#f8fafc] rounded-lg p-4 mb-5 border border-gray-100">
            <h3 className="text-[11px] font-bold text-gray-800 mb-3">Detalhes do Processo</h3>
            <div className="grid grid-cols-2 gap-y-3">
              <div>
                <p className="text-[9px] text-gray-400 mb-0.5">Codigo do Processo:</p>
                <p className="text-[10px] font-bold text-gray-700">BR-H7T9KYG7</p>
              </div>
              <div>
                <p className="text-[9px] text-gray-400 mb-0.5">Regime:</p>
                <p className="text-[10px] font-bold text-gray-700">Importacao Expressa</p>
              </div>
              <div>
                <p className="text-[9px] text-gray-400 mb-0.5">Unidade:</p>
                <p className="text-[10px] font-bold text-gray-700">Alfandega Internacional</p>
              </div>
              <div>
                <p className="text-[9px] text-gray-400 mb-0.5">Prazo Limite:</p>
                <p className="text-[10px] font-bold text-[#ea580c]">{formatTime(timeLeft)}</p>
              </div>
              <div>
                <p className="text-[9px] text-gray-400 mb-0.5">Status Atual:</p>
                <p className="text-[10px] font-bold text-[#d97706]">Aguardando Pagamento</p>
              </div>
              <div>
                <p className="text-[9px] text-gray-400 mb-0.5">Modalidade:</p>
                <p className="text-[10px] font-bold text-gray-700">Expressa</p>
              </div>
            </div>
          </div>

          {/* Vantagens */}
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-4 mb-4">
            <h3 className="text-[11px] font-bold text-[#15803d] mb-2">Ao efetuar o pagamento voce garante:</h3>
            <ul className="space-y-1.5">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="text-[#16a34a] w-3 h-3 shrink-0" />
                <span className="text-[10px] text-[#16a34a]">Liberacao imediata do seu produto</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="text-[#16a34a] w-3 h-3 shrink-0" />
                <span className="text-[10px] text-[#16a34a]">Envio expresso para sua residencia</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="text-[#16a34a] w-3 h-3 shrink-0" />
                <span className="text-[10px] text-[#16a34a]">Rastreamento em tempo real</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="text-[#16a34a] w-3 h-3 shrink-0" />
                <span className="text-[10px] text-[#16a34a]">Garantia de entrega</span>
              </li>
            </ul>
          </div>

          {/* Red Warning */}
          <div className="bg-[#fef2f2] border border-[#fecaca] rounded-lg p-3 text-center">
            <p className="text-[#dc2626] text-[10px] font-bold leading-relaxed">
              Voce tem apenas 30 minutos para efetuar o pagamento, caso contrario seu pedido sera cancelado automaticamente.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Box */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div className="flex items-center gap-2 text-gray-500 text-[10px] uppercase font-bold mb-3 tracking-widest">
          <FileText size={14} />
          Guia de Recolhimento
        </div>
        <h3 className="text-[13px] font-bold text-gray-800 mb-4">Taxa de Liberacao Alfandegaria</h3>
        
        <div className="bg-[#f8fafc] border border-gray-100 rounded-lg p-4 flex items-center justify-between mb-4">
          <span className="text-xs text-gray-500">Valor a pagar:</span>
          <span className="text-lg font-black text-gray-800">R$ 29,90</span>
        </div>

        <div className="flex items-center justify-between text-[11px] mb-5">
          <span className="text-gray-500">Prazo para pagamento:</span>
          <span className="text-[#dc2626] font-bold flex items-center gap-1"><Clock size={12}/> {formatTime(timeLeft)}</span>
        </div>

        <button 
          onClick={handleGeneratePix}
          className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] transition-colors text-white font-bold py-3.5 rounded-lg mb-4 text-sm"
        >
          Gerar codigo PIX
        </button>

        <div className="flex items-center justify-center gap-4 text-gray-400 text-[9px]">
          <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-green-500"/> Ambiente seguro</span>
          <span className="flex items-center gap-1"><Lock size={12}/> Dados criptografados</span>
        </div>
      </div>

      {showPix && (
        <PixPopup onClose={() => setShowPix(false)} amount={29.90} nextUpsell="/upsell2" />
      )}
    </div>
  )
}
