import type { Product } from '../types/product'
import ProductCard from './ProductCard'

interface Props {
  products: Product[]
}

export default function RecommendedGrid({ products }: Props) {
  if (products.length === 0) {
    return (
      <div className="py-6 flex justify-center opacity-20 text-gray-400 text-sm">
        Nenhum produto encontrado
      </div>
    )
  }

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-600 mb-3 text-center" style={{ textAlign: 'left', marginBottom: 0 }}>
          Recomendado para você
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
