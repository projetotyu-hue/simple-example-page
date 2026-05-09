import { Search } from 'lucide-react'

export default function SearchBar() {
  return (
    <div className="px-3">
      <div className="flex items-center bg-[#F3F3F3] rounded-full h-11 px-4 gap-2">
        <Search size={16} className="text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Buscar produto..."
          className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
        />
      </div>
    </div>
  )
}
