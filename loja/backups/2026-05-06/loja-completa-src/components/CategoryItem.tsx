import { Link } from 'react-router-dom'
import { Package, ChevronRight } from 'lucide-react'

interface CategoryItemProps {
  name: string
  id: string
  count: number
  showDivider?: boolean
}

export default function CategoryItem({ name, id, count, showDivider }: CategoryItemProps) {
  const slug = name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-')

  return (
    <Link
      to={`/produtos?categoria=${slug}`}
      className="flex items-center gap-3 py-4 border-b border-gray-50"
    >
      <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
        <Package size={18} className="text-rose-400" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800">{name}</p>
        <p className="text-xs text-gray-400">{count} {count === 1 ? 'produto' : 'produtos'}</p>
      </div>
      <ChevronRight size={16} className="text-gray-300 shrink-0" aria-hidden="true" />
    </Link>
  )
}
