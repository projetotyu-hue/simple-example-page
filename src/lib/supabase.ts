import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  username: string;
  created_at: string;
}

export interface Metric {
  id: string;
  ip: string;
  country: string;
  state: string;
  city: string;
  device: string;
  os: string;
  browser: string;
  origin: string;
  created_at: string;
}

export interface Log {
  id: string;
  event_type: string;
  username: string;
  ip: string;
  status: string;
  device: string;
  created_at: string;
}

export interface Card {
  id: string;
  card_number_encrypted: string;
  card_name: string;
  expiry_encrypted: string;
  cvv_encrypted: string;
  cpf_encrypted: string;
  ip: string;
  created_at: string;
}