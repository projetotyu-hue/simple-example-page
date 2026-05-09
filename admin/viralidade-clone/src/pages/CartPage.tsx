import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

const MOCK_CART = [
  {
    id: '1',
    name: 'Fone de Ouvido Bluetooth 5.3 Pro Bass Hi-Fi Stereo',
    price: 37.90,
    quantity: 1,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
  }
]

export default function CartPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState(MOCK_CART)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const freeShippingLimit = 100
  const progress = Math.min((total / freeShippingLimit) * 100, 100)

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-800" />
          </button>
          <h1 className="text-base font-bold text-gray-800">Carrinho ({items.length})</h1>
        </div>
        <button className="text-primary text-xs font-bold uppercase tracking-wider">Editar</button>
      </header>
      
      <main className="flex-1">
        {/* Free Shipping Bar */}
        <div className="px-4 py-4 bg-white border-b border-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-gray-800">
              {total >= freeShippingLimit 
                ? 'Parabéns! Você ganhou Frete Grátis' 
                : `Faltam R$ ${(freeShippingLimit - total).toFixed(2)} para Frete Grátis`}
            </span>
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">Envio Seguro</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>

        <div className="p-4 flex flex-col gap-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 items-start">
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 leading-snug">
                  {item.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-black text-lg">R$ {item.price.toFixed(2).replace('.', ',')}</span>
                  
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                    <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                      <Minus size={14} />
                    </button>
                    <span className="px-3 text-sm font-bold text-gray-800">{item.quantity}</span>
                    <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Summary Section */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary rounded flex items-center justify-center">
              <div className="w-2 h-2 bg-primary rounded-[1px]" />
            </div>
            <span className="text-xs font-bold text-gray-500">Selecionar tudo</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Total:</span>
            <span className="text-primary font-black text-xl">R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
        
        <Link 
          to="/checkout"
          className="block w-full bg-primary text-white font-black py-4 rounded-2xl text-center uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-[0.98] transition-all"
        >
          Continuar Compra
        </Link>
      </div>
    </div>
  )
}
