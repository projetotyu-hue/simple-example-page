import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Gift, Flame } from 'lucide-react'

const SHOP_NAME = 'Achadinhos do Momento'
const SOLD_COUNT = '140.327'

export default function ShopProfile() {
  const [following, setFollowing] = useState(false)
  const [redeemed1, setRedeemed1] = useState(false)
  const [redeemed2, setRedeemed2] = useState(false)

  return (
    <div className="flex flex-col bg-white">
      <div className="px-4 py-4 flex items-center justify-between border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-rose-100 overflow-hidden flex items-center justify-center shrink-0">
            <span className="text-rose-600 font-bold text-lg">{SHOP_NAME.charAt(0)}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{SHOP_NAME}</p>
            <p className="text-xs text-gray-400">{SOLD_COUNT} vendido(s)</p>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => setFollowing(f => !f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
              following
                ? 'bg-gray-200 text-gray-700 cursor-default'
                : 'bg-rose-600 text-white hover:bg-rose-700'
            }`}
          >
            {following ? <Check size={12} /> : null}
            {following ? 'Seguindo' : 'Seguir'}
          </button>
          <Link
            to="/chat"
            className="px-4 py-1.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-center"
          >
            Mensagem
          </Link>
        </div>
      </div>

      {/* Coupons Section */}
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
          >
            {redeemed2 ? <Check size={12} /> : null}
            {redeemed2 ? 'Resgatado' : 'Resgatar'}
          </button>
        </div>
      </div>
    </div>
  )
}
