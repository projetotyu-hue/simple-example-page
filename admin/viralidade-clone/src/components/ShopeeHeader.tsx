import { Search, ShoppingCart, MessageCircle, User } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ShopeeHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar na loja..."
            className="w-full bg-gray-100 border-none rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/chat" className="relative text-gray-700 hover:text-primary transition-colors">
            <MessageCircle size={22} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full border-2 border-white" />
          </Link>
          
          <Link to="/carrinho" className="relative text-gray-700 hover:text-primary transition-colors">
            <ShoppingCart size={22} />
            <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
              2
            </span>
          </Link>
        </div>
      </div>
      
      {/* Shopee-style Tabs */}
      <div className="flex px-4 gap-6 overflow-x-auto no-scrollbar border-t border-gray-50 bg-white">
        {['Início', 'Produtos', 'Categorias', 'Ofertas'].map((tab, i) => (
          <button
            key={tab}
            className={`py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              i === 0 ? 'text-primary border-primary' : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </header>
  )
}
