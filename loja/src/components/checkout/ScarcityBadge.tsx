import { useState, useEffect } from 'react'
import { Eye } from 'lucide-react'

export default function ScarcityBadge() {
  const [viewing, setViewing] = useState(() => Math.floor(Math.random() * 25) + 15)
  const [remaining, setRemaining] = useState(() => Math.floor(Math.random() * 7) + 3)

  useEffect(() => {
    const interval = setInterval(() => {
      setViewing(prev => {
        const diff = Math.floor(Math.random() * 5) - 2
        return Math.max(10, prev + diff)
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex-1 bg-[#FFFBEB] border border-[#FEF3C7] rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm">
        <Eye size={14} className="text-[#F59E0B] shrink-0" />
        <p className="text-[11px] text-[#B45309] font-semibold">{viewing} pessoas vendo agora</p>
      </div>
      <div className="bg-[#FFF1F2] border border-[#FFE4E6] rounded-xl px-3 py-2 shrink-0 shadow-sm">
        <p className="text-[11px] text-[#E11D48] font-semibold">⚠️ Só {remaining} restantes!</p>
      </div>
    </div>
  )
}
