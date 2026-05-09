import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, ShoppingCart, Store, MessageCircle, Loader2 } from 'lucide-react'
import Header from '../components/Header'
import CartItem from '../components/CartItem'
import GiftBox from '../components/GiftBox'
import Footer from '../components/Footer'
import RecommendedGrid from '../components/RecommendedGrid'
import { supabase } from '../integrations/supabase/client'
import type { CartProduct, GiftItem } from '../types/cart'
import type { Product } from '../types/product'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function CartPage() {
  const { state, updateQuantity, removeFromCart, clearCart } = useCart()
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const products = state.products
  const gift = state.gift
  const navigate = useNavigate()

  useEffect(() => {
    async function loadRecommendations() {
      try {
        const { data } = await supabase
          .from('products')
          .select('*')
          .eq('section', 'recommended')
          .limit(6)
        if (data) setRecommendations(data as Product[])
      } catch (err) {
        console.error('Erro loading recommendations:', err)
      } finally {
        setLoading(false)
      }
    }
    void loadRecommendations()
  }, [])

  const totalItems = state.totalItems
  const totalPrice = state.totalPrice

  const handleUpdateQuantity = (id: string, quantity: number) => {
    updateQuantity(id, quantity)
  }

  const handleRemoveItem = (id: string) => {
    removeFromCart(id)
  }

  const handleClearCart = () => {
    clearCart()
  }

  const handleCheckout = () => {
    navigate('/checkout')
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -100, transition: { duration: 0.3 } },
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-1 flex flex-col w-full max-w-[360px] mx-auto px-4 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-4 border-b border-gray-100"
        >
          <h1 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ShoppingCart size={20} className="text-gray-700" />
            Carrinho
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-sm font-normal text-gray-500"
              >
                ({totalItems} {totalItems === 1 ? 'item' : 'itens'})
              </motion.span>
            )}
          </h1>
        </motion.div>

        {/* Cart Items */}
        {products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center py-16 text-center"
          >
            <ShoppingCart size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 mb-2">Seu carrinho está vazio</p>
            <a href="/" className="text-rose-600 font-medium text-sm hover:underline">
              Continuar comprando
            </a>
          </motion.div>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="divide-y divide-gray-100"
            >
              <AnimatePresence>
                {products.map((product) => (
                  <motion.div
                    key={`${product.id}-${product.variation || 'default'}`}
                    variants={itemVariants}
                    exit="exit"
                    layout
                  >
                    <CartItem
                      item={product}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveItem}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Gift Box */}
            {gift && <GiftBox gift={gift} />}

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 bg-gray-50 rounded-xl p-4 space-y-3"
            >
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <motion.span
                  key={totalPrice}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="font-medium text-gray-900"
                >
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice)}
                </motion.span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Frete</span>
                <span className="font-medium text-emerald-600">Grátis</span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <motion.span
                  key={totalPrice}
                  initial={{ scale: 1.15 }}
                  animate={{ scale: 1 }}
                  className="font-bold text-lg text-rose-600"
                >
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice)}
                </motion.span>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 space-y-3"
            >
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                className="w-full bg-rose-600 text-white font-semibold py-3 rounded-xl hover:bg-rose-700 transition-colors"
              >
                Finalizar Compra
              </motion.button>
              <button
                onClick={handleClearCart}
                className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Limpar Carrinho
              </button>
            </motion.div>
          </>
        )}

        {/* Trust */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-400"
        >
          <div className="flex items-center gap-1">
            <ShieldCheck size={14} />
            <span>Compra Segura</span>
          </div>
          <div className="flex items-center gap-1">
            <Store size={14} />
            <span>Loja Verificada</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle size={14} />
            <span>Suporte</span>
          </div>
        </motion.div>

        {/* Recommendations */}
        {!loading && recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8"
          >
            <h2 className="text-base font-semibold text-gray-900 mb-4">Quem viu também viu</h2>
            <RecommendedGrid products={recommendations} />
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  )
}
