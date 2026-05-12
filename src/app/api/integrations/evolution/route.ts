import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createEvolutionClient } from '@/lib/evolution/client'
import { integrationSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = integrationSchema.parse(body)

    if (validatedData.evolution_api_url && validatedData.evolution_api_key && validatedData.evolution_instance) {
      const evolution = createEvolutionClient(
        validatedData.evolution_api_url,
        validatedData.evolution_api_key
      )

      try {
        const status = await evolution.checkConnection(validatedData.evolution_instance)
        if (status.status !== 'open') {
          return NextResponse.json(
            { error: 'Instância não está conectada. Escaneie o QR Code.' },
            { status: 400 }
          )
        }
      } catch {
        return NextResponse.json(
          { error: 'Não foi possível conectar à Evolution API. Verifique os dados.' },
          { status: 400 }
        )
      }

      await supabase
        .from('profiles')
        .update({
          evolution_api_url: validatedData.evolution_api_url,
          evolution_api_key: validatedData.evolution_api_key,
          evolution_instance: validatedData.evolution_instance,
        })
        .eq('id', user.id)

      return NextResponse.json({ success: true, message: 'Evolution API configurada com sucesso' })
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation error', details: error }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('evolution_api_url, evolution_api_key, evolution_instance')
      .eq('id', user.id)
      .single()

    let connected = false
    if (profile?.evolution_api_url && profile?.evolution_api_key && profile?.evolution_instance) {
      try {
        const evolution = createEvolutionClient(
          profile.evolution_api_url,
          profile.evolution_api_key
        )
        const status = await evolution.checkConnection(profile.evolution_instance)
        connected = status.status === 'open'
      } catch {
        connected = false
      }
    }

    return NextResponse.json({ connected })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
