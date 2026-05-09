import { useNavigate } from 'react-router-dom'

interface CartHeaderProps {
  itemCount: number
}

export default function CartHeader({ itemCount }: CartHeaderProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--primary)] shadow-md">
      <div className="px-4 py-4 flex items-center gap-3">
        <button
          onClick={handleBack}
          className="p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-white tracking-wide">
          Carrinho ({itemCount})
        </h1>
        <div className="w-8" />
      </div>
    </header>
  )
}
