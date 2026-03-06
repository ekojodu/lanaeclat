import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import type { User } from '@supabase/supabase-js'

const TIMEOUT_MS = 2 * 60 * 60 * 1000 // 2 hours
const EVENTS = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll']

const isAdminUser = (user: User): boolean =>
  user.app_metadata?.role === 'admin'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsAdmin(false)
  }, [])

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      signOut()
    }, TIMEOUT_MS)
  }, [signOut])

  // Attach/detach activity listeners when admin is logged in
  useEffect(() => {
    if (!user || !isAdmin) {
      if (timerRef.current) clearTimeout(timerRef.current)
      EVENTS.forEach(e => window.removeEventListener(e, resetTimer))
      return
    }

    resetTimer()
    EVENTS.forEach(e => window.addEventListener(e, resetTimer, { passive: true }))

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      EVENTS.forEach(e => window.removeEventListener(e, resetTimer))
    }
  }, [user, isAdmin, resetTimer])

  useEffect(() => {
    let mounted = true

    const resolve = (u: User | null) => {
      if (!mounted) return
      setUser(u)
      setIsAdmin(u ? isAdminUser(u) : false)
      setLoading(false)
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) resolve(session?.user ?? null)
      }
    )

    supabase.auth.getSession().then(({ data: { session } }) => {
      resolve(session?.user ?? null)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return { user, isAdmin, loading, signOut }
}
