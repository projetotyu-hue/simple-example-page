import { useState, useMemo, useEffect } from 'react'
import { ShieldCheck, ShoppingCart, Store, MessageCircle } from 'lucide-react'
import Header from '../components/Header'
import CartItem from '../components/CartItem'
import GiftBox from '../components/GiftBox'
import Footer from '../components/Footer'
import RecommendedGrid from '../components/RecommendedGrid'
import { supabase } from '../integrations/supabase/client'
import type { CartProduct, GiftItem } from '../types/cart'
import type { Product } from '../types/product'
import { useNavigate } from 'react-router-dom'

export default function CartPage() {
  const [products, setProducts] = useState<CartProduct[]>([])
  const [gift, setGift] = useState<GiftItem | null>(null)
  const [recommendations, setRecommendations] = useState<Product[]>([])

  useEffect(() => {
    const savedProducts = localStorage.getItem('cart_products')
    const savedGift = localStorage.getItem('cart_gift')
    if (savedProducts) setProducts(JSON.parse(savedProducts))
    if (savedGift) setGift(JSON.parse(savedGift))
  }, [])

  useEffect(() => {
    async function loadRecommendations() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('section', 'recommended')
        .limit(6)

      if (data) setRecommendations(data as Product[])
    }
    void loadRecommendations()
  }, [])

  const totalItems = useMemo(
    () => products.reduce((sum, p) => sum + p.quantity, 0),
    [products]
  )

  const totalPrice = useMemo(
    () => products.reduce((sum, p) => sum + p.price * p.quantity, 0),
    [products]
  )

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return
    const updated = products.map((p) => (p.id === id ? { ...p, quantity } : p))
    setProducts(updated)
    localStorage.setItem('cart_products', JSON.stringify(updated))
  }

  const handleRemove = (id: string) => {
    const updated = products.filter((p) => p.id !== id)
    setProducts(updated)
    localStorage.setItem('cart_products', JSON.stringify(updated))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col shadow-sm overflow-x-hidden">
        <Header />
        <main className="flex-1 pb-32">
          <div className="flex flex-col" style={{ padding: '16px', gap: '16px' }}>
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-4">
                <ShoppingCart size={48} className="text-gray-200 mb-4" aria-hidden="true" />
                <p className="text-base font-medium text-gray-600 mb-1">Seu carrinho está vazio</p>
                <p className="text-sm text-gray-400 mb-6">Adicione produtos para continuar</p>
                <a href="/" className="bg-rose-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-rose-700 transition-colors">
                  Ver produtos
                </a>
              </div>
            ) : (
              products.map((product) => (
                <CartItem
                  key={product.id}
                  item={product}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemove}
                />
              ))
            )}
          </div>

          <div className="px-4 pb-4">
            <GiftBox gift={gift} />
          </div>

          {recommendations.length > 0 && (
            <div className="mt-6">
              <div className="px-4 mb-2">
                <h3 className="text-[15px] font-bold text-[#333333]">Você também pode gostar</h3>
              </div>
              <RecommendedGrid products={recommendations} />
            </div>
          )}

          <div className="mt-4">
            <Footer />
          </div>
        </main>

        {products.length > 0 && (
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[414px] h-[56px] z-[100] bg-white border-t border-gray-200">
            <div className="px-2 py-2 flex items-center gap-2 h-full">
              <button className="flex flex-col items-center justify-center w-10 flex-shrink-0" aria-label="Loja" onClick={() => window.location.href = '/'}>
                <Store size={18} className="text-muted-foreground" aria-hidden="true" />
                <span className="text-[9px] text-muted-foreground mt-0.5">Loja</span>
              </button>
              <button className="flex flex-col items-center justify-center w-10 flex-shrink-0" aria-label="Chat" onClick={() => window.location.href = '/chat'}>
                <MessageCircle size={18} className="text-muted-foreground" aria-hidden="true" />
                <span className="text-[9px] text-muted-foreground mt-0.5">Chat</span>
              </button>
              <button className="relative flex flex-col items-center justify-center gap-0.5 border-2 border-primary rounded-lg px-3 py-1.5 flex-shrink-0 active:scale-[0.97] transition-all" aria-label="Adicionar ao carrinho">
                <div className="relative">
                  <ShoppingCart size={20} className="text-primary" aria-hidden="true" />
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[8px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5">{totalItems}</span>
                </div>
                <span className="text-[8px] font-semibold text-primary leading-none whitespace-nowrap">+ Carrinho</span>
              </button>
              <button
                className="flex-1 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] rounded-lg py-2 px-3 transition-all"
                onClick={() => useNavigate()('/checkout')}
              >
                <div className="flex flex-col items-center">
                  <span className="text-white text-[13px] font-bold">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                  <span className="text-white/80 text-[9.5px]">Comprar agora | Frete gratis</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
