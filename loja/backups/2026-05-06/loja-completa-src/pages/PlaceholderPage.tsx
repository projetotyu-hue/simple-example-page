import { useNavigate } from 'react-router-dom'

interface Props {
  title: string
}

export default function PlaceholderPage({ title }: Props) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col shadow-sm">
        <header className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 z-40">
          <button onClick={() => navigate(-1)} className="text-gray-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h1 className="text-sm font-bold text-gray-800">{title}</h1>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-400 text-sm">{title} em breve</p>
        </main>
      </div>
    </div>
  )
}
