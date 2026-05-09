import { Link } from 'react-router-dom'
import type { Product } from '../types/product'

function formatPrice(price: number): string {
  return price.toFixed(2).replace('.', ',')
}

function getDiscountPercent(original: number | null, current: number): number {
  if (!original || original <= current) return 0
  return Math.round(((original - current) / original) * 100)
}

interface ProductCardProps {
  product: Product
  showTopBadge?: boolean
  topIndex?: number
}

export default function ProductCard({ product, showTopBadge, topIndex }: ProductCardProps) {
  const discount = product.discount_percent ?? getDiscountPercent(product.original_price, product.price)
  const currentPrice = formatPrice(product.price)
  const originalPrice = product.original_price ? formatPrice(product.original_price) : null

  const imageSrc = product.image_url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjE0Ij5TZW0gSW1hZ2VtPC90ZXh0Pjwvc3ZnPg=='

  return (
    <Link to={`/produto/${product.id}`} className="block">
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-sm transition-shadow">
        <div className="relative aspect-square bg-gray-50">
          <img
            alt={product.name}
            className="object-cover"
            src={imageSrc}
            loading="lazy"
            style={{ position: 'absolute', height: '100%', width: '100%', left: 0, top: 0, right: 0, bottom: 0 }}
          />
          {showTopBadge && topIndex !== undefined && (
            <div className="absolute top-1.5 left-1.5 bg-rose-600 text-white rounded-md flex flex-col items-center leading-none px-1.5 py-1">
              <span className="text-[7px] font-bold">TOP</span>
              <span className="text-[10px] font-bold">{topIndex + 1}</span>
            </div>
          )}
          {!showTopBadge && discount > 0 && (
            <div className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md z-10">
              {discount}%
            </div>
          )}
        </div>
        <div className="p-1.5">
          <p className="text-[10px] text-gray-700 line-clamp-2 leading-tight mb-1">
            {product.name}
          </p>
          <p className="text-xs font-bold text-rose-600">R$ {currentPrice}</p>
          {originalPrice && (
            <p className="text-[10px] text-gray-400 line-through">R$ {originalPrice}</p>
          )}
          {showTopBadge && discount > 0 && (
            <p className="text-[9px] font-bold text-rose-600">🔥 {discount}% OFF</p>
          )}
          {showTopBadge && (
            <p className="text-[9px] text-green-600">Frete grátis</p>
          )}
        </div>
      </div>
    </Link>
  )
}
