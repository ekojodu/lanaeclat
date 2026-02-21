import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'

// Creates an authenticated client using the user's own JWT
// This guarantees RLS sees auth.role() = 'authenticated'
const checkWhitelist = async (email: string, session: Session): Promise<boolean> => {
  try {
    const authedClient = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      }
    )

    const { data, error } = await authedClient
      .from('admin_whitelist')
      .select('email')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle()

    if (error) return false
    return !!data
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

    const resolve = async (session: Session | null) => {
      if (!session?.user) {
        if (mounted) { setUser(null); setIsAdmin(false); setLoading(false) }
        return
      }
      const allowed = await checkWhitelist(session.user.email ?? '', session)
      if (!mounted) return
      setUser(session.user)
      setIsAdmin(allowed)
      setLoading(false)
    }

    // Listener first — catches SIGNED_IN, TOKEN_REFRESHED, SIGNED_OUT
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        if (event === 'SIGNED_OUT') {
          setUser(null); setIsAdmin(false); setLoading(false)
          return
        }
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await resolve(session)
        }
      }
    )

    // Then read stored session for page refresh
    supabase.auth.getSession().then(({ data: { session } }) => {
      resolve(session)
    })

    return () => { mounted = false; subscription.unsubscribe() }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsAdmin(false)
  }

  return { user, isAdmin, loading, signOut }
}
