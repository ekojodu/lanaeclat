import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const run = async () => {
      console.log('1. getting session...')
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      console.log('2. session result:', session?.user?.email ?? 'none', sessionError?.message ?? 'no error')

      if (!session?.user) {
        console.log('3. no session, showing login')
        setUser(null)
        setIsAdmin(false)
        setLoading(false)
        return
      }

      console.log('4. checking whitelist for:', session.user.email)
      const { data, error: wlError } = await supabase
        .from('admin_whitelist')
        .select('email')
        .eq('email', session.user.email)
        .maybeSingle()
      console.log('5. whitelist result:', data, wlError?.message ?? 'no error')

      if (!data) {
        console.log('6. not on whitelist, signing out')
        await supabase.auth.signOut()
        setUser(null)
        setIsAdmin(false)
      } else {
        console.log('6. is admin, showing dashboard')
        setUser(session.user)
        setIsAdmin(true)
      }

      setLoading(false)
      console.log('7. loading done')
    }

    run()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('auth event:', event)
        if (event === 'SIGNED_OUT') {
          setUser(null)
          setIsAdmin(false)
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
