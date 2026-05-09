
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kcjwyfunfjoqkzppkmun.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjand5ZnVuZmpvcWt6cHBrbXVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2ODgxODcsImV4cCI6MjA5MjI2NDE4N30.cDyexLkniqLsyigg1CE4N5noAoP_mL7-RFM-_1lUBqg'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function check() {
  const { data: settings, error: sError } = await supabase.from('settings').select('*')
  console.log('Settings Rows:', settings?.length, sError || '')

  const { data: products, error: pError } = await supabase.from('products').select('*').limit(5)
  console.log('Products Rows:', products?.length, pError || '')
}

check()
