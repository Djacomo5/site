"use client"
import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { KPICard } from "@/components/dashboard/KPICard"
import { RevenueChart } from "@/components/dashboard/RevenueChart"
import { OverdueList } from "@/components/dashboard/OverdueList"
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"
import type { Charge } from "@/types/database.types"
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Percent,
} from "lucide-react"
export const dynamic = 'force-dynamic'
interface ChargeWithCustomer extends Charge {
  customers?: { name: string }
}
interface Activity {
  id: string
  type: "charge_paid" | "message_sent" | "charge_created" | "customer_created" | "message_failed"
  description: string
  time: string
}
export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [charges, setCharges] = useState<ChargeWithCustomer[]>([])
  const [messageLogs, setMessageLogs] = useState<any[]>([])
  const supabase = createClient()
  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const [chargesRes, logsRes] = await Promise.all([
          supabase
            .from('charges')
            .select('*, customers(name)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('message_logs')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(20)
        ])
        if (chargesRes.error) throw chargesRes.error
        if (logsRes.error) throw logsRes.error
        setCharges(chargesRes.data || [])
        setMessageLogs(logsRes.data || [])
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        toast({ title: "Erro", description: "Falha ao carregar dados do dashboard" })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const pendingCharges = charges.filter(c => c.status === 'pending')
  const paidThisMonth = charges.filter(c =>
    c.status === 'paid' && c.paid_at && new Date(c.paid_at) >= startOfMonth
  )
  const overdueCharges = charges.filter(c => c.status === 'overdue')
  const totalReceivable = pendingCharges.reduce((sum, c) => sum + Number(c.amount), 0)
  const receivedThisMonth = paidThisMonth.reduce((sum, c) => sum + Number(c.amount), 0)
  const overdueTotal = overdueCharges.reduce((sum, c) => sum + Number(c.amount), 0)
  const paidCount = charges.filter(c => c.status === 'paid').length
  const recoveryRate = (paidCount + overdueCharges.length) > 0
    ? Math.round((paidCount / (paidCount + overdueCharges.length)) * 100)
    : 0
  const kpis = [
    {
      title: "Total a Receber",
      value: formatCurrency(totalReceivable),
      subtitle: `${pendingCharges.length} cobrança${pendingCharges.length !== 1 ? 's' : ''} pendente${pendingCharges.length !== 1 ? 's' : ''}`,
      icon: <DollarSign className="h-4 w-4" />,
    },
    {
      title: "Recebido (Mês)",
      value: formatCurrency(receivedThisMonth),
      subtitle: `${paidThisMonth.length} cobrança${paidThisMonth.length !== 1 ? 's' : ''} paga${paidThisMonth.length !== 1 ? 's' : ''}`,
      icon: <TrendingUp className="h-4 w-4" />,
      trend: receivedThisMonth > 0 ? { value: Math.round((receivedThisMonth / totalReceivable) * 100), isPositive: true } : undefined,
    },
    {
      title: "Cobranças Vencidas",
      value: String(overdueCharges.length),
      subtitle: `Total: ${formatCurrency(overdueTotal)}`,
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    {
      title: "Taxa de Recuperação",
      value: `${recoveryRate}%`,
      subtitle: "Meta: 85%",
      icon: <Percent className="h-4 w-4" />,
      trend: recoveryRate >= 85 ? { value: recoveryRate - 85, isPositive: true } : { value: 85 - recoveryRate, isPositive: false },
    },
  ]
  const chartData = (() => {
    const weeks: Record<string, number> = {}
    paidThisMonth.forEach(c => {
      if (c.paid_at) {
        const d = new Date(c.paid_at)
        const key = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
        weeks[key] = (weeks[key] || 0) + Number(c.amount)
      }
    })
    return Object.entries(weeks).slice(-6).map(([date, amount]) => ({ date, amount }))
  })()
  const overdueList = overdueCharges.map(c => ({
    id: c.id,
    customer: c.customers?.name || 'Cliente',
    amount: Number(c.amount),
    dueDate: new Date(c.due_date).toLocaleDateString('pt-BR'),
  }))
  const activities: Activity[] = [
    ...charges.map(c => {
      let type: Activity['type'] = 'charge_created'
      let desc = `Nova cobrança criada para ${c.customers?.name || 'Cliente'}`
      if (c.status === 'paid' && c.paid_at) {
        type = 'charge_paid'
        desc = `Cobrança de ${formatCurrency(Number(c.amount))} paga por ${c.customers?.name || 'Cliente'}`
      } else if (c.status === 'overdue') {
        type = 'charge_paid'
        desc = `Cobrança de ${formatCurrency(Number(c.amount))} vencida para ${c.customers?.name || 'Cliente'}`
      }
      return { id: c.id, type, description: desc, time: c.created_at }
    }),
    ...messageLogs.map(l => {
      const type: Activity['type'] = l.status === 'sent' || l.status === 'delivered' ? 'message_sent' : 'message_failed'
      const desc = l.status === 'sent' || l.status === 'delivered'
        ? `Mensagem enviada com sucesso`
        : `Falha no envio: ${l.error_message || 'erro desconhecido'}`
      return { id: l.id, type, description: desc, time: l.sent_at || l.created_at }
    }),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 10)
    .map(a => ({ ...a, time: formatRelativeTime(a.time) }))
  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }
  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recebimentos Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueChart data={chartData.length > 0 ? chartData : [{ date: new Date().toLocaleDateString('pt-BR'), amount: 0 }]} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Cobranças Vencidas</CardTitle>
            </CardHeader>
            <CardContent>
              <OverdueList charges={overdueList} />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityTimeline activities={activities} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 60) return `há ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`
  if (diffHours < 24) return `há ${diffHours} hora${diffHours !== 1 ? 's' : ''}`
  return `há ${diffDays} dia${diffDays !== 1 ? 's' : ''}`
}