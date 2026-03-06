/**
 * Simple in-memory cache for services.
 * Fetches from Supabase once per browser session, then serves from memory.
 * Cache expires after 5 minutes so price/service changes still propagate.
 */
import { supabase } from './supabase'
import type { Service } from './supabase'

const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

let cache: Service[] | null = null
let cacheTime = 0
let inflight: Promise<Service[]> | null = null

export async function getServices(): Promise<Service[]> {
  // Return cache if still fresh
  if (cache && Date.now() - cacheTime < CACHE_TTL) {
    return cache
  }

  // If a fetch is already in flight (e.g. two components mount at once), reuse it
  if (inflight) return inflight

  inflight = supabase
    .from('services')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })
    .then(({ data }) => {
      cache = data ?? []
      cacheTime = Date.now()
      inflight = null
      return cache
    })

  return inflight
}

/** Call this after admin saves/adds/deletes a service to bust the cache */
export function bustServicesCache() {
  cache = null
  cacheTime = 0
}
