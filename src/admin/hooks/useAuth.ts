import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { User } from '@supabase/supabase-js'

const checkWhitelist = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('check-admin', {
      body: { email }
    })
    if (error) return false
    return data?.isAdmin === true
  } catch {
    return false
  }
}

const resolveUser = async (u: User | null): Promise<{ user: User | null; isAdmin: boolean }> => {
  if (!u) return { user: null, isAdmin: false }
  const allowed = await checkWhitelist(u.email ?? '')
  if (!allowed) {
    await supabase.auth.signOut()
    return { user: null, isAdmin: false }
  }
  return { user: u, isAdmin: true }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    let mounted = true

    const init = async () => {
      // Step 1: explicitly read the stored session first
      const { data: { session } } = await supabase.auth.getSession()
      const { user: u, isAdmin: admin } = await resolveUser(session?.user ?? null)

      if (mounted) {
        setUser(u)
        setIsAdmin(admin)
        setLoading(false)
      }

      // Step 2: listen for future auth changes (login, logout, token refresh)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          if (!mounted) return
          if (event === 'SIGNED_OUT') {
            setUser(null)
            setIsAdmin(false)
            return
          }
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            const { user: u2, isAdmin: admin2 } = await resolveUser(newSession?.user ?? null)
            if (mounted) {
              setUser(u2)
              setIsAdmin(admin2)
            }
          }
        }
      )

      return () => subscription.unsubscribe()
    }

    init()

    return () => { mounted = false }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsAdmin(false)
  }

  return { user, loading, isAdmin, signOut }
}
