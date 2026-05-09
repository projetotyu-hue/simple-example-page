import { useEffect, useRef } from 'react'

interface ToastNotificationProps {
  message: string
  type: 'success' | 'error'
  isVisible: boolean
  onClose: () => void
}

export default function ToastNotification({ message, type, isVisible, onClose }: ToastNotificationProps) {
  const elRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isVisible) return

    const el = document.createElement('div')
    el.id = 'toast-notification'
    Object.assign(el.style, {
      position: 'fixed',
      top: '20vh',
      left: '50vw',
      transform: 'translate(-50%, 0)',
      zIndex: '2147483647',
      padding: '12px 16px',
      borderRadius: '8px',
      color: '#FFFFFF',
      fontSize: '14px',
      fontWeight: '500',
      backgroundColor: type === 'success' ? '#22C55E' : '#FF0040',
      transition: 'opacity 0.3s ease',
    })
    el.textContent = message
    document.body.appendChild(el)
    elRef.current = el

    const t = setTimeout(() => {
      el.style.opacity = '0'
      setTimeout(() => {
        el.remove()
        onClose()
      }, 300)
    }, 3000)

    return () => {
      clearTimeout(t)
      el.remove()
    }
  }, [isVisible, message, type, onClose])

  return null
}
