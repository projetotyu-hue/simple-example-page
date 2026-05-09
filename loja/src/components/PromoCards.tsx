import { useState } from 'react'
import { Gift, Flame, Check } from 'lucide-react'

export default function PromoCards() {
  const [redeemed1, setRedeemed1] = useState(false)
  const [redeemed2, setRedeemed2] = useState(false)

  return (
    <div className="px-4 py-3 flex gap-2">
      <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gift size={16} className="text-rose-600" />
          <div>
            <p className="text-xs font-bold text-gray-800">Cupom de frete grátis</p>
            <p className="text-[10px] text-gray-400">Em produtos selecionados</p>
          </div>
        </div>
        <button
          onClick={() => setRedeemed1(r => !r)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
            redeemed1
              ? 'bg-gray-200 text-gray-400 cursor-default'
              : 'bg-rose-600 text-white hover:bg-rose-700'
          }`}
          disabled={redeemed1}
        >
          {redeemed1 ? <Check size={12} /> : null}
          {redeemed1 ? 'Resgatado' : 'Resgatar'}
        </button>
      </div>
      <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame size={16} className="text-rose-600" />
          <div>
            <p className="text-xs font-bold text-gray-800">Até 97% OFF</p>
            <p className="text-[10px] text-gray-400">Em produtos selecionados</p>
          </div>
        </div>
        <button
          onClick={() => setRedeemed2(r => !r)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
            redeemed2
              ? 'bg-gray-200 text-gray-400 cursor-default'
              : 'bg-rose-600 text-white hover:bg-rose-700'
          }`}
          disabled={redeemed2}
        >
          {redeemed2 ? <Check size={12} /> : null}
          {redeemed2 ? 'Resgatado' : 'Resgatar'}
        </button>
      </div>
    </div>
  )
}
