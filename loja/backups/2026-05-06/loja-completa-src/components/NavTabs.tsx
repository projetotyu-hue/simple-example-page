import { Link, useLocation } from 'react-router-dom'

const tabs = [
  { name: 'Página Inicial', path: '/' },
  { name: 'Produtos', path: '/produtos' },
  { name: 'Categorias', path: '/categorias' },
]

export default function NavTabs() {
  const location = useLocation()
  const activeIdx = tabs.findIndex(t => t.path === location.pathname) ?? 0

  return (
    <div className="flex border-b border-gray-100 px-4 sticky top-[57px] bg-white z-30">
      {tabs.map((tab, i) => (
        <Link
          key={tab.name}
          to={tab.path}
          className={`px-3 py-3 text-sm transition-colors font-medium ${
            activeIdx === i
              ? 'text-rose-600 border-b-2 border-rose-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.name}
        </Link>
      ))}
    </div>
  )
}

