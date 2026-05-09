import { useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster } from 'sonner'
import StepDados from '../components/checkout/StepDados'
import StepRevisao from '../components/checkout/StepRevisao'
import StepPIX from '../components/checkout/StepPIX'
import CheckoutFooter from '../components/checkout/CheckoutFooter'
import Header from '../components/Header'
import { useCheckout } from '../context/CheckoutContext'
import { validateStep1 } from '../components/checkout/StepDados'
import type { CheckoutStep } from '../types/checkout'
import { ArrowLeft, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const pageVariants = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
}

export default function CheckoutPage() {
  const { state, dispatch } = useCheckout()
  const navigate = useNavigate()

  const handleStepChange = useCallback(
    (newStep: CheckoutStep) => {
      dispatch({ type: 'SET_STEP', payload: newStep })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [dispatch]
  )

  const handleFooterClick = () => {
    if (state.step === 1) {
      const errors = validateStep1(state.form)
      if (Object.keys(errors).length > 0) {
        dispatch({ type: 'SET_ERRORS', errors })
        // Scroll para o topo para o usuário ver os erros
        const firstErrorField = document.querySelector('[data-error="true"]')
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
        return
      }
      dispatch({ type: 'CLEAR_ERRORS' })
      handleStepChange(2)
    }
  }

  const handleBack = () => {
    if (state.step > 1) {
      handleStepChange((state.step - 1) as CheckoutStep)
    } else {
      navigate(-1)
    }
  }

  const StepperItem = ({
    stepNum,
    label,
    isActive,
    isCompleted,
  }: {
    stepNum: number
    label: string
    isActive: boolean
    isCompleted: boolean
  }) => (
    <div className="flex items-center gap-2">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${
          isCompleted
            ? 'bg-[#E1143C] text-white'
            : isActive
            ? 'bg-[#E1143C] text-white'
            : 'bg-gray-200 text-gray-500'
        }`}
      >
        {isCompleted ? <Check size={11} strokeWidth={3} /> : stepNum}
      </div>
      <span
        className={`text-[12px] font-medium whitespace-nowrap ${
          isActive ? 'text-gray-900' : isCompleted ? 'text-gray-600' : 'text-gray-400'
        }`}
      >
        {label}
      </span>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" richColors />

      <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col shadow-sm overflow-x-hidden">
        <Header />

        {/* Back + Title */}
        <div
          className="px-4 flex items-center gap-3 bg-white border-b border-gray-100"
          style={{ minHeight: 48 }}
        >
          <button
            onClick={handleBack}
            className="text-gray-600 active:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"
            style={{ minWidth: 40, minHeight: 40 }}
            aria-label="Voltar"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-[14px] font-semibold text-gray-800">Checkout</h1>
        </div>

        {/* Stepper */}
        <div className="px-5 py-3 flex items-center bg-white border-b border-gray-50" style={{ gap: 0 }}>
          <StepperItem
            stepNum={1}
            label="Dados"
            isActive={state.step === 1}
            isCompleted={state.step > 1}
          />
          <div className="flex-1 h-px bg-gray-200 mx-2" />
          <StepperItem
            stepNum={2}
            label="Revisão"
            isActive={state.step === 2}
            isCompleted={state.step > 2}
          />
          <div className="flex-1 h-px bg-gray-200 mx-2" />
          <StepperItem
            stepNum={3}
            label="Pagamento"
            isActive={state.step === 3}
            isCompleted={state.step > 3}
          />
        </div>

        {/* Content */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={state.step}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="min-h-full"
            >
              {state.step === 1 && <StepDados />}
              {state.step === 2 && <StepRevisao onGoToPayment={() => handleStepChange(3)} />}
              {state.step === 3 && <StepPIX />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer fixo – só aparece no step 1 */}
        <CheckoutFooter
          step={state.step}
          isSubmitting={false}
          onClick={handleFooterClick}
        />
      </div>
    </div>
  )
}
