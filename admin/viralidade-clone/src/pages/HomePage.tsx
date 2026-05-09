import ShopeeHeader from '../components/ShopeeHeader'
import ShopProfile from '../components/ShopProfile'
import ProductItem from '../components/ProductItem'
import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'

const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Fone de Ouvido Bluetooth 5.3 Pro Bass Hi-Fi Stereo',
    price: 37.90,
    original_price: 199.90,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
    sales_count: '4.2K'
  },
  {
    id: '2',
    name: 'Relógio Inteligente Smartwatch Ultra 9 Series 2024',
    price: 89.90,
    original_price: 459.90,
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60',
    sales_count: '1.8K'
  },
  {
    id: '3',
    name: 'Carregador Turbo 33W Original com Cabo USB-C',
    price: 24.50,
    original_price: 129.90,
    image_url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=60',
    sales_count: '8.9K'
  },
  {
    id: '4',
    name: 'Câmera de Segurança Wi-Fi 360 Full HD Night Vision',
    price: 119.90,
    original_price: 599.90,
    image_url: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=800&auto=format&fit=crop&q=60',
    sales_count: '2.1K'
  }
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5]">
      <ShopeeHeader />
      <ShopProfile />
      
      <main className="flex-1 px-3 py-4">
        {/* Banner Section */}
        <div className="mb-6 rounded-2xl overflow-hidden bg-primary p-6 text-white relative shadow-lg shadow-primary/10">
          <div className="relative z-10">
            <h2 className="text-xl font-black italic uppercase leading-none mb-1">Super Ofertas</h2>
            <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mb-4">Aproveite descontos de até 85%</p>
            <button className="bg-white text-primary text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-tighter shadow-sm">
              Ver mais
            </button>
          </div>
          <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        </div>

        {/* Categories Bar */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar mb-6 pb-2">
           {['Eletrônicos', 'Moda', 'Casa', 'Beleza', 'Esportes'].map((cat) => (
             <button key={cat} className="shrink-0 bg-white border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold text-gray-600 shadow-sm active:bg-gray-50">
               {cat}
             </button>
           ))}
        </div>

        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-sm font-black text-gray-800 uppercase tracking-tight">Descobertas do Dia</h2>
          <Link to="/produtos" className="text-[10px] font-bold text-primary uppercase">Ver tudo</Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-3 mb-24">
          {MOCK_PRODUCTS.map((p) => (
            <ProductItem key={p.id} product={p as any} />
          ))}
        </div>
      </main>

      {/* Fixed Bottom Bar Simulation (Optional if not in footer) */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-between z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col items-center gap-1 flex-1 text-primary">
          <div className="w-1.5 h-1.5 bg-primary rounded-full mb-0.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Início</span>
        </div>
        <Link to="/chat" className="flex flex-col items-center gap-1 flex-1 text-gray-400">
          <span className="text-[10px] font-bold uppercase tracking-wider">Chat</span>
        </Link>
        <Link to="/carrinho" className="flex flex-col items-center gap-1 flex-1 text-gray-400">
          <span className="text-[10px] font-bold uppercase tracking-wider">Carrinho</span>
        </Link>
        <Link to="/minha-conta" className="flex flex-col items-center gap-1 flex-1 text-gray-400">
          <span className="text-[10px] font-bold uppercase tracking-wider">Eu</span>
        </Link>
      </div>
    </div>
  )
}
