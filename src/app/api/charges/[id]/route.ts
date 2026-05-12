import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { chargeSchema } from '@/lib/validations'
import { createAsaasClient } from '@/lib/asaas/client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { id } = await params

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: charge, error } = await supabase
      .from('charges')
      .select('*, customers(*)')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json({ charge })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { id } = await params

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status, ...updateData } = body
    const validatedData = chargeSchema.partial().parse(updateData)

    const { data: charge, error } = await supabase
      .from('charges')
      .update(validatedData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select('*, customers(name)')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ charge })
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation error', details: error }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { id } = await params

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: charge } = await supabase
      .from('charges')
      .select('asaas_charge_id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (charge?.asaas_charge_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('asaas_api_key')
        .eq('id', user.id)
        .single()

      if (profile?.asaas_api_key) {
        const asaas = createAsaasClient(profile.asaas_api_key)
        await asaas.deleteCharge(charge.asaas_charge_id)
      }
    }

    const { error } = await supabase
      .from('charges')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
