import { createContext, useContext, useReducer, useEffect, useState, useMemo, type ReactNode } from 'react'
import { supabase } from '../integrations/supabase/client'
import type { CheckoutState, CheckoutAction, ShippingOption } from '../types/checkout'
import { useCart } from './CartContext'

const STATE_KEY = 'checkout_state'

const initialState: CheckoutState = {
  step: 1,
  form: {
    fullName: '',
    cpf: '',
    email: '',
    phone: '',
    cep: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  },
  errors: {},
  shipping: null,
  paymentMethod: 'pix',
  upsellProtection: false,
  timerSeconds: 300,
  isTimerRunning: true,
  pixCopied: false,
  isSubmitting: false,
  pixData: null,
}

function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload }
    case 'UPDATE_FIELD':
      return {
        ...state,
        form: { ...state.form, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: undefined },
      }
    case 'SET_ERRORS':
      return { ...state, errors: action.errors }
    case 'CLEAR_ERRORS':
      return { ...state, errors: {} }
    case 'SET_SHIPPING':
      return { ...state, shipping: action.option }
    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.payload }
    case 'TOGGLE_UPSELL':
      return { ...state, upsellProtection: !state.upsellProtection }
    case 'TICK_TIMER':
      if (state.timerSeconds <= 0) return { ...state, isTimerRunning: false }
      return { ...state, timerSeconds: state.timerSeconds - 1 }
    case 'START_TIMER':
      return { ...state, isTimerRunning: true, timerSeconds: 300 }
    case 'PAUSE_TIMER':
      return { ...state, isTimerRunning: false }
    case 'SET_PIX_COPIED':
      return { ...state, pixCopied: action.payload }
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload }
    case 'SET_PIX_DATA':
      return { ...state, pixData: action.payload, step: 2, isTimerRunning: true, timerSeconds: 300 }
    case 'RESTORE_STATE':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

interface CheckoutContextValue {
  state: CheckoutState
  dispatch: React.Dispatch<CheckoutAction>
  totalItems: number
  totalPrice: number
  shippingOptions: ShippingOption[]
  protectionProduct: any | null
  createPayment: (order: any) => Promise<any>
  cartProducts: any[]
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null)

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(checkoutReducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem(STATE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<CheckoutState>
        return { ...init, ...parsed, isTimerRunning: true }
      }
    } catch {}
    return init
  })

  // Lê do CartContext (carrinho real)
  const { state: cartState } = useCart()
  const cartProducts = cartState.products
  const totalItems = cartState.totalItems
  const totalPrice = cartState.totalPrice

  // Persist state to localStorage
  useEffect(() => {
    try {
      const toSave = {
        step: state.step,
        form: state.form,
        shipping: state.shipping,
        upsellProtection: state.upsellProtection,
        timerSeconds: state.timerSeconds,
      }
      localStorage.setItem(STATE_KEY, JSON.stringify(toSave))
    } catch {}
  }, [state.step, state.form, state.shipping, state.upsellProtection, state.timerSeconds])

  // Timer tick
  useEffect(() => {
    if (!state.isTimerRunning || state.timerSeconds <= 0) return
    const interval = setInterval(() => {
      dispatch({ type: 'TICK_TIMER' })
    }, 1000)
    return () => clearInterval(interval)
  }, [state.isTimerRunning, state.timerSeconds])

  // Dynamic settings from Supabase
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [protectionProduct, setProtectionProduct] = useState<any>(null)

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase
        .from('settings')
        .select('shipping_rates, protection_product')
        .limit(1)
        .single()

      if (data?.shipping_rates && Array.isArray(data.shipping_rates)) {
        const rates = data.shipping_rates as any[]
        const activeRates = rates
          .map(r => ({
            id: r.id,
            label: r.name,
            price: parseFloat(r.price),
            days: r.deadline
          }))

        if (activeRates.length > 0) {
          setShippingOptions(activeRates)
          if (!state.shipping || !activeRates.find(r => r.id === state.shipping?.id)) {
            dispatch({ type: 'SET_SHIPPING', option: activeRates[0] })
          }
        }
      }

      if (data?.protection_product) {
        setProtectionProduct(data.protection_product)
      }
    }
    void loadSettings()
  }, [])

  // Integration layer for payment (VexoPay)
  const createPayment = async (order: any) => {
    const apiUrl = import.meta.env.VITE_API_URL || ''

    // 1️⃣ Prepara o payload para o backend unificado
    const payload = {
      amount: Number(order.totals.total.toFixed(2)), // Valor em reais (API espera reais)
      payerName: order.customer.fullName,
      payerDocument: order.customer.cpf.replace(/\D/g, ''),
      customerEmail: order.customer.email,
      customerPhone: order.customer.phone.replace(/\D/g, ''),
      description: `Compra na Loja - ${order.customer.fullName}`,
      items: cartProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        quantity: p.quantity,
        image_url: p.image_url
      }))
    }

    // 2️⃣ Chama o backend (proxy Vite → localhost:3000)
    const resp = await fetch(`${apiUrl}/api/payments/pix-create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!resp.ok) {
      const text = await resp.text()
      console.error('[Checkout] Erro ao criar PIX:', resp.status, text)
      throw new Error(`Erro ao processar pagamento: ${resp.status}`)
    }

    const result = await resp.json()
    const data = result.data || result

    // 3️⃣ Retorna os dados do PIX
    return {
      transactionId: data.transactionId,
      qrCodeBase64: data.qrCodeBase64,
      qrCodeUrl: data.qrCodeUrl,
      copyPaste: data.copyPaste,
      status: data.status,
      expiresAt: data.expiresAt,
      amount: data.amount,
    }
  }

  return (
    <CheckoutContext.Provider value={{
      state,
      dispatch,
      totalItems,
      totalPrice,
      shippingOptions,
      protectionProduct,
      createPayment,
      cartProducts,
    }}>
      {children}
    </CheckoutContext.Provider>
  )
}

export function useCheckout(): CheckoutContextValue {
  const ctx = useContext(CheckoutContext)
  if (!ctx) throw new Error('useCheckout must be used within CheckoutProvider')
  return ctx
}
