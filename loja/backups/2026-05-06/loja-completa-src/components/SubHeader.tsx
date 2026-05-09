import { useNavigate } from 'react-router-dom'

interface SubHeaderProps {
  title: string
  borderColor?: string
}

export default function SubHeader({ title, borderColor = '#EAEAEA' }: SubHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="border-b" style={{ borderColor }}>
      <div className="flex items-center px-4 py-3 gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333333" strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-[18px] font-bold text-[#333333]">{title}</h1>
      </div>
    </div>
  )
}
