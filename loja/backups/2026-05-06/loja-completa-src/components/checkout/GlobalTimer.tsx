import { useCheckout } from '../../context/CheckoutContext'
import { formatTimer, getTimerColor } from '../../hooks/useTimer'

export default function GlobalTimer() {
  const { state } = useCheckout()
  const { timerSeconds } = state

  const formatted = formatTimer(timerSeconds)
  const color = getTimerColor(timerSeconds)
  const isLow = timerSeconds < 120

  return (
    <div className="flex items-center justify-center py-2" style={{ backgroundColor: isLow ? '#FFF8E1' : '#FFFFFF' }}>
      <div className="flex items-center gap-2" style={{ color }} >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 4v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="text-sm font-medium">
          {formatted}
        </span>
      </div>
    </div>
  )
}
