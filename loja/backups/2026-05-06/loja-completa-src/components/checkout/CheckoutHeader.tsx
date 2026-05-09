import { useNavigate } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import StepIndicator from './StepIndicator'
import type { CheckoutStep } from '../../types/checkout'

interface CheckoutHeaderProps {
  step: CheckoutStep
}

export default function CheckoutHeader({ step }: CheckoutHeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100">
      <div className="px-4 py-4 flex items-center justify-between gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2.5">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <h1 className="flex-1 text-center text-sm font-bold text-[var(--text-primary)] uppercase tracking-widest">
          Checkout Seguro
        </h1>
        <div className="w-8 flex items-center justify-center">
           <ShieldCheck size={18} className="text-green-500" />
        </div>
      </div>
      <StepIndicator currentStep={step} />
    </header>
  )
}
