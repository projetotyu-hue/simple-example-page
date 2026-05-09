import { useCheckout } from '../../context/CheckoutContext'

export default function UrgencyBar() {
  const { state } = useCheckout()
  const { timerSeconds } = state

  const m = Math.floor(timerSeconds / 60)
  const s = timerSeconds % 60

  return (
    <div className="bg-[#E11D48] text-white rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 mb-3 shadow-sm">
      <span className="text-sm font-medium">
        ⏱ {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')} para pagar
      </span>
    </div>
  )
}
