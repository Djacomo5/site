import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PLAN_LIMITS } from '@/lib/utils'
import type { Plan } from '@/types/database.types'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const startOf30DaysAgo = new Date()
    startOf30DaysAgo.setDate(startOf30DaysAgo.getDate() - 30)
    startOf30DaysAgo.setHours(0, 0, 0, 0)

    const [totalReceivable, monthlyReceived, overdueCharges, monthlyCharges] = await Promise.all([
      supabase
        .from('charges')
        .select('amount')
        .eq('user_id', user.id)
        .in('status', ['pending', 'overdue']),

      supabase
        .from('charges')
        .select('id, amount, paid_at')
        .eq('user_id', user.id)
        .eq('status', 'paid')
        .gte('paid_at', startOfMonth.toISOString()),

      supabase
        .from('charges')
        .select('*, customers(name)')
        .eq('user_id', user.id)
        .eq('status', 'overdue')
        .order('due_date', { ascending: true })
        .limit(10),

      supabase
        .from('charges')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString()),
    ])

    const totalReceivableAmount = totalReceivable.data?.reduce((sum, c) => sum + Number(c.amount), 0) || 0
    const totalReceivedMonth = monthlyReceived.data?.reduce((sum, c) => sum + Number(c.amount), 0) || 0
    const overdueCount = overdueCharges.data?.length || 0
    const chargesThisMonth = monthlyCharges.count || 0

    const totalChargesEver = await supabase
      .from('charges')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'paid')

    const recoveryRate = totalChargesEver.count && totalChargesEver.count > 0
      ? Math.round(((totalChargesEver.count || 0) / (totalChargesEver.count + overdueCount)) * 100)
      : 0

    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single()

    const plan = (profile?.plan || 'starter') as Plan
    const planLimit = PLAN_LIMITS[plan]

    const recentActivity = [
      ...(monthlyReceived.data || []).map((c) => ({
        id: c.id,
        type: 'charge_paid' as const,
        description: `Cobrança de R$ ${Number(c.amount).toLocaleString('pt-BR')} paga`,
        created_at: c.paid_at,
      })),
    ].slice(0, 10)

    return NextResponse.json({
      total_receivable: totalReceivableAmount,
      total_received_month: totalReceivedMonth,
      overdue_count: overdueCount,
      recovery_rate: recoveryRate,
      charges_this_month: chargesThisMonth,
      plan_limit: planLimit,
      recent_activity: recentActivity,
      overdue_charges: overdueCharges.data || [],
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
