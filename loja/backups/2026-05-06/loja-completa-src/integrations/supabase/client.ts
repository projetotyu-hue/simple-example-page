import { createClient } from '@supabase/supabase-js'
import type { Product } from '../../types/product'

export interface Category {
  id: string
  name: string
}

const supabaseUrl = 'https://kcjwyfunfjoqkzppkmun.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjand5ZnVuZmpvcWt6cHBrbXVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2ODgxODcsImV4cCI6MjA5MjI2NDE4N30.cDyexLkniqLsyigg1CE4N5noAoP_mL7-RFM-_1lUBqg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function fetchProducts(section?: string): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*')
    .order('position', { ascending: true })

  if (section) {
    query = query.eq('section', section)
  }

  const { data, error } = await query
  if (error) {
    console.error('Error fetching products:', error)
    return []
  }
  return data as Product[]
}

export async function fetchTopProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('section', 'top')
    .order('position', { ascending: true })
    .limit(3)

  if (error) {
    console.error('Error fetching top products:', error)
    return []
  }
  return data as Product[]
}

export async function fetchRecommendedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('section', 'recommended')
    .order('position', { ascending: true })

  if (error) {
    console.error('Error fetching recommended products:', error)
    return []
  }
  return data as Product[]
}

export interface CategoryWithCount extends Category {
  product_count: number
}

export async function fetchCategoriesWithCounts(): Promise<CategoryWithCount[]> {
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (catError) {
    console.error('Error fetching categories:', catError)
    return []
  }

  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('category_id')

  if (prodError) {
    console.error('Error fetching products for counts:', prodError)
    return categories.map(cat => ({ ...cat, product_count: 0 }))
  }

  const counts: Record<string, number> = {}
  products.forEach(p => {
    if (p.category_id) {
      counts[p.category_id] = (counts[p.category_id] || 0) + 1
    }
  })

  return categories.map(cat => ({
    ...cat,
    product_count: counts[cat.id] || 0
  }))
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }
  return data as Category[]
}

export interface Review {
  id: string
  product_id: string
  author_name: string
  rating: number
  comment: string | null
  avatar_url: string | null
  variation: string | null
  days_ago: number | null
  likes: number | null
  created_at: string
}

export async function fetchProductReviews(productId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reviews:', error)
    return []
  }
  return data as Review[]
}
