import type { CartProduct } from '../../types/cart'

interface CartReviewItemProps {
  item: CartProduct
}

export default function CartReviewItem({ item }: CartReviewItemProps) {
  const formatPrice = (price: number) => price.toFixed(2).replace('.', ',')

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0">
      <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center p-0.5">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] text-gray-700 font-medium line-clamp-2 leading-tight">{item.name}</p>
        {item.variation && (
          <p className="text-[11px] text-gray-400 mt-0.5">Variação: {item.variation}</p>
        )}
        <p className="text-[12px] font-bold text-[#E11D48] mt-0.5">R$ {formatPrice(item.price)}</p>
      </div>
      <p className="text-[11px] text-gray-400 shrink-0 font-medium">x{item.quantity}</p>
    </div>
  )
}
