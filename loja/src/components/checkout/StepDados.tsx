import { useCheckout } from '../../context/CheckoutContext'
import type { CheckoutFormErrors } from '../../types/checkout'
import DadosForm from './DadosForm'

export function validateStep1(form: any): CheckoutFormErrors {
  const errors: CheckoutFormErrors = {}

  if (!form.fullName?.trim()) errors.fullName = 'Nome completo é obrigatório'
  if (!form.cpf?.replace(/\D/g, '')) errors.cpf = 'CPF é obrigatório'
  else if (form.cpf?.replace(/\D/g, '').length !== 11) errors.cpf = 'CPF inválido (11 dígitos)'
  if (!form.email?.trim()) errors.email = 'Email é obrigatório'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Email inválido'
  if (!form.phone?.replace(/\D/g, '')) errors.phone = 'Telefone é obrigatório'
  else if (form.phone?.replace(/\D/g, '').length < 10) errors.phone = 'Telefone inválido'
  if (!form.cep?.replace(/\D/g, '')) errors.cep = 'CEP é obrigatório'
  else if (form.cep?.replace(/\D/g, '').length !== 8) errors.cep = 'CEP inválido'
  if (!form.address?.trim()) errors.address = 'Rua é obrigatória'
  if (!form.number?.trim()) errors.number = 'Número é obrigatório'
  if (!form.city?.trim()) errors.city = 'Cidade é obrigatória'

  return errors
}

export default function StepDados() {
  return (
    <div style={{ paddingBottom: '100px', background: '#fff' }}>
      <DadosForm />
    </div>
  )
}
