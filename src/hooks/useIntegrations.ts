"use client"

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useIntegrations() {
  const [asaasConnected, setAsaasConnected] = useState(false)
  const [evolutionConnected, setEvolutionConnected] = useState(false)
  const [loading, setLoading] = useState(true)

  const checkConnections = async () => {
    setLoading(true)

    try {
      const [asaasRes, evolutionRes] = await Promise.all([
        fetch('/api/integrations/asaas'),
        fetch('/api/integrations/evolution'),
      ])

      const asaasData = await asaasRes.json()
      const evolutionData = await evolutionRes.json()

      setAsaasConnected(asaasData.connected || false)
      setEvolutionConnected(evolutionData.connected || false)
    } catch (err) {
      console.error('Failed to check integrations:', err)
    }

    setLoading(false)
  }

  return {
    asaasConnected,
    evolutionConnected,
    loading,
    checkConnections,
  }
}
