export interface CartProduct {
  id: string
  name: string
  image_url: string | null
  price: number
  variation?: string
  quantity: number
}

export interface GiftItem {
  name: string
  image_url: string | null
}
