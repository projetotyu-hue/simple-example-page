import type { CartProduct } from '../types/cart'
import { Minus, Plus, Trash2 } from 'lucide-react'

interface CartItemProps {
  item: CartProduct
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}

function formatPrice(price: number): string {
  return price.toFixed(2).replace('.', ',')
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const imageSrc = item.image_url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik00MCA0MEw0MCA0MFoiIGZpbGw9IiNEM0QzRDMiLz4KPC9zdmc+'

  return (
    <div className="flex gap-3 py-4" style={{ paddingLeft: '16px', paddingRight: '16px' }}>
      <img
        src={imageSrc}
        alt={item.name}
        className="shrink-0 object-cover"
        style={{ width: '80px', height: '80px', borderRadius: '8px' }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-[14px] text-[#333333] line-clamp-2 leading-tight mb-1">{item.name}</p>
        {item.variation && (
          <p className="text-[12px] text-[#777777] mb-1">{item.variation}</p>
        )}
        <p className="text-[16px] font-bold" style={{ color: '#FF2D55' }}>
          R$ {formatPrice(item.price)}
        </p>
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0">
        <button
          onClick={() => onRemove(item.id)}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Trash2 size={16} style={{ color: '#CCC' }} />
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="w-6 h-6 flex items-center justify-center rounded-full border transition-colors"
            style={{ borderColor: '#EEEEEE' }}
          >
            <Minus size={12} style={{ color: '#333333' }} />
          </button>
          <span className="text-[14px] text-[#333333] w-4 text-center">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="w-6 h-6 flex items-center justify-center rounded-full border transition-colors"
            style={{ borderColor: '#EEEEEE' }}
          >
            <Plus size={12} style={{ color: '#333333' }} />
          </button>
        </div>
      </div>
    </div>
  )
}
