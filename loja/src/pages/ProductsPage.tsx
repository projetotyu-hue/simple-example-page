import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../types/product'
import { fetchProducts } from '../integrations/supabase/client'
import { Loader2 } from 'lucide-react'
import Header from '../components/Header'
import NavTabs from '../components/NavTabs'
import SearchBar from '../components/SearchBar'
import ProductCard from '../components/ProductCard'
import Footer from '../components/Footer'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await fetchProducts()
      setProducts(data)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-[360px] mx-auto bg-white min-h-screen flex flex-col overflow-x-hidden">
        <NavTabs />
        <div className="px-3 pt-3 pb-2">
          <SearchBar />
        </div>

        <main className="flex-1 px-3 pb-4" style={{ paddingLeft: '12px', paddingRight: '12px' }}>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin" size={24} style={{ color: '#FF2D55' }} />
            </div>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">Nenhum produto encontrado</p>
          ) : (
            <div className="grid grid-cols-2" style={{ gap: '12px' }}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  )
}
