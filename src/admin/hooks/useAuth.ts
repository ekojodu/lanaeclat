import { useState, useEffect, useRef } from 'react'
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

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const checking = useRef(false) // prevent duplicate checks

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Ignore events that shouldn't trigger a full re-check
        if (event === 'TOKEN_REFRESHED') return
        if (event === 'USER_UPDATED') return

        if (event === 'SIGNED_OUT' || !session?.user) {
          setUser(null)
          setIsAdmin(false)
          setLoading(false)
          return
        }

        // Prevent duplicate simultaneous whitelist checks
        if (checking.current) return
        checking.current = true

        try {
          const u = session.user
          const allowed = await checkWhitelist(u.email ?? '')

          if (!allowed) {
            await supabase.auth.signOut()
            setUser(null)
            setIsAdmin(false)
          } else {
            setUser(u)
            setIsAdmin(true)
          }
        } finally {
          checking.current = false
          setLoading(false)
        }
      }
    )

    // Safety net — stop loading after 6s if nothing fires
    const timeout = setTimeout(() => setLoading(false), 6000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsAdmin(false)
  }

  return { user, loading, isAdmin, signOut }
}
