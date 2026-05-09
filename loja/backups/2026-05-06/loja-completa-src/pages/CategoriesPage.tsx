import { useState, useEffect } from 'react'
import Header from '../components/Header'
import NavTabs from '../components/NavTabs'
import Footer from '../components/Footer'
import CategoryItem from '../components/CategoryItem'
import { fetchCategoriesWithCounts, type CategoryWithCount } from '../integrations/supabase/client'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await fetchCategoriesWithCounts()
      setCategories(data)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col shadow-sm overflow-x-hidden">
        <Header />
        <NavTabs />
        <main className="flex-1 px-4">
          {loading ? (
            <div className="py-8 text-center text-gray-400 text-sm">
              Carregando categorias...
            </div>
          ) : categories.length > 0 ? (
            categories.map((cat) => (
              <CategoryItem
                key={cat.id}
                name={cat.name}
                id={cat.id}
                count={cat.product_count}
              />
            ))
          ) : (
            <div className="py-8 text-center text-gray-400 text-sm">
              Nenhuma categoria encontrada.
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  )
}

