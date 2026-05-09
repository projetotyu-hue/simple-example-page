import { useNavigate } from 'react-router-dom'

interface ChatHeaderProps {
  title?: string
}

export default function ChatHeader({ title = 'Chat' }: ChatHeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 w-full">
      <div className="px-4 py-4 flex items-center justify-between gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2.5">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-sm font-bold text-[var(--text-primary)]">{title}</h1>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Atendente Online</span>
          </div>
        </div>
        <div className="w-8" />
      </div>
    </header>
  )
}
