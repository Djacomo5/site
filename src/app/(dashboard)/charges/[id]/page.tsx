"use client"

import { use } from "react"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/charges/StatusBadge"
import { PixDisplay } from "@/components/charges/PixDisplay"
import { formatCurrency, formatDate } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { ArrowLeft, Copy, Send, User, Loader2 } from "lucide-react"
import type { Charge, Customer } from "@/types/database.types"

export const dynamic = 'force-dynamic'

interface ChargeDetailPageProps {
  params: Promise<{ id: string }>
}

export default function ChargeDetailPage({ params }: ChargeDetailPageProps) {
  const { id } = use(params)
  const [charge, setCharge] = useState<Charge | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const chargeRes = await supabase
          .from('charges')
          .select('*, customers(*)')
          .eq('id', id)
          .eq('user_id', user.id)
          .single()

        if (chargeRes.data) {
          setCharge(chargeRes.data)
          setCustomer(chargeRes.data.customers)
        }
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

  if (!charge) {
    return (
      <DashboardLayout title="Cobrança não encontrada">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-muted-foreground">Cobrança não encontrada</p>
          <Button asChild>
            <Link href="/charges">Voltar para cobranças</Link>
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Detalhes da Cobrança">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/charges">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Cobrança</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {customer && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <Link href={`/customers/${customer.id}`} className="hover:underline">
                    {customer.name}
                  </Link>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Descrição</p>
                <p>{charge.description || '-'}</p>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valor</span>
                <span className="text-xl font-bold">{formatCurrency(Number(charge.amount))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vencimento</span>
                <span>{formatDate(charge.due_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge status={charge.status} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pagamento PIX</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <PixDisplay
                pixCode={charge.pix_payload || ""}
                qrCodeUrl={charge.pix_qr_code_url}
              />
              <div className="flex gap-2">
                <Button className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar WhatsApp
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => charge.pix_payload && navigator.clipboard.writeText(charge.pix_payload)}
                  disabled={!charge.pix_payload}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar PIX
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
