import type { Product } from '../types/product'
import ProductCard from './ProductCard'
import { ChevronRight } from 'lucide-react'

interface Props {
  products: Product[]
}

export default function TopProducts({ products }: Props) {
  if (products.length === 0) return null

  return (
    <div className="px-4 py-4 border-b border-gray-50">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-800">Principais produtos</p>
        <button className="text-gray-400">
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {products.slice(0, 3).map((product, i) => (
          <ProductCard key={product.id} product={product} showTopBadge topIndex={i} />
        ))}
      </div>
    </div>
  )
}
