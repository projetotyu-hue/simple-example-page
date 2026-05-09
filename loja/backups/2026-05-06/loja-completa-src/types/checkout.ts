export type CheckoutStep = 1 | 2 | 3

export interface CheckoutFormData {
  fullName: string
  cpf: string
  email: string
  phone: string
  cep: string
  address: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
}

export type CheckoutFormErrors = Partial<Record<keyof CheckoutFormData, string>>

export interface ShippingOption {
  id: string
  label: string
  price: number
  days: string
}

export interface OrderCustomer {
  fullName: string
  cpf: string
  email: string
  phone: string
}

export interface OrderAddress {
  cep: string
  address: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
}

export interface OrderShipping {
  id: string
  name: string
  price: number
  days: string
}

export interface OrderPayment {
  method: 'pix' | 'card' | null
  status: 'idle' | 'pending' | 'paid' | 'failed'
  transactionId: string | null
  provider: string | null
}

export interface OrderTotals {
  subtotal: number
  shipping: number
  upsell: number
  total: number
}

export interface Order {
  items: any[]
  customer: OrderCustomer
  address: OrderAddress
  shipping: OrderShipping | null
  payment: OrderPayment
  totals: OrderTotals
  status: 'draft' | 'pending' | 'completed' | 'failed'
}

export interface CheckoutState {
  step: CheckoutStep
  form: CheckoutFormData
  errors: CheckoutFormErrors
  shipping: ShippingOption | null
  paymentMethod: 'pix' | 'card' | null
  upsellProtection: boolean
  timerSeconds: number
  isTimerRunning: boolean
  pixCopied: boolean
  isSubmitting: boolean
}

export type CheckoutAction =
  | { type: 'SET_STEP'; payload: CheckoutStep }
  | { type: 'UPDATE_FIELD'; field: keyof CheckoutFormData; value: string }
  | { type: 'SET_ERRORS'; errors: CheckoutFormErrors }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SET_SHIPPING'; option: ShippingOption }
  | { type: 'SET_PAYMENT_METHOD'; payload: 'pix' | 'card' | null }
  | { type: 'TOGGLE_UPSELL' }
  | { type: 'TICK_TIMER' }
  | { type: 'START_TIMER' }
  | { type: 'PAUSE_TIMER' }
  | { type: 'SET_PIX_COPIED'; payload: boolean }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'RESTORE_STATE'; payload: Partial<CheckoutState> }
