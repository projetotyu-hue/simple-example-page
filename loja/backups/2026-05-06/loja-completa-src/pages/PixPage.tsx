import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Check, Copy, Clock, ShieldCheck, CreditCard } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function PixPage() {
  const [copied, setCopied] = useState(false)
  const pixKey = "00020126580014br.gov.bcb.pix01366113c4a2-1484-46cd-b1f8-29a5329113c4520400005303986540410.005802BR5925LOJA VIRTUAL6009SAO PAULO62070503***6304E1B5"

  const handleCopy = () => {
    navigator.clipboard.writeText(pixKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[var(--background-alt)]">
      <Header />
      <main className="max-w-md mx-auto bg-white min-h-screen pb-12 flex flex-col">
        <div className="px-4 py-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
            <Check size={32} className="text-green-500" />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)] mb-2">Pedido Reservado!</h1>
          <p className="text-sm text-gray-500 mb-6">Finalize o pagamento via Pix para garantir seu produto.</p>

          <div className="w-full bg-[var(--background-soft)] rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-center mb-6">
              <div className="w-48 h-48 bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                {/* Mock QR Code */}
                <div className="w-full h-full bg-gray-50 flex items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,black_1px,transparent_1px)] bg-[size:10px_10px]"></div>
                   <div className="z-10 bg-white p-2 border border-gray-200">
                     <div className="w-32 h-32 bg-[repeating-conic-gradient(black_0%_25%,transparent_0%_50%)] bg-[size:20px_20px]"></div>
                   </div>
                </div>
              </div>
            </div>

            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Pix Copia e Cola</p>
            <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl p-3 mb-4">
              <p className="flex-1 text-xs text-gray-400 truncate text-left">{pixKey}</p>
              <button 
                onClick={handleCopy}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[var(--primary)] text-white text-xs font-bold rounded-lg hover:opacity-90"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[var(--primary)] font-bold text-sm">
              <Clock size={16} />
              <span>Aguardando pagamento...</span>
            </div>
          </div>

          <div className="w-full space-y-4">
            <div className="flex items-start gap-3 text-left bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <ShieldCheck size={20} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-blue-900">Pagamento 100% Seguro</p>
                <p className="text-xs text-blue-800">Seu pedido será processado assim que o pagamento for confirmado.</p>
              </div>
            </div>

            <Link 
              to="/upsell1"
              className="w-full block py-4 bg-[var(--primary)] text-white font-bold rounded-xl shadow-lg shadow-pink-100 text-center hover:opacity-90 transition-opacity"
            >
              Já realizei o pagamento
            </Link>
            
            <Link 
              to="/"
              className="w-full block py-4 border border-gray-200 text-gray-500 font-bold rounded-xl text-center hover:bg-gray-50 transition-colors"
            >
              Voltar para a loja
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
