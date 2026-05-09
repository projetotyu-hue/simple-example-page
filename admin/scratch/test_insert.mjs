
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kcjwyfunfjoqkzppkmun.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjand5ZnVuZmpvcWt6cHBrbXVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2ODgxODcsImV4cCI6MjA5MjI2NDE4N30.cDyexLkniqLsyigg1CE4N5noAoP_mL7-RFM-_1lUBqg'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function run() {
  console.log('Attempting to insert a row into settings...')
  const { data, error } = await supabase.from('settings').insert([
    { shop_name: 'Loja de Teste', sold_count: '100' }
  ]).select()

  if (error) {
    console.error('Error inserting:', error)
  } else {
    console.log('Inserted successfully:', data)
  }
}

run()
