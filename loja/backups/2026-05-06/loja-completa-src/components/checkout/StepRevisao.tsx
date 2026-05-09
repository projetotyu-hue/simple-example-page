import { useCheckout } from '../../context/CheckoutContext'
import CartReviewItem from './CartReviewItem'
import GiftReviewBox from './GiftReviewBox'
import ShippingSelector from './ShippingSelector'
import PaymentSelector from './PaymentSelector'
import UpsellProtection from './UpsellProtection'
import UrgencyBar from './UrgencyBar'
import ScarcityBadge from './ScarcityBadge'
import type { CartProduct, GiftItem } from '../../types/cart'
import type { Order } from '../../types/checkout'
import { Lock, ChevronLeft } from 'lucide-react'

interface StepRevisaoProps {
  onGoToPayment?: () => void
}

export default function StepRevisao({ onGoToPayment }: StepRevisaoProps) {
  const { state, dispatch, totalItems, totalPrice, shippingOptions, protectionProduct, createPayment } = useCheckout()
  const SHOP_NAME = 'Achadinhos do Momento'

  const getCartData = () => {
    try {
      const saved = localStorage.getItem('cart_products')
      if (saved) return JSON.parse(saved) as CartProduct[]
    } catch {}
    return [] as CartProduct[]
  }

  const getGiftData = () => {
    try {
      const saved = localStorage.getItem('cart_gift')
      if (saved) return JSON.parse(saved) as GiftItem | null
    } catch {}
    return null
  }

  const products = getCartData()
  const gift = getGiftData()

  const shippingCost = state.shipping?.price || 0
  const upsellCost = (state.upsellProtection && protectionProduct?.enabled) ? (protectionProduct?.price || 26.14) : 0
  const total = totalPrice + shippingCost + upsellCost

  const formatPrice = (price: number) =>
    price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const handleFinalize = async () => {
    if (!state.paymentMethod) {
      // Scroll até o seletor de pagamento
      const paymentEl = document.getElementById('payment-selector')
      if (paymentEl) paymentEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

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
        status: 'idle',
        transactionId: null,
        provider: null,
      },
      totals: {
        subtotal: totalPrice,
        shipping: shippingCost,
        upsell: upsellCost,
        total: total,
      },
      status: 'draft',
    }

    dispatch({ type: 'SET_SUBMITTING', payload: true })

    try {
      await createPayment(order)
      // Vai para o step 3 (PIX) — não sai da página
      if (onGoToPayment) {
        onGoToPayment()
      }
    } catch (error) {
      console.error('Failed to create payment:', error)
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false })
    }
  }

  return (
    <div style={{ paddingBottom: '100px', background: '#f5f5f5', minHeight: '100vh' }}>
      <UrgencyBar />
      <ScarcityBadge />

      <div style={{ padding: '0 12px' }}>
        {/* Produtos */}
        <div
          style={{
            background: '#fff',
            borderRadius: 14,
            overflow: 'hidden',
            marginBottom: 12,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid #f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 700, color: '#333' }}>{SHOP_NAME}</p>
            <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 700 }}>✓ Frete grátis!</span>
          </div>
          <div>
            {products.map((product) => (
              <CartReviewItem key={product.id} item={product} />
            ))}
            {gift && <GiftReviewBox gift={gift} />}
          </div>
        </div>

        {/* Endereço */}
        <div
          style={{
            background: '#fff',
            borderRadius: 14,
            padding: '14px 16px',
            marginBottom: 12,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#333' }}>Endereço de entrega</p>
            <button
              onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })}
              style={{
                fontSize: 12,
                color: '#E1143C',
                fontWeight: 600,
                background: 'none',
                border: 'none',
                padding: '4px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <ChevronLeft size={14} />
              Editar
            </button>
          </div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#222', marginBottom: 2 }}>
            {state.form.fullName || '—'}
          </p>
          <p style={{ fontSize: 12, color: '#666', lineHeight: 1.6 }}>
            {state.form.address}, {state.form.number}
            {state.form.complement ? ` — ${state.form.complement}` : ''}
          </p>
          <p style={{ fontSize: 12, color: '#666' }}>
            {state.form.neighborhood ? `${state.form.neighborhood} — ` : ''}
            {state.form.city}
            {state.form.state ? `/${state.form.state}` : ''}
          </p>
          <p style={{ fontSize: 12, color: '#666' }}>CEP: {state.form.cep}</p>
        </div>

        {/* Frete */}
        <ShippingSelector
          options={shippingOptions}
          selected={state.shipping}
          onSelect={(option) => dispatch({ type: 'SET_SHIPPING', option })}
        />

        {/* Proteção Upsell */}
        {protectionProduct?.enabled !== false && (
          <UpsellProtection
            active={state.upsellProtection}
            onToggle={() => dispatch({ type: 'TOGGLE_UPSELL' })}
            data={protectionProduct}
          />
        )}

        {/* Pagamento */}
        <div
          id="payment-selector"
          style={{
            background: '#fff',
            borderRadius: 14,
            padding: '14px 16px',
            marginBottom: 12,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          <p style={{ fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 12 }}>
            Forma de pagamento
          </p>
          <PaymentSelector />
        </div>

        {/* Resumo do pedido */}
        <div
          style={{
            background: '#fff',
            borderRadius: 14,
            padding: '14px 16px',
            marginBottom: 12,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          <p style={{ fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 12 }}>Resumo do pedido</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: '#666' }}>Subtotal</span>
            <span style={{ fontSize: 13, color: '#333', fontWeight: 500 }}>R$ {formatPrice(totalPrice)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: '#666' }}>Frete</span>
            <span
              style={{
                fontSize: 13,
                fontWeight: shippingCost === 0 ? 700 : 500,
                color: shippingCost === 0 ? '#16a34a' : '#333',
              }}
            >
              {shippingCost === 0 ? 'Grátis' : `R$ ${formatPrice(shippingCost)}`}
            </span>
          </div>
          {state.upsellProtection && protectionProduct?.enabled !== false && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: '#666' }}>Proteção</span>
              <span style={{ fontSize: 13, color: '#333', fontWeight: 500 }}>R$ {formatPrice(upsellCost)}</span>
            </div>
          )}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: '1px solid #f0f0f0',
              paddingTop: 12,
              marginTop: 4,
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>Total</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#E1143C' }}>R$ {formatPrice(total)}</span>
          </div>
          <p style={{ fontSize: 10, color: '#aaa', textAlign: 'right', marginTop: 4 }}>Impostos inclusos</p>

          <div
            style={{
              marginTop: 12,
              background: '#f0fdf4',
              borderRadius: 8,
              padding: '10px 12px',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: 12, color: '#16a34a' }}>
              Você está economizando <strong>R$ 2.391,72</strong> neste pedido.
            </p>
          </div>
        </div>

        {/* Trust badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, padding: '8px 0 4px', flexWrap: 'wrap' }}>
          {[
            { dot: '#22c55e', label: 'SSL Seguro' },
            { dot: '#3b82f6', label: 'Compra Protegida' },
            { dot: '#f59e0b', label: '4.8/5 ★' },
          ].map((b) => (
            <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: b.dot,
                }}
              />
              <span style={{ fontSize: 11, color: '#888' }}>{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed bottom button */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 480,
          background: '#fff',
          borderTop: '1px solid #f0f0f0',
          padding: '12px 16px',
          zIndex: 9999,
          boxSizing: 'border-box',
        }}
      >
        {/* Aviso de expiração */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginBottom: 8 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span style={{ fontSize: 11, color: '#666' }}>
            Oferta expira em{' '}
            <span style={{ color: '#d97706', fontWeight: 700 }}>
              {String(Math.floor(state.timerSeconds / 60)).padStart(2, '0')}:
              {String(state.timerSeconds % 60).padStart(2, '0')}
            </span>
          </span>
        </div>

        <button
          onClick={handleFinalize}
          disabled={state.isSubmitting}
          style={{
            width: '100%',
            height: 54,
            borderRadius: 12,
            background: state.isSubmitting ? '#c41232' : '#E1143C',
            color: '#fff',
            fontSize: 16,
            fontWeight: 700,
            border: 'none',
            cursor: state.isSubmitting ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'background 0.2s',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <Lock size={16} />
          {state.isSubmitting ? 'Processando...' : `Finalizar — R$ ${formatPrice(total)}`}
        </button>
      </div>
    </div>
  )
}
