import { AlertTriangle, Info, ShieldCheck, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function ErroPagamentoPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#f1f2f6] flex flex-col items-center py-10 px-4">
      
      {/* Icon Top */}
      <div className="relative bg-[#e9e8ff] w-32 h-32 rounded-3xl flex items-center justify-center mb-6">
        <div className="w-16 h-12 bg-blue-600 rounded-md flex flex-col justify-between p-1.5 shadow-md">
          <div className="w-full h-1/2 border-b-2 border-blue-500"></div>
        </div>
        <div className="absolute -top-3 -right-3 bg-red-500 rounded-full w-10 h-10 flex items-center justify-center shadow-lg border-4 border-[#f1f2f6]">
          <AlertTriangle className="text-white w-5 h-5" />
        </div>
      </div>

      {/* Title & Subtitle */}
      <h1 className="text-2xl font-bold text-red-600 mb-2">Erro no Pagamento</h1>
      <p className="text-sm text-gray-500 text-center max-w-[280px] mb-8 leading-relaxed">
        Infelizmente, nao conseguimos processar seu pagamento.<br/><br/>
        Isso pode ter ocorrido por algum erro na transacao ou na sua conexao.
      </p>

      {/* Info Box 1 */}
      <div className="bg-[#f8faff] border border-blue-200 rounded-xl p-5 w-full max-w-md mb-4 shadow-sm relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="bg-blue-500 rounded-full p-1.5 shrink-0 mt-0.5">
            <Info className="text-white w-4 h-4" />
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-gray-800 mb-1">O que aconteceu com meu pagamento?</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Identificamos uma falha no Sistema de Pagamentos Instantaneos (SPI) operado pelo Banco Central do Brasil. Esse tipo de ocorrencia acontece em menos de 0,1% das transacoes.
            </p>
          </div>
        </div>
      </div>

      {/* Info Box 2 */}
      <div className="bg-white border border-green-300 rounded-xl p-5 w-full max-w-md mb-6 shadow-sm">
        <div className="flex items-start gap-3 mb-4">
          <div className="bg-[#00c853] rounded-full p-1.5 shrink-0 mt-0.5">
            <ShieldCheck className="text-white w-4 h-4" />
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-gray-800 mb-1">Garantia de Ressarcimento Automatico</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Voce pode pagar novamente com total seguranca. Caso tenha sido debitado anteriormente, o valor sera automaticamente estornado.
            </p>
          </div>
        </div>
        
        <ul className="space-y-3 mb-4">
          <li className="flex items-start gap-2">
            <ShieldCheck className="text-green-500 w-3 h-3 shrink-0 mt-0.5" />
            <span className="text-[11px] text-gray-600 leading-tight"><strong>Prazo:</strong> Estorno automatico em ate <strong>24 horas uteis</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <ShieldCheck className="text-green-500 w-3 h-3 shrink-0 mt-0.5" />
            <span className="text-[11px] text-gray-600 leading-tight"><strong>Protecao:</strong> Sistema anti-duplicidade do Banco Central</span>
          </li>
          <li className="flex items-start gap-2">
            <ShieldCheck className="text-green-500 w-3 h-3 shrink-0 mt-0.5" />
            <span className="text-[11px] text-gray-600 leading-tight"><strong>Garantia:</strong> Protocolo de ressarcimento enviado por e-mail</span>
          </li>
        </ul>
        <p className="text-[9px] text-gray-400 italic border-t border-gray-100 pt-3">
          Procedimento regulamentado pela Resolucao BCB n 1 de 2020
        </p>
      </div>

      {/* Call to action */}
      <p className="text-[11px] text-gray-500 text-center mb-4 max-w-[280px]">
        Clique no botao abaixo para realizar uma nova tentativa de pagamento
      </p>

      <div className="bg-[#e8fbf0] border border-[#bbf7d0] text-[#16a34a] text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 mb-6">
        <ShieldCheck className="w-3 h-3" />
        Processo validado pelo Banco Central do Brasil
      </div>

      <button 
        onClick={() => navigate('/checkout')}
        className="w-full max-w-md bg-[#8b5cf6] hover:bg-[#7c3aed] transition-colors text-white font-semibold py-4 rounded-xl shadow-lg mb-4 text-[15px]"
      >
        Tentar Novamente
      </button>

      <div className="flex items-center gap-1.5 text-gray-400">
        <Lock className="w-3.5 h-3.5 text-green-500" />
        <span className="text-[11px]">Ambiente seguro</span>
      </div>

    </div>
  )
}
