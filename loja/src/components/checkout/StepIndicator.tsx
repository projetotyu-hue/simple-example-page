import type { CheckoutStep } from '../../types/checkout'

const steps = [
  { num: 1, label: 'Dados' },
  { num: 2, label: 'Revisão' },
  { num: 3, label: 'Pagamento' },
]

interface StepIndicatorProps {
  currentStep: CheckoutStep
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center px-4 py-4 gap-2">
      {steps.map((step, index) => (
        <div key={step.num} className="flex items-center flex-1">
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors ${
                step.num <= currentStep 
                  ? 'bg-[var(--primary)] text-white' 
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {step.num}
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${
              step.num <= currentStep ? 'text-[var(--text-primary)]' : 'text-gray-400'
            }`}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-[2px] mx-2 transition-colors ${
                step.num < currentStep ? 'bg-[var(--primary)]' : 'bg-gray-100'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
