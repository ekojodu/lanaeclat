import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ===== DATABASE TYPES =====
export interface Booking {
  id: string
  created_at: string
  client_name: string
  client_email: string
  client_phone: string
  service_id: string
  service_name: string
  preferred_date: string
  preferred_time: string
  notes: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
}

export interface Client {
  id: string
  created_at: string
  name: string
  email: string
  phone: string
  total_bookings: number
  last_booking: string
}

export interface Service {
  id: string
  name: string
  description: string
  duration: string
  price: number
  emoji: string
  highlight: string | null
  active: boolean
}
