import { createContext, useContext, useReducer, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../integrations/supabase/client'
import type { CheckoutState, CheckoutAction, ShippingOption } from '../types/checkout'

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
  paymentMethod: null,
  upsellProtection: false,
  timerSeconds: 600,
  isTimerRunning: true,
  pixCopied: false,
  isSubmitting: false,
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
      return { ...state, isTimerRunning: true }
    case 'PAUSE_TIMER':
      return { ...state, isTimerRunning: false }
    case 'SET_PIX_COPIED':
      return { ...state, pixCopied: action.payload }
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload }
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
      const { data } = await supabase.from('settings').select('shipping_rates, protection_product').limit(1).single()
      
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
          // If no shipping selected or selected is not in options, select the first one
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

  // Get cart from localStorage
  const getCartData = () => {
    try {
      const saved = localStorage.getItem('cart_products')
      if (saved) return JSON.parse(saved) as Array<{ price: number; quantity: number }>
    } catch {}
    return []
  }

  const cartProducts = getCartData()
  const totalItems = cartProducts.reduce((sum, p) => sum + p.quantity, 0)
  const totalPrice = cartProducts.reduce((sum, p) => sum + p.price * p.quantity, 0)

  // Integration layer for payment (Mock)
  const createPayment = async (order: any) => {
    // 1️⃣ Salva cliente na tabela "clients"
    const clientData = {
      full_name: order.customer.fullName,
      cpf: order.customer.cpf.replace(/\D/g, ''),
      email: order.customer.email,
      phone: order.customer.phone.replace(/\D/g, ''),
    }
    const { data: client, error: clientErr } = await supabase
      .from('clients')
      .insert([clientData])
      .select()
      .single()
    if (clientErr) throw clientErr
    const clientId = (client as any)?.id

    // 2️⃣ Salva pedido na tabela "orders"
    const orderData = {
      client_id: clientId,
      items: order.items,
      address: order.address,
      shipping: order.shipping,
      payment_method: order.payment.method,
      status: 'pending',
      totals: order.totals,
    }
    const { error: orderErr } = await supabase.from('orders').insert([orderData])
    if (orderErr) throw orderErr

    // 3️⃣ Retorna objeto de confirmação (pode ser usado pelo front‑end)
    return {
      ...order,
      client_id: clientId,
      status: 'pending',
      payment: {
        ...order.payment,
        status: 'pending',
        transactionId: null,
        provider: null,
      },
    }
  }

  return (
    <CheckoutContext.Provider value={{ state, dispatch, totalItems, totalPrice, shippingOptions, protectionProduct, createPayment }}>
      {children}
    </CheckoutContext.Provider>
  )
}

export function useCheckout(): CheckoutContextValue {
  const ctx = useContext(CheckoutContext)
  if (!ctx) throw new Error('useCheckout must be used within CheckoutProvider')
  return ctx
}
