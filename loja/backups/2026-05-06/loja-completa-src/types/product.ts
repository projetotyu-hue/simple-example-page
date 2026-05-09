export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  original_price: number | null
  discount_percent: number | null
  image_url: string | null
  image_urls: string[] | null
  category: string | null
  category_id: string | null
  badge: string | null
  featured: boolean
  related_product_ids?: string[]
  free_shipping: boolean
  sales_count: number
  section: string
  position: number
  video_url: string | null
  bonus_enabled: boolean
  bonus_title: string | null
  bonus_description: string | null
  bonus_highlight: string | null
  bonus_warning: string | null
  gift_title: string | null
  gift_description: string | null
  gift_image_url: string | null
  info_images: string[] | null
  additional_images: string[] | null  // URLs das imagens adicionais (para variações de cor)
  reviews_total: number | null  // Total de reviews (para exibir contagem)
}
