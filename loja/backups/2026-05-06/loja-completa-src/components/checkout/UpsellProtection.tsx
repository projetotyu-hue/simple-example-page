import { Shield } from 'lucide-react'

interface UpsellProtectionProps {
  active: boolean
  onToggle: () => void
  data?: {
    title: string
    price: number
    original_price?: number
    image_url: string
  }
}

export default function UpsellProtection({ active, onToggle, data }: UpsellProtectionProps) {
  const title = data?.title || 'Proteção Total com Seguro'
  const price = data?.price || 26.14
  const originalPrice = data?.original_price || 382.00
  const imageUrl = data?.image_url || 'https://imgur.com/p8wx3bjk2d.webp'

  const formatPrice = (p: number) => p.toFixed(2).replace('.', ',')

  return (
    <div className="border border-dashed border-[#00C4A7] rounded-xl p-4 mb-4 bg-transparent shadow-sm transition-all">
      <div className="flex items-center gap-2 mb-3">
        <Shield size={16} className="text-[#00C4A7] fill-transparent" />
        <p className="text-[13px] font-bold text-[#00C4A7]">Seguro Anti-Roubo Disponível</p>
      </div>
      
      <div className="bg-white rounded-xl px-3 py-2.5 flex items-center gap-3 mb-3 border border-teal-100/50 shadow-sm">
        <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center p-1 shrink-0">
          <img src={imageUrl} alt="Insurance" className="w-full h-full object-contain" />
        </div>
        <div className="flex-1">
          <p className="text-[12px] font-bold text-gray-800 leading-tight">{title}</p>
          <div className="flex items-center gap-1 mt-0.5">
            {originalPrice > 0 && (
              <p className="text-[11px] text-gray-400 line-through">R$ {formatPrice(originalPrice)}</p>
            )}
            <p className="text-[12px] font-bold text-[#00C4A7]">R$ {formatPrice(price)}</p>
          </div>
        </div>
      </div>

      <button
        onClick={onToggle}
        className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
          active 
            ? 'bg-teal-50 text-teal-600 border border-teal-300' 
            : 'bg-[#00C4A7] hover:bg-[#00b096] text-white shadow-sm'
        }`}
      >
        {active ? '✓ Proteção Ativada' : 'Ativar Proteção'}
      </button>
    </div>
  )
}
