import type { ShippingOption } from '../../types/checkout'

interface ShippingSelectorProps {
  options: ShippingOption[]
  selected: ShippingOption | null
  onSelect: (option: ShippingOption) => void
}

export default function ShippingSelector({ options, selected, onSelect }: ShippingSelectorProps) {
  const formatPrice = (price: number) => price.toFixed(2).replace('.', ',')

  return (
    <div className="bg-white border border-gray-100 rounded-xl px-4 py-4 mb-4 shadow-sm">
      <p className="text-sm font-medium text-gray-700 mb-3">Escolha uma forma de entrega:</p>
      <div className="flex flex-col gap-2">
        {options.map((option) => {
          const isSelected = selected?.id === option.id
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
                isSelected 
                  ? 'border-green-400 bg-green-50 shadow-sm' 
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  isSelected ? 'border-green-500' : 'border-gray-300'
                }`}>
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-in zoom-in" />}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-800">{option.label}</p>
                  <p className="text-xs text-gray-400">{option.days}</p>
                </div>
              </div>
              <span className={`text-sm font-bold ${option.price === 0 ? 'text-green-600' : 'text-gray-800'}`}>
                {option.price === 0 ? 'Grátis' : `R$ ${formatPrice(option.price)}`}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
