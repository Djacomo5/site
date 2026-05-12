import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAsaasClient } from '@/lib/asaas/client'
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

    if (validatedData.asaas_api_key) {
      const asaas = createAsaasClient(validatedData.asaas_api_key)
      const connected = await asaas.testConnection()

      if (!connected) {
        return NextResponse.json(
          { error: 'Não foi possível conectar ao Asaas. Verifique sua API Key.' },
          { status: 400 }
        )
      }

      await supabase
        .from('profiles')
        .update({ asaas_api_key: validatedData.asaas_api_key })
        .eq('id', user.id)

      return NextResponse.json({ success: true, message: 'Conexão com Asaas estabelecida' })
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
      .select('asaas_api_key')
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      connected: !!profile?.asaas_api_key,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
