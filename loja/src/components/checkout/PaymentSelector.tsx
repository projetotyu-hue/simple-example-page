import { useCheckout } from '../../context/CheckoutContext'

export default function PaymentSelector() {
  const { state, dispatch } = useCheckout()
  const { paymentMethod } = state

  const handleSelect = (method: 'pix' | 'card') => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: method })
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => handleSelect('pix')}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
          paymentMethod === 'pix'
            ? 'border-[#E1143C] bg-rose-50 shadow-sm'
            : 'border-gray-100 bg-white hover:border-gray-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E1143C] flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <div className="text-left">
            <p className="text-[13px] font-semibold text-gray-800">Pix</p>
            <p className="text-[11px] text-gray-500 leading-tight">Pague em até 10 minutos para receber até dia 12/05.</p>
          </div>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
          paymentMethod === 'pix' ? 'border-[#E1143C]' : 'border-gray-300'
        }`}>
          {paymentMethod === 'pix' && <div className="w-2.5 h-2.5 rounded-full bg-[#E1143C]" />}
        </div>
      </button>

      <button
        disabled
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-white opacity-60 cursor-not-allowed"
      >
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
        </div>
        <div className="text-left">
          <p className="text-[13px] font-semibold text-gray-800">Adicionar cartão de crédito</p>
          <p className="text-[11px] text-gray-400">Indisponível no momento</p>
        </div>
      </button>
    </div>
  )
}
