import { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from 'react'
import type { CartProduct, GiftItem } from '../types/cart'

const STORAGE_KEY = 'cart_products'
const GIFT_KEY = 'cart_gift'

type CartState = {
  products: CartProduct[]
  gift: GiftItem | null
  totalItems: number
  totalPrice: number
}

type CartAction =
  | { type: 'ADD_ITEM'; product: CartProduct }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'UPDATE_QUANTITY'; id: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_GIFT'; gift: GiftItem | null }
  | { type: 'LOAD_CART'; products: CartProduct[]; gift: GiftItem | null }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.products.find(
        p => p.id === action.product.id && p.variation === action.product.variation
      )
      if (existing) {
        const products = state.products.map(p =>
          p.id === action.product.id && p.variation === action.product.variation
            ? { ...p, quantity: p.quantity + action.product.quantity }
            : p
        )
        const totalItems = products.reduce((sum, p) => sum + p.quantity, 0)
        const totalPrice = products.reduce((sum, p) => sum + p.price * p.quantity, 0)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
        return { ...state, products, totalItems, totalPrice }
      } else {
        const products = [...state.products, action.product]
        const totalItems = products.reduce((sum, p) => sum + p.quantity, 0)
        const totalPrice = products.reduce((sum, p) => sum + p.price * p.quantity, 0)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
        return { ...state, products, totalItems, totalPrice }
      }
    }
    case 'REMOVE_ITEM': {
      const products = state.products.filter(p => p.id !== action.id)
      const totalItems = products.reduce((sum, p) => sum + p.quantity, 0)
      const totalPrice = products.reduce((sum, p) => sum + p.price * p.quantity, 0)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
      return { ...state, products, totalItems, totalPrice }
    }
    case 'UPDATE_QUANTITY': {
      if (action.quantity < 1) {
        const products = state.products.filter(p => p.id !== action.id)
        const totalItems = products.reduce((sum, p) => sum + p.quantity, 0)
        const totalPrice = products.reduce((sum, p) => sum + p.price * p.quantity, 0)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
        return { ...state, products, totalItems, totalPrice }
      } else {
        const products = state.products.map(p =>
          p.id === action.id ? { ...p, quantity: action.quantity } : p
        )
        const totalItems = products.reduce((sum, p) => sum + p.quantity, 0)
        const totalPrice = products.reduce((sum, p) => sum + p.price * p.quantity, 0)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
        return { ...state, products, totalItems, totalPrice }
      }
    }
    case 'CLEAR_CART': {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(GIFT_KEY)
      return { products: [], gift: null, totalItems: 0, totalPrice: 0 }
    }
    case 'SET_GIFT': {
      localStorage.setItem(GIFT_KEY, JSON.stringify(action.gift))
      return { ...state, gift: action.gift }
    }
    case 'LOAD_CART': {
      const totalItems = action.products.reduce((sum, p) => sum + p.quantity, 0)
      const totalPrice = action.products.reduce((sum, p) => sum + p.price * p.quantity, 0)
      return { ...state, products: action.products, gift: action.gift, totalItems, totalPrice }
    }
  }
}

const initialState: CartState = {
  products: [],
  gift: null,
  totalItems: 0,
  totalPrice: 0,
}

const CartContext = createContext<{
  state: CartState
  addToCart: (product: CartProduct) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setGift: (gift: GiftItem | null) => void
} | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    const savedGift = localStorage.getItem(GIFT_KEY)
    let products: CartProduct[] = []
    let gift: GiftItem | null = null
    if (saved) {
      try { products = JSON.parse(saved) } catch { products = [] }
    }
    if (savedGift) {
      try { gift = JSON.parse(savedGift) } catch { gift = null }
    }
    dispatch({ type: 'LOAD_CART', products, gift })
  }, [])

  const addToCart = (product: CartProduct) => dispatch({ type: 'ADD_ITEM', product })
  const removeFromCart = (id: string) => dispatch({ type: 'REMOVE_ITEM', id })
  const updateQuantity = (id: string, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', id, quantity })
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })
  const setGiftFn = (gift: GiftItem | null) => dispatch({ type: 'SET_GIFT', gift })

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setGift: setGiftFn,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
