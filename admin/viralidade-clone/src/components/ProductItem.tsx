import { Star, ShoppingCart } from 'lucide-react'
import type { Product } from '../types'

interface ProductItemProps {
  product: Product
}

export default function ProductItem({ product }: ProductItemProps) {
  return (
    <div className="bg-white group cursor-pointer active:scale-[0.98] transition-transform">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Discount Badge */}
        <div className="absolute top-2 right-2 bg-[#FFD700] text-gray-900 text-[10px] font-black px-2 py-1 rounded shadow-sm flex flex-col items-center leading-none">
          <span>85%</span>
          <span className="text-[8px] uppercase">OFF</span>
        </div>
      </div>
      
      <div className="py-3 px-1">
        <h3 className="text-xs font-medium text-gray-700 line-clamp-2 min-h-[32px] leading-snug mb-2">
          {product.name}
        </h3>
        
        <div className="flex flex-col gap-0.5 mb-2">
          <span className="text-[10px] text-gray-400 line-through">R$ {product.original_price?.toFixed(2).replace('.', ',')}</span>
          <div className="flex items-center gap-1">
            <span className="text-primary text-sm font-black">R$</span>
            <span className="text-primary text-lg font-black leading-none">{product.price.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <Star size={10} className="fill-amber-400 text-amber-400" />
            <span>4.9</span>
            <span className="mx-1">|</span>
            <span>{product.sales_count || '2.4K'} vendidos</span>
          </div>
        </div>
      </div>
    </div>
  )
}
