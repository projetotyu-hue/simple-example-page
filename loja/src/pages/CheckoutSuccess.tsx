import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'

export default function CheckoutSuccess() {
  const navigate = useNavigate()
  const { state } = useCart()
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Clear cart on success page mount
    try {
      localStorage.removeItem('cart_products')
      localStorage.removeItem('cart_gift')
    } catch {}
    const timer = setTimeout(() => setShowContent(true), 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-1 flex flex-col w-full max-w-[360px] mx-auto px-4 pb-20 pt-8">
        {/* Success Animation */}
        <div className="flex flex-col items-center justify-center py-10">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
            >
              <CheckCircle2 size={48} className="text-green-600" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-2xl font-bold text-gray-900 mb-2"
          >
            Pagamento Confirmado!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-gray-500 text-center mb-2"
          >
            Seu pedido foi processado com sucesso.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-sm text-gray-400 text-center mb-8"
          >
            Enviamos um e-mail de confirmação com os detalhes.
          </motion.p>
        </div>

        {/* Order Info */}
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6"
          >
            <h3 className="font-semibold text-green-900 mb-3">Detalhes do Pedido</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">Status</span>
                <span className="font-medium text-green-600">PAGO</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Forma de Pagamento</span>
                <span className="font-medium text-green-800">PIX</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Itens</span>
                <span className="font-medium text-green-800">
                  {state.totalItems || 0} {state.totalItems === 1 ? 'item' : 'itens'}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-3 mt-auto"
          >
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/minha-conta')}
              className="w-full bg-rose-600 text-white font-semibold py-3 rounded-xl hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag size={18} />
              Ver Meus Pedidos
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
              className="w-full border border-gray-300 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              Continuar Comprando
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        )}

        {/* Loading state before content shows */}
        {!showContent && (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin text-rose-600" size={32} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
