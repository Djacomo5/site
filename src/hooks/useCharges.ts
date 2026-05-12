"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Charge } from '@/types/database.types'

export function useCharges() {
  const [charges, setCharges] = useState<Charge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchCharges = async () => {
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('Unauthorized')
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('charges')
      .select('*, customers(name)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setCharges(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchCharges()
  }, [])

  return { charges, loading, error, refetch: fetchCharges }
}
