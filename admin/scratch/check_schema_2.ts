import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kcjwyfunfjoqkzppkmun.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjand5ZnVuZmpvcWt6cHBrbXVuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjY4ODE4NywiZXhwIjoyMDkyMjY0MTg3fQ.CeHjO-SBca3XeHm5vfoswj63OzEmzFDv13h6QRw394A'
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSchema() {
  const { data, error } = await supabase.from('customers').select('*')
  console.log('Sample Row:', data?.[0])
  
  const { data: cols, error: err2 } = await supabase.rpc('get_table_columns', { table_name: 'customers' })
  console.log('Columns via RPC:', cols)
}

checkSchema()
