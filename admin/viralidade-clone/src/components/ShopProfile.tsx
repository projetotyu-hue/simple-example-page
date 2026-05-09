import { Store, Check, Star, Users } from 'lucide-react'
import { useState } from 'react'

export default function ShopProfile() {
  const [following, setFollowing] = useState(false)

  return (
    <div className="bg-white px-4 py-6 border-b border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center overflow-hidden">
            <Store size={32} className="text-primary" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-800">Achadinhos da Zoe</h1>
            <p className="text-xs text-green-500 font-medium flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Online agora
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setFollowing(!following)}
          className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${
            following 
              ? 'bg-gray-100 text-gray-500' 
              : 'bg-primary text-white shadow-lg shadow-primary/20'
          }`}
        >
          {following ? 'Seguindo' : 'Seguir'}
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Vendas</span>
          <p className="text-sm font-black text-gray-800">140.2K</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Avaliação</span>
          <div className="flex items-center gap-1">
            <Star size={10} className="fill-amber-400 text-amber-400" />
            <p className="text-sm font-black text-gray-800">4.9</p>
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Seguidores</span>
          <p className="text-sm font-black text-gray-800">3.2M</p>
        </div>
      </div>
      
      <div className="mt-6 flex gap-3 overflow-x-auto no-scrollbar">
        <div className="shrink-0 flex items-center gap-2 bg-pink-50/50 px-4 py-2 rounded-lg border border-pink-100">
          <div className="w-2 h-2 bg-primary rounded-full" />
          <span className="text-xs font-bold text-primary">Frete Grátis</span>
        </div>
        <div className="shrink-0 flex items-center gap-2 bg-pink-50/50 px-4 py-2 rounded-lg border border-pink-100">
          <div className="w-2 h-2 bg-primary rounded-full" />
          <span className="text-xs font-bold text-primary">85% OFF</span>
        </div>
        <div className="shrink-0 flex items-center gap-2 bg-pink-50/50 px-4 py-2 rounded-lg border border-pink-100">
          <div className="w-2 h-2 bg-primary rounded-full" />
          <span className="text-xs font-bold text-primary">Envio Imediato</span>
        </div>
      </div>
    </div>
  )
}
