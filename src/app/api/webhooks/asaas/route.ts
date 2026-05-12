import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const webhookToken = request.headers.get('asaas-access-token')
    if (webhookToken !== process.env.ASAAS_WEBHOOK_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const event = body.event
    const payment = body.payment

    if (!payment?.id) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const supabase = await createClient()
    const adminClient = createAdminClient()

    const { data: charge } = await adminClient
      .from('charges')
      .select('*, customers(phone)')
      .eq('asaas_charge_id', payment.id)
      .single()

    if (!charge) {
      return NextResponse.json({ error: 'Charge not found' }, { status: 404 })
    }

    switch (event) {
      case 'PAYMENT_RECEIVED':
      case 'PAYMENT_CONFIRMED': {
        await adminClient
          .from('charges')
          .update({ status: 'paid', paid_at: new Date().toISOString() })
          .eq('asaas_charge_id', payment.id)

        await adminClient
          .from('message_logs')
          .update({ status: 'cancelled' })
          .eq('charge_id', charge.id)
          .eq('status', 'scheduled')

        break
      }
      case 'PAYMENT_OVERDUE': {
        await adminClient
          .from('charges')
          .update({ status: 'overdue' })
          .eq('asaas_charge_id', payment.id)

        break
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function createAdminClient() {
  const { createClient } = require('@supabase/supabase-js')
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}
