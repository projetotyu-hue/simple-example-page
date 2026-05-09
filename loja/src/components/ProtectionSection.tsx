import { ShieldCheck, Check } from 'lucide-react'

const protectionItems = [
  'Devolução gratuita',
  'Pagamento seguro',
  'Reembolso automático',
  'Cupom por atraso',
]

export default function ProtectionSection() {
  return (
    <div className="px-4 py-4">
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck size={18} style={{ color: '#F59E0B' }} />
        <Check size={18} style={{ color: '#22C55E' }} />
        <h3 className="text-[15px] font-semibold text-[#333333]">Proteção do cliente</h3>
      </div>
      <ul className="space-y-1.5">
        {protectionItems.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: '#F59E0B' }}
            />
            <span className="text-[13px] text-[#777777]">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
