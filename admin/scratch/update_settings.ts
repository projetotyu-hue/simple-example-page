import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kcjwyfunfjoqkzppkmun.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjand5ZnVuZmpvcWt6cHBrbXVuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjY4ODE4NywiZXhwIjoyMDkyMjY0MTg3fQ.CeHjO-SBca3XeHm5vfoswj63OzEmzFDv13h6QRw394A'
const supabase = createClient(supabaseUrl, supabaseKey)

const clientId = 'vxp_ci_89aa93a548f7c47cbaca3a905148123a'
const clientSecret = 'vxp_cs_7ebe9a595af946a1a7f6cbd8e1fd9ddb18694908cc900e4fd2e373254ff8994e'

async function updateSettings() {
  // 1. Delete extra settings to avoid confusion
  const { error: delError } = await supabase.from('settings').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  console.log('Delete extra error:', delError)

  // 2. Upsert the correct credentials
  const { data, error } = await supabase.from('settings').upsert({
    id: '00000000-0000-0000-0000-000000000000',
    gateway_mode: clientId,
    gateway_secret_key: clientSecret,
    updated_at: new Date().toISOString()
  }).select()

  console.log('Settings updated:', data)
  console.log('Error:', error)
}

updateSettings()
