import { ShoppingCart } from 'lucide-react'

interface ChatMessageProps {
  message: string
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className="flex items-start gap-2 px-4 py-3">
      <div
        className="flex items-center justify-center shrink-0"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#FFEDEE',
        }}
      >
        <ShoppingCart size={20} style={{ color: '#FF2D55' }} />
      </div>
      <div
        className="py-3 px-4"
        style={{
          backgroundColor: '#F5F5F5',
          borderRadius: '12px',
          padding: '12px',
          maxWidth: '85%',
        }}
      >
        <p className="text-[14px] text-[#333333] leading-relaxed">{message}</p>
      </div>
    </div>
  )
}
