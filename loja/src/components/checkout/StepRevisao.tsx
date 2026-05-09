import { useState } from 'react'
import { useCheckout } from '../../context/CheckoutContext'
import { useCart } from '../../context/CartContext'
import CartReviewItem from './CartReviewItem'
import GiftReviewBox from './GiftReviewBox'
import ShippingSelector from './ShippingSelector'
import PaymentSelector from './PaymentSelector'
import UpsellProtection from './UpsellProtection'
import UrgencyBar from './UrgencyBar'
import ScarcityBadge from './ScarcityBadge'
import type { CartProduct, GiftItem } from '../../types/cart'
import type { Order } from '../../types/checkout'
import { Lock, ChevronLeft, Loader2, Check } from 'lucide-react'

interface StepRevisaoProps {
  onGoToPayment?: () => void
}

export default function StepRevisao({ onGoToPayment }: StepRevisaoProps) {
  const { state, dispatch, totalItems, totalPrice, shippingOptions, protectionProduct, createPayment } = useCheckout()
  const { state: cartState } = useCart()
  const SHOP_NAME = 'Achadinhos do Momento'

  const products = cartState.products
  const gift = cartState.gift

  const shippingCost = state.shipping?.price || 0
  const upsellCost = state.upsellProtection ? (protectionProduct?.price || 26.14) : 0
  const total = totalPrice + shippingCost + upsellCost

  const formatPrice = (price: number) =>
    price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const [isSubmittingLocal, setIsSubmittingLocal] = useState(false)

  const handleFinalize = async () => {
    if (isSubmittingLocal) return // Debounce simples
    if (!state.paymentMethod) {
      alert('Por favor, selecione uma forma de pagamento.')
      const paymentEl = document.getElementById('payment-selector')
      if (paymentEl) paymentEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setIsSubmittingLocal(true)
    // Limpa cache antigo para evitar 429
    try { localStorage.removeItem('checkout_state') } catch {}

    const order: Order = {
      items: products,
      customer: {
        fullName: state.form.fullName,
        cpf: state.form.cpf,
        email: state.form.email,
        phone: state.form.phone,
      },
      address: {
        cep: state.form.cep,
        address: state.form.address,
        number: state.form.number,
        complement: state.form.complement,
        neighborhood: state.form.neighborhood,
        city: state.form.city,
        state: state.form.state,
      },
      shipping: state.shipping
        ? {
            id: state.shipping.id,
            name: state.shipping.label,
            price: state.shipping.price,
            days: state.shipping.days,
          }
        : null,
      payment: {
        method: state.paymentMethod,
        status: 'pending' as const,
        transactionId: null,
        provider: null,
      },
      totals: {
        subtotal: totalPrice,
        shipping: shippingCost,
        upsell: upsellCost,
        total,
      },
      status: 'pending' as const,
    }

    try {
      dispatch({ type: 'SET_SUBMITTING', payload: true })
      const pixData = await createPayment(order)
      if (pixData) {
        // Salva os dados do PIX no contexto e avança para step 2 (PIX)
        dispatch({ type: 'SET_PIX_DATA', payload: pixData })
        if (onGoToPayment) onGoToPayment()
      }
    } catch (error: any) {
      console.error('Erro ao finalizar:', error)
      let msg = error.message || 'Erro desconhecido'
      if (msg.includes('429')) {
        msg = 'Muitas tentativas. Aguarde alguns minutos ou use outro CPF.'
      }
      alert('Erro ao processar pagamento: ' + msg)
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false })
      setIsSubmittingLocal(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Urgency / Scarcity */}
      <UrgencyBar />
      <ScarcityBadge />

      {/* Order Items Review */}
      <div className="bg-white rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Itens do Pedido</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {products.map((product) => (
            <CartReviewItem
              key={`${product.id}-${product.variation || 'default'}`}
              item={product}
            />
          ))}
        </div>
        {gift && <GiftReviewBox gift={gift} />}
      </div>

      {/* Shipping */}
      <ShippingSelector
        options={shippingOptions}
        selected={state.shipping}
        onSelect={(opt) => dispatch({ type: 'SET_SHIPPING', option: opt })}
      />

      {/* Payment */}
      <PaymentSelector />

      {/* Upsell Protection */}
      <UpsellProtection
        active={state.upsellProtection}
        onToggle={() => dispatch({ type: 'TOGGLE_UPSELL' })}
        data={protectionProduct ? {
          title: protectionProduct.name,
          price: protectionProduct.price,
          image_url: protectionProduct.image || '',
        } : undefined}
      />

      {/* Totals */}
      <div className="bg-white rounded-xl p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'itens'})</span>
          <span className="font-medium text-gray-900">{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Frete</span>
          <span className="font-medium text-gray-900">{formatPrice(shippingCost)}</span>
        </div>
        {upsellCost > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Proteção de Compras</span>
            <span className="font-medium text-gray-900">{formatPrice(upsellCost)}</span>
          </div>
        )}
        <div className="pt-2 border-t border-gray-200 flex justify-between">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="font-bold text-lg text-rose-600">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Security */}
      <div className="flex items-center gap-2 text-xs text-gray-400 justify-center">
        <Lock size={12} />
        <span>Compra 100% segura e criptografada</span>
      </div>

      {/* Finalize Button */}
      <button
        onClick={handleFinalize}
        disabled={state.isSubmitting}
        className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {state.isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Processando...
          </>
        ) : (
          <>
            <Check size={18} />
            Finalizar Compra • {formatPrice(total)}
          </>
        )}
      </button>
    </div>
  )
}
