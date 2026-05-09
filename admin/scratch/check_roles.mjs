
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kcjwyfunfjoqkzppkmun.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjand5ZnVuZmpvcWt6cHBrbXVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2ODgxODcsImV4cCI6MjA5MjI2NDE4N30.cDyexLkniqLsyigg1CE4N5noAoP_mL7-RFM-_1lUBqg'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function check() {
  const { data: roles, error } = await supabase.from('user_roles').select('*')
  console.log('User Roles:', roles?.length, error || '')
  if (roles) console.log(JSON.stringify(roles, null, 2))
}

check()
