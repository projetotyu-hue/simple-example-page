import { useState, useCallback, useEffect, type ChangeEvent } from 'react'
import { useCheckout } from '../../context/CheckoutContext'
import type { CheckoutFormData } from '../../types/checkout'
import { useCEP } from '../../hooks/useCEP'

function maskCPF(value: string): string {
  const cleaned = value.replace(/\D/g, '').slice(0, 11)
  return cleaned
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
}

function maskPhone(value: string): string {
  const cleaned = value.replace(/\D/g, '').slice(0, 11)
  if (cleaned.length <= 10) {
    return cleaned.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2')
  }
  return cleaned.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2')
}

function maskCEP(value: string): string {
  const cleaned = value.replace(/\D/g, '').slice(0, 8)
  return cleaned.replace(/(\d{5})(\d)/, '$1-$2')
}

const inputBase: React.CSSProperties = {
  height: '50px',
  borderRadius: '10px',
  border: '1.5px solid #E0E0E0',
  padding: '0 14px',
  fontSize: '15px',
  color: '#1A1A1A',
  outline: 'none',
  width: '100%',
  background: '#fff',
  WebkitAppearance: 'none',
  appearance: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 500,
  color: '#555',
  marginBottom: '6px',
  display: 'block',
}

const errorStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#E1143C',
  marginTop: '4px',
}

const fieldWrap: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '14px',
}

