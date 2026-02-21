import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { User } from '@supabase/supabase-js'

const checkWhitelist = async (email: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('admin_whitelist')
    .select('email')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle()

  if (error) return false
  return !!data
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const safetyTimeout = setTimeout(() => setLoading(false), 8000)

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const u = session?.user ?? null

        if (!u) {
          setUser(null)
          setIsAdmin(false)
          setLoading(false)
          clearTimeout(safetyTimeout)
          return
        }

        // Only run whitelist check on meaningful events
        if (!['INITIAL_SESSION', 'SIGNED_IN', 'TOKEN_REFRESHED', 'USER_UPDATED'].includes(event)) {
          return
        }

        const allowed = await checkWhitelist(u.email ?? '')

        if (!allowed) {
          await supabase.auth.signOut()
          setUser(null)
          setIsAdmin(false)
        } else {
          setUser(u)
          setIsAdmin(true)
        }

        setLoading(false)
        clearTimeout(safetyTimeout)
      }
    )

    return () => {
      subscription.unsubscribe()
      clearTimeout(safetyTimeout)
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsAdmin(false)
  }

  return { user, loading, isAdmin, signOut }
}
