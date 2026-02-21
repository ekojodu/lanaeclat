import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { User } from '@supabase/supabase-js'

// Read admin status directly from JWT — no network request needed
const isAdminUser = (user: User): boolean => {
  return user.app_metadata?.role === 'admin'
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const resolve = (u: User | null) => {
      if (!mounted) return
      setUser(u)
      setIsAdmin(u ? isAdminUser(u) : false)
      setLoading(false)
    }

    // Listener first — no async, instant
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) resolve(session?.user ?? null)
      }
    )

    // Then read stored session for page refresh
    supabase.auth.getSession().then(({ data: { session } }) => {
      resolve(session?.user ?? null)
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
