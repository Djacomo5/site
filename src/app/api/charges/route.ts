import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { chargeSchema } from '@/lib/validations'
import { createAsaasClient } from '@/lib/asaas/client'
import { PLAN_LIMITS } from '@/lib/utils'
import type { Plan } from '@/types/database.types'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 10
    const offset = (page - 1) * limit

    let query = supabase
      .from('charges')
      .select('*, customers(name)', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data: charges, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ charges, total: count, page, limit })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = chargeSchema.parse(body)

    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, asaas_api_key')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 })
    }

    const plan = (profile.plan || 'starter') as Plan
    const limit = PLAN_LIMITS[plan]

    if (limit !== Infinity) {
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { count: monthlyCount } = await supabase
        .from('charges')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString())

      if (monthlyCount !== null && monthlyCount >= limit) {
        return NextResponse.json(
          { error: `Limite de ${limit} cobranças atingido para este mês. Faça upgrade do seu plano.` },
          { status: 403 }
        )
      }
    }

    if (!profile.asaas_api_key) {
      return NextResponse.json(
        { error: 'Configure a integração com o Asaas nas configurações' },
        { status: 400 }
      )
    }

    const { data: customer } = await supabase
      .from('customers')
      .select('*')
      .eq('id', validatedData.customer_id)
      .eq('user_id', user.id)
      .single()

    if (!customer) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
    }

    const asaas = createAsaasClient(profile.asaas_api_key)

    let asaasCustomerId = customer.asaas_customer_id
    if (!asaasCustomerId) {
      const asaasCustomer = await asaas.createCustomer({
        name: customer.name,
        email: customer.email || '',
        phone: customer.phone,
        cpfCnpj: customer.cpf_cnpj,
      })
      asaasCustomerId = asaasCustomer.id

      await supabase
        .from('customers')
        .update({ asaas_customer_id: asaasCustomerId })
        .eq('id', customer.id)
    }

    const asaasCharge = await asaas.createCharge({
      customer: asaasCustomerId,
      billingType: 'PIX',
      value: validatedData.amount,
      dueDate: validatedData.due_date,
      description: validatedData.description,
      externalReference: customer.id,
    })

    const { data: charge, error } = await supabase
      .from('charges')
      .insert([{
        user_id: user.id,
        customer_id: validatedData.customer_id,
        description: validatedData.description,
        amount: validatedData.amount,
        due_date: validatedData.due_date,
        asaas_charge_id: asaasCharge.id,
        pix_payload: asaasCharge.pixCode,
        pix_qr_code_url: asaasCharge.pixQrCodeUrl,
      }])
      .select('*, customers(name)')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ charge }, { status: 201 })
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation error', details: error }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
