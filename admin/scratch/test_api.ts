async function testPixCreate() {
  const payload = {
    amount: 100, // R$ 1,00
    payerName: 'Teste de Integração',
    payerDocument: '11122233344',
    customerEmail: 'teste@exemplo.com',
    description: 'Teste Local',
    items: [{ name: 'Produto Teste', price: 1, quantity: 1 }]
  }

  try {
    const resp = await fetch('http://localhost:8081/api/payments/pix-create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    console.log('Status:', resp.status)
    const data = await resp.json()
    console.log('Data:', JSON.stringify(data, null, 2))
  } catch (err) {
    console.error('Fetch error:', err)
  }
}

testPixCreate()