export default function DadosForm() {
  const { state, dispatch } = useCheckout()
  const { form } = state
  // When errors come from outside (button click), show all at once
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const cepData = useCEP(form.cep)

  // Quando SET_ERRORS é disparado (botão clicado), marca todos os campos com erro como tocados
  useEffect(() => {
    const errorKeys = Object.keys(state.errors)
    if (errorKeys.length > 0) {
      setTouched((prev) => {
        const next = { ...prev }
        errorKeys.forEach((k) => { next[k] = true })
        return next
      })
    }
  }, [state.errors])

  useEffect(() => {
    if (cepData.data && !state.errors.cep) {
      dispatch({ type: 'UPDATE_FIELD', field: 'address', value: cepData.data.address })
      dispatch({ type: 'UPDATE_FIELD', field: 'neighborhood', value: cepData.data.neighborhood })
      dispatch({ type: 'UPDATE_FIELD', field: 'city', value: cepData.data.city })
      dispatch({ type: 'UPDATE_FIELD', field: 'state', value: cepData.data.state })
    }
  }, [cepData.data])

  const handleChange = useCallback(
    (field: keyof CheckoutFormData) => (e: ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value
      if (field === 'cpf') value = maskCPF(value)
      if (field === 'phone') value = maskPhone(value)
      if (field === 'cep') value = maskCEP(value)
      dispatch({ type: 'UPDATE_FIELD', field, value })
    },
    [dispatch]
  )

  const handleBlur = (field: string) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const getError = (field: keyof CheckoutFormData): string | undefined => {
    return touched[field] ? state.errors[field] : undefined
  }

  const hasError = (field: keyof CheckoutFormData) => !!getError(field)

  const getInputStyle = (field: keyof CheckoutFormData): React.CSSProperties => ({
    ...inputBase,
    border: `1.5px solid ${hasError(field) ? '#E1143C' : '#E0E0E0'}`,
  })

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!e.target.style.borderColor.includes('#E1143C')) {
      e.target.style.border = '1.5px solid #E1143C'
      e.target.style.boxShadow = '0 0 0 3px rgba(225,20,60,0.08)'
    }
  }
  const onBlurStyle = (field: keyof CheckoutFormData) => (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.boxShadow = 'none'
    e.target.style.border = `1.5px solid ${hasError(field) ? '#E1143C' : '#E0E0E0'}`
  }

  return (
    <div style={{ padding: '0 16px 8px', background: '#fff' }}>
      {/* Seção: Dados pessoais */}
      <div style={{ padding: '16px 0 4px' }}>
        <p style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', marginBottom: '14px' }}>
          Informações pessoais
        </p>

        {/* Nome */}
        <div style={fieldWrap} data-error={hasError('fullName') ? 'true' : undefined}>
          <label style={labelStyle}>
            Nome completo <span style={{ color: '#E1143C' }}>*</span>
          </label>
          <input
            type="text"
            autoComplete="name"
            value={form.fullName}
            onChange={handleChange('fullName')}
            onBlur={handleBlur('fullName')}
            onFocus={onFocus}
            onBlurCapture={onBlurStyle('fullName')}
            placeholder="João da Silva"
            style={getInputStyle('fullName')}
          />
          {getError('fullName') && <span style={errorStyle}>{getError('fullName')}</span>}
        </div>

        {/* CPF */}
        <div style={fieldWrap} data-error={hasError('cpf') ? 'true' : undefined}>
          <label style={labelStyle}>
            CPF <span style={{ color: '#E1143C' }}>*</span>
          </label>
          <input
            type="tel"
            inputMode="numeric"
            autoComplete="off"
            value={form.cpf}
            onChange={handleChange('cpf')}
            onBlur={handleBlur('cpf')}
            onFocus={onFocus}
            onBlurCapture={onBlurStyle('cpf')}
            placeholder="000.000.000-00"
            style={getInputStyle('cpf')}
          />
          {getError('cpf') && <span style={errorStyle}>{getError('cpf')}</span>}
        </div>

        {/* Email */}
        <div style={fieldWrap} data-error={hasError('email') ? 'true' : undefined}>
          <label style={labelStyle}>
            Email <span style={{ color: '#E1143C' }}>*</span>
          </label>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            onFocus={onFocus}
            onBlurCapture={onBlurStyle('email')}
            placeholder="seu@email.com"
            style={getInputStyle('email')}
          />
          {getError('email') && <span style={errorStyle}>{getError('email')}</span>}
        </div>

        {/* Telefone */}
        <div style={fieldWrap} data-error={hasError('phone') ? 'true' : undefined}>
          <label style={labelStyle}>
            Telefone <span style={{ color: '#E1143C' }}>*</span>
          </label>
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={handleChange('phone')}
            onBlur={handleBlur('phone')}
            onFocus={onFocus}
            onBlurCapture={onBlurStyle('phone')}
            placeholder="(11) 99999-9999"
            style={getInputStyle('phone')}
          />
          {getError('phone') && <span style={errorStyle}>{getError('phone')}</span>}
        </div>
      </div>

      {/* Seção: Endereço */}
      <div style={{ padding: '8px 0 4px' }}>
        <p style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', marginBottom: '14px' }}>
          Endereço de entrega
        </p>

        {/* CEP */}
        <div style={fieldWrap} data-error={hasError('cep') ? 'true' : undefined}>
          <label style={labelStyle}>
            CEP <span style={{ color: '#E1143C' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="postal-code"
              value={form.cep}
              onChange={handleChange('cep')}
              onBlur={handleBlur('cep')}
              onFocus={onFocus}
              onBlurCapture={onBlurStyle('cep')}
              placeholder="00000-000"
              style={getInputStyle('cep')}
            />
            {cepData.loading && (
              <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }}>
                <div style={{
                  width: 16, height: 16, borderRadius: '50%',
                  border: '2px solid #E0E0E0', borderTopColor: '#E1143C',
                  animation: 'spin 0.8s linear infinite',
                }} />
              </div>
            )}
          </div>
          {getError('cep') && <span style={errorStyle}>{getError('cep')}</span>}
        </div>

        {/* Rua */}
        <div style={fieldWrap} data-error={hasError('address') ? 'true' : undefined}>
          <label style={labelStyle}>
            Rua <span style={{ color: '#E1143C' }}>*</span>
          </label>
          <input
            type="text"
            autoComplete="street-address"
            value={form.address}
            onChange={handleChange('address')}
            onBlur={handleBlur('address')}
            onFocus={onFocus}
            onBlurCapture={onBlurStyle('address')}
            placeholder="Nome da rua"
            style={getInputStyle('address')}
          />
          {getError('address') && <span style={errorStyle}>{getError('address')}</span>}
        </div>

        {/* Número + Complemento */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div data-error={hasError('number') ? 'true' : undefined}>
            <label style={labelStyle}>
              Número <span style={{ color: '#E1143C' }}>*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="address-line2"
              value={form.number}
              onChange={handleChange('number')}
              onBlur={handleBlur('number')}
              onFocus={onFocus}
              onBlurCapture={onBlurStyle('number')}
              placeholder="Nº"
              style={getInputStyle('number')}
            />
            {getError('number') && <span style={errorStyle}>{getError('number')}</span>}
          </div>
          <div>
            <label style={labelStyle}>Complemento</label>
            <input
              type="text"
              autoComplete="address-line3"
              value={form.complement}
              onChange={handleChange('complement')}
              onFocus={onFocus}
              onBlurCapture={onBlurStyle('complement')}
              placeholder="Apto, bloco..."
              style={getInputStyle('complement')}
            />
          </div>
        </div>

        {/* Bairro */}
        <div style={fieldWrap}>
          <label style={labelStyle}>Bairro</label>
          <input
            type="text"
            value={form.neighborhood}
            onChange={handleChange('neighborhood')}
            onFocus={onFocus}
            onBlurCapture={onBlurStyle('neighborhood')}
            placeholder="Bairro"
            style={getInputStyle('neighborhood')}
          />
        </div>

        {/* Cidade + UF */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 14 }}>
          <div data-error={hasError('city') ? 'true' : undefined}>
            <label style={labelStyle}>
              Cidade <span style={{ color: '#E1143C' }}>*</span>
            </label>
            <input
              type="text"
              value={form.city}
              readOnly
              onChange={handleChange('city')}
              onFocus={onFocus}
              onBlurCapture={onBlurStyle('city')}
              placeholder="Cidade"
              style={{ ...getInputStyle('city'), background: '#f9f9f9', color: '#555' }}
            />
            {getError('city') && <span style={errorStyle}>{getError('city')}</span>}
          </div>
          <div>
            <label style={labelStyle}>UF</label>
            <input
              type="text"
              value={form.state}
              readOnly
              placeholder="SP"
              style={{ ...getInputStyle('state'), background: '#f9f9f9', color: '#555' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
