import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { User } from '@supabase/supabase-js'

const checkWhitelist = async (email: string): Promise<boolean> => {
  const { data } = await supabase
    .from('admin_whitelist')
    .select('email')
    .eq('email', email)
    .maybeSingle()
  return !!data
}

const resolveUser = async (
  setUser: (u: User | null) => void,
  setIsAdmin: (a: boolean) => void,
  setLoading: (l: boolean) => void
) => {
  try {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      setUser(null)
      setIsAdmin(false)
      return
    }

    const allowed = await checkWhitelist(session.user.email ?? '')

    if (!allowed) {
      await supabase.auth.signOut()
      setUser(null)
      setIsAdmin(false)
    } else {
      setUser(session.user)
      setIsAdmin(true)
    }
  } catch (err) {
    console.error('Auth error:', err)
    setUser(null)
    setIsAdmin(false)
  } finally {
    setLoading(false)
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Run immediately on mount (handles refresh)
    resolveUser(setUser, setIsAdmin, setLoading)

    // Also listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null)
          setIsAdmin(false)
          setLoading(false)
          return
        }

        if (event === 'SIGNED_IN' && session?.user) {
          const allowed = await checkWhitelist(session.user.email ?? '')
          if (!allowed) {
            await supabase.auth.signOut()
            setUser(null)
            setIsAdmin(false)
          } else {
            setUser(session.user)
            setIsAdmin(true)
          }
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsAdmin(false)
  }

  return { user, loading, isAdmin, signOut }
}
