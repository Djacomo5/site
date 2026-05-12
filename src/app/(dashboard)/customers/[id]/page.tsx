"use client"

import { use } from "react"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/charges/StatusBadge"
import { formatCurrency, formatDate, formatPhone } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { ArrowLeft, Mail, Phone, FileText, Loader2 } from "lucide-react"
import type { Customer, Charge } from "@/types/database.types"

export const dynamic = 'force-dynamic'

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>
}

export default function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = use(params)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [charges, setCharges] = useState<Charge[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const [customerRes, chargesRes] = await Promise.all([
          supabase
            .from('customers')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single(),
          supabase
            .from('charges')
            .select('*')
            .eq('customer_id', id)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
        ])

        if (customerRes.data) setCustomer(customerRes.data)
        if (chargesRes.data) setCharges(chargesRes.data)
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return (
      <DashboardLayout title="Carregando...">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  if (!customer) {
    return (
      <DashboardLayout title="Cliente não encontrado">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-muted-foreground">Cliente não encontrado</p>
          <Button asChild>
            <Link href="/customers">Voltar para clientes</Link>
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const totalOpen = charges
    .filter(c => c.status === 'pending' || c.status === 'overdue')
    .reduce((sum, c) => sum + Number(c.amount), 0)

  return (
    <DashboardLayout title={customer.name}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/customers">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Dados do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{formatPhone(customer.phone)}</span>
              </div>
              {customer.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.email}</span>
                </div>
              )}
              {customer.cpf_cnpj && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>CPF/CNPJ: {customer.cpf_cnpj}</span>
                </div>
              )}
              {customer.notes && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">{customer.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total de Cobranças</span>
                <Badge variant="default">{charges.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cobranças Ativas</span>
                <Badge variant="warning">{charges.filter(c => c.status !== 'paid' && c.status !== 'cancelled').length}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total em Aberto</span>
                <Badge variant="danger">{formatCurrency(totalOpen)}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Cobranças</CardTitle>
          </CardHeader>
          <CardContent>
            {charges.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                Nenhuma cobrança encontrada para este cliente
              </p>
            ) : (
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Descrição</th>
                      <th className="h-12 px-4 text-right font-medium text-muted-foreground">Valor</th>
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Vencimento</th>
                      <th className="h-12 px-4 text-center font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {charges.map((charge) => (
                      <tr key={charge.id} className="border-b">
                        <td className="p-4">{charge.description || '-'}</td>
                        <td className="p-4 text-right font-medium">{formatCurrency(Number(charge.amount))}</td>
                        <td className="p-4">{formatDate(charge.due_date)}</td>
                        <td className="p-4 text-center">
                          <StatusBadge status={charge.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
