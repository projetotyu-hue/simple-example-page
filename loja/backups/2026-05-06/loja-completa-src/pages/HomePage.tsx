import { useState, useEffect, useMemo } from 'react'
import type { Product } from '../types/product'
import { fetchTopProducts, fetchRecommendedProducts } from '../integrations/supabase/client'
import Header from '../components/Header'
import NavTabs from '../components/NavTabs'
import ShopProfile from '../components/ShopProfile'
import TopProducts from '../components/TopProducts'
import RecommendedGrid from '../components/RecommendedGrid'
import Footer from '../components/Footer'

export default function HomePage() {
  const [topProducts, setTopProducts] = useState<Product[]>([])
  const [recommended, setRecommended] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [top, rec] = await Promise.all([
        fetchTopProducts(),
        fetchRecommendedProducts(),
      ])
      setTopProducts(top)
      const topIds = new Set(top.map(p => p.id))
      setRecommended(rec.filter(p => !topIds.has(p.id)))
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col shadow-sm overflow-x-hidden">
        <Header />
        <NavTabs />
        <main className="flex-1 pb-8">
          <ShopProfile />

          {loading ? (
            <div className="px-4 py-8 text-center text-gray-400 text-sm">
              Carregando...
            </div>
          ) : (
            <>
              <TopProducts products={topProducts} />
              <RecommendedGrid products={recommended} />
            </>
          )}
        </main>
        <Footer />
      </div>
    </div>
  )
}
