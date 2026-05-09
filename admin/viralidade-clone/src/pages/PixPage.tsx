import { useState, useEffect } from 'react'
import { ArrowLeft, Copy, CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export default function PixPage() {
  const navigate = useNavigate()
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minutes
  
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

  const handleCopy = () => {
    navigator.clipboard.writeText('00020101021226940014br.gov.bcb.pix2572pix-qr.static.itau.com.br/qr/v2/448d8a7c-3b9a-4c2e-8d5f-9e7b2a1c0d3e520400005303986540537.905802BR5925ACHADINHOS DA ZOE6009SAO PAULO62070503***6304E1D1')
    toast.success('Chave Pix copiada com sucesso!')
    
    // Simulate redirect after payment (or manual click for testing)
    setTimeout(() => {
      navigate('/upsell1')
    }, 3000)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-800" />
          </button>
          <h1 className="text-base font-bold text-gray-800">Pagamento Pix</h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-8">
        <div className="flex flex-col items-center text-center animate-slide-up">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={32} className="text-green-500" />
          </div>
          
          <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight mb-2">Pedido Reservado!</h2>
          <p className="text-xs text-gray-500 mb-8 max-w-[280px]">
            Seu pedido foi gerado. Finalize o pagamento via Pix para garantir sua oferta.
          </p>
          
          {/* QR Code Placeholder */}
          <div className="w-64 h-64 bg-white border-4 border-primary/10 rounded-3xl p-4 mb-8 shadow-2xl shadow-primary/5 relative overflow-hidden group">
            <div className="w-full h-full bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200">
               <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=PIX_PLACEHOLDER" alt="QR Code" className="w-48 h-48 opacity-80" />
            </div>
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-[10px] font-black text-primary uppercase tracking-widest">Escaneie o código</span>
            </div>
          </div>
          
          <div className="w-full max-w-sm flex flex-col gap-4">
             <div className="flex items-center justify-center gap-2 text-primary font-black text-sm mb-2">
                <Clock size={16} />
                <span>Pague em {formatTime(timeLeft)}</span>
             </div>
             
             <button
               onClick={handleCopy}
               className="w-full bg-primary text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest shadow-xl shadow-primary/30 active:scale-[0.98] transition-all"
             >
               <Copy size={20} />
               Copiar Chave Pix
             </button>
             
             <div className="flex items-center gap-2 justify-center text-amber-500 bg-amber-50 py-3 px-4 rounded-xl border border-amber-100">
                <AlertCircle size={14} />
                <span className="text-[10px] font-bold uppercase tracking-tight">Válido apenas por 30 minutos</span>
             </div>
          </div>
        </div>
      </main>

      <footer className="p-6 bg-gray-50/50">
        <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4 text-center">Como pagar?</h3>
        <div className="flex flex-col gap-3">
          <div className="flex gap-4 items-start">
            <div className="w-6 h-6 rounded-full bg-primary text-white text-[10px] font-black flex items-center justify-center shrink-0">1</div>
            <p className="text-[11px] text-gray-500 leading-relaxed">Abra o aplicativo do seu banco e escolha a opção <b>Pix</b>.</p>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-6 h-6 rounded-full bg-primary text-white text-[10px] font-black flex items-center justify-center shrink-0">2</div>
            <p className="text-[11px] text-gray-500 leading-relaxed">Escolha a opção <b>Pix Copia e Cola</b> ou <b>Ler QR Code</b>.</p>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-6 h-6 rounded-full bg-primary text-white text-[10px] font-black flex items-center justify-center shrink-0">3</div>
            <p className="text-[11px] text-gray-500 leading-relaxed">Confira os dados e finalize o pagamento.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
