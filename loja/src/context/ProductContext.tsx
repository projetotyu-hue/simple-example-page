import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import type { Product } from '../types/product'
import { supabase } from '../integrations/supabase/client'

interface ProductContextType {
  currentProductName: string | null
  setCurrentProductName: (name: string | null) => void
  allProducts: Product[]
}

const ProductContext = createContext<ProductContextType>({
  currentProductName: null,
  setCurrentProductName: () => {},
  allProducts: [],
})

export function ProductProvider({ children }: { children: ReactNode }) {
  const [currentProductName, setCurrentProductName] = useState<string | null>(null)
  const [allProducts, setAllProducts] = useState<Product[]>([])

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase.from('products').select('name').eq('active', true)
      if (data) setAllProducts(data as Product[])
    }
    fetchProducts()
  }, [])

  return (
    <ProductContext.Provider value={{ currentProductName, setCurrentProductName, allProducts }}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProduct() {
  return useContext(ProductContext)
}
