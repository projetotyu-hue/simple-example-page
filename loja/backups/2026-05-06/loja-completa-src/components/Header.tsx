import { Link } from 'react-router-dom'
import { House, Search, User } from 'lucide-react'
import { useState, useEffect } from 'react'

const SHOP_NAME = 'Achadinhos do Momento'

export default function Header() {
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('cart_products')
    if (saved) {
      try {
        const products = JSON.parse(saved) as Array<{ quantity: number }>
        const total = products.reduce((sum, p) => sum + p.quantity, 0)
        setCartCount(total)
      } catch {
        setCartCount(0)
      }
    } else {
      setCartCount(0)
    }
  }, [])

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 w-full">
      <div className="px-4 py-3 flex items-center gap-3">
        <Link to="/" className="shrink-0 flex items-center justify-center" style={{ minWidth: '48px', minHeight: '48px' }}>
          <span className="text-lg font-bold text-rose-600 tracking-tight">
            <House size={24} aria-hidden="true" />
          </span>
        </Link>
        <form className="flex-1" onSubmit={(e) => e.preventDefault()}>
          <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 gap-2">
            <Search size={14} className="text-gray-400 shrink-0" aria-hidden="true" />
            <input
              type="text"
              placeholder="Pesquisar"
              inputMode="search"
              className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
        </form>
        <div className="flex items-center gap-1 shrink-0">
          <Link
            to="/minha-conta"
            className="p-3 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
            style={{ minWidth: '48px', minHeight: '48px' }}
          >
            <User size={24} className="text-gray-600" aria-hidden="true" />
          </Link>
          <Link
            to="/carrinho"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors relative flex items-center justify-center"
            style={{ minWidth: '48px', minHeight: '48px' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart text-gray-600" aria-hidden="true"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E1143C] text-white text-[9px] font-bold min-w-[14px] h-[14px] rounded-full flex items-center justify-center px-0.5">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
