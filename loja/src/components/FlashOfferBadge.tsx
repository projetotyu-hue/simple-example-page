import { useState, useEffect } from 'react'

interface FlashOfferBadgeProps {
  endTime: Date // Data/hora final da oferta
  className?: string
}

export default function FlashOfferBadge({ endTime, className = '' }: FlashOfferBadgeProps) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const end = endTime.getTime()
      const diff = Math.max(0, end - now)

      const h = Math.floor(diff / (1000 * 60 * 60))
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const s = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({ h, m, s })
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(interval)
  }, [endTime])

  const formatTime = (num: number) => String(num).padStart(2, '0')

  return (
    <div
      className={`inline-flex items-center gap-[6px] px-[10px] py-[6px] rounded-[999px] whitespace-nowrap w-fit ${className}`}
      style={{
        background: '#FFF4E5',
        border: '1px solid #FFD8A8',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      }}
    >
      {/* Ícone Raio - Menor destaque */}
      <span
        style={{
          color: '#FF8A00',
          fontSize: '14px',
          lineHeight: '1',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        ⚡
      </span>

      {/* Texto Label - Médio destaque */}
      <span
        style={{
          color: '#8A5A00',
          fontSize: '11px',
          fontWeight: 500,
          lineHeight: '1.2',
        }}
      >
        Oferta Relâmpago
      </span>

      {/* TIMER - MAIOR DESTAQUE VISUAL */}
      <span
        style={{
          color: '#FF6B00',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0.5px',
          fontFamily: 'monospace',
          lineHeight: '1.2',
        }}
      >
        {formatTime(timeLeft.h)}:{formatTime(timeLeft.m)}:{formatTime(timeLeft.s)}
      </span>
    </div>
  )
}
