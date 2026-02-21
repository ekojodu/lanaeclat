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

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // Set up listener FIRST before any async work
    // so no auth events are missed
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        if (event === 'SIGNED_OUT') {
          setUser(null)
          setIsAdmin(false)
          setLoading(false)
          return
        }

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          const u = session?.user ?? null
          if (!u) {
            setUser(null)
            setIsAdmin(false)
            setLoading(false)
            return
          }
          const allowed = await checkWhitelist(u.email ?? '')
          if (!mounted) return
          setUser(u)
          setIsAdmin(allowed)
          setLoading(false)
        }
      }
    )

    // Then read the existing session to handle page refresh
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return
      const u = session?.user ?? null
      if (!u) {
        setUser(null)
        setIsAdmin(false)
        setLoading(false)
        return
      }
      const allowed = await checkWhitelist(u.email ?? '')
      if (!mounted) return
      setUser(u)
      setIsAdmin(allowed)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsAdmin(false)
  }

  return { user, isAdmin, loading, signOut }
}
