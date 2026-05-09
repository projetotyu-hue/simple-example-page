import { useParams, Navigate } from 'react-router-dom'
import UpsellAlfandega from '../components/checkout/UpsellAlfandega'
import UpsellNotaFiscal from '../components/checkout/UpsellNotaFiscal'
import UpsellProtectionPage from '../components/checkout/UpsellProtectionPage'

export default function UpsellPage() {
  const { id } = useParams<{ id: string }>()

  if (id === 'upsell1') {
    return <UpsellAlfandega />
  }

  if (id === 'upsell2') {
    return <UpsellNotaFiscal />
  }

  if (id === 'upsell3') {
    return <UpsellProtectionPage />
  }

  // Se for qualquer outro, mandamos para o erro
  return <Navigate to="/erro-pagamento" replace />
}
