import { ShieldCheck, ArrowRight, X, Clock, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

interface UpsellProps {
  step: number
}

const UPSELL_DATA: Record<number, any> = {
  1: {
    title: 'ESPERE! NÃO FECHE A PÁGINA',
    subtitle: 'Temos uma oferta exclusiva de proteção para seu pedido',
    product: 'Garantia Estendida + Seguro Contra Roubo',
    price: 19.90,
    original_price: 59.90,
    image: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=800&auto=format&fit=crop&q=60',
    next: '/upsell2'
  },
  2: {
    title: 'OFERTA ESPECIAL DE ÚLTIMA HORA',
    subtitle: 'Adicione este item ao seu pedido com 90% de desconto',
    product: 'Capa Protetora de Silicone Premium',
    price: 9.90,
    original_price: 89.90,
    image: 'https://images.unsplash.com/photo-1603344066122-9927d73d98a2?w=800&auto=format&fit=crop&q=60',
    next: '/upsell3'
  },
  3: {
    title: 'ÚLTIMA OPORTUNIDADE',
    subtitle: 'Complete seu kit com nosso carregador ultra-rápido',
    product: 'Carregador Turbo 65W GaN Charger',
    price: 49.90,
    original_price: 249.90,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=60',
    next: '/'
  }
}

export default function UpsellPage({ step }: UpsellProps) {
  const navigate = useNavigate()
  const data = UPSELL_DATA[step]
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes

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

  const handleAccept = () => {
    navigate(data.next)
  }

  const handleDecline = () => {
    navigate(data.next)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Urgency Header */}
      <div className="bg-amber-400 py-3 px-4 flex items-center justify-center gap-3">
        <Zap size={16} className="text-gray-900 animate-bounce" />
        <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest">
          Esta oferta expira em {formatTime(timeLeft)}
        </span>
      </div>

      <main className="flex-1 px-4 py-8 flex flex-col items-center">
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-primary font-black text-xl italic uppercase leading-none mb-2 tracking-tighter">
            {data.title}
          </h1>
          <p className="text-sm font-bold text-gray-800 leading-tight max-w-[280px] mx-auto">
            {data.subtitle}
          </p>
        </div>

        <div className="w-full bg-gray-50 rounded-[40px] p-6 mb-8 border border-gray-100 shadow-xl shadow-gray-100/50">
          <div className="relative aspect-square rounded-3xl overflow-hidden mb-6 bg-white shadow-inner">
            <img src={data.image} alt="Upsell" className="w-full h-full object-cover" />
            <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
              MAIS VENDIDO
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-base font-black text-gray-800 mb-4 line-clamp-2 leading-tight">
              {data.product}
            </h2>
            
            <div className="flex flex-col items-center gap-1 mb-6">
              <span className="text-xs text-gray-400 line-through font-bold">De R$ {data.original_price.toFixed(2)}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Por apenas</span>
                <span className="text-primary font-black text-3xl italic tracking-tighter">R$ {data.price.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-4">
          <button
            onClick={handleAccept}
            className="w-full bg-primary text-white font-black py-5 rounded-3xl flex items-center justify-center gap-3 uppercase tracking-widest shadow-2xl shadow-primary/30 active:scale-[0.98] transition-all text-sm"
          >
            Sim, eu quero aproveitar!
            <ArrowRight size={18} />
          </button>
          
          <button
            onClick={handleDecline}
            className="w-full text-gray-400 font-bold py-2 text-xs flex items-center justify-center gap-2 hover:text-gray-600 transition-colors"
          >
            <X size={14} />
            Não obrigado, quero pagar o preço normal depois
          </button>
        </div>
      </main>

      <footer className="p-8 border-t border-gray-50 bg-gray-50/30">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <ShieldCheck size={24} className="text-green-500 shrink-0" />
            <div>
              <p className="text-[11px] font-black text-gray-800 uppercase">Satisfação Garantida</p>
              <p className="text-[10px] text-gray-500">Você tem 7 dias para testar ou seu dinheiro de volta.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
