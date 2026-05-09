import { ChevronDown } from 'lucide-react'

interface FAQItemProps {
  question: string
  isActive: boolean
  onClick: () => void
}

export default function FAQItem({ question, isActive, onClick }: FAQItemProps) {
  return (
    <button
      className="w-full text-left transition-colors"
      style={{
        backgroundColor: isActive ? '#FFF0F3' : '#FFFFFF',
        border: isActive ? '1px solid #FF2D55' : '1px solid #EEEEEE',
        borderRadius: '10px',
        padding: '16px',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
      }}
      onClick={onClick}
      aria-expanded={isActive}
    >
      <div className="flex items-center gap-2">
        <span
          className="flex-1 text-left text-[15px] font-semibold"
          style={{ color: isActive ? '#FF2D55' : '#333333' }}
        >
          {question}
        </span>
        <ChevronDown
          size={18}
          style={{
            color: isActive ? '#FF2D55' : '#999999',
            transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s ease',
            flexShrink: 0,
          }}
        />
      </div>
    </button>
  )
}
