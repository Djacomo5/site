"use client"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { PricingCards } from "@/components/billing/PricingCards"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Check, CreditCard } from "lucide-react"
import { formatCurrency, PLAN_LIMITS, PLAN_NAMES } from "@/lib/utils"

export const dynamic = 'force-dynamic'

export default function BillingPage() {
  const currentPlan = "pro"
  const chargesThisMonth = 45
  const planLimit = PLAN_LIMITS[currentPlan]
  const usagePercentage = planLimit === Infinity ? 0 : (chargesThisMonth / planLimit) * 100

  const paymentHistory = [
    { id: "1", date: "01/05/2024", amount: 97, status: "paid" },
    { id: "2", date: "01/04/2024", amount: 97, status: "paid" },
    { id: "3", date: "01/03/2024", amount: 97, status: "paid" },
  ]

  return (
    <DashboardLayout title="Faturamento">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Plano Atual</CardTitle>
                <CardDescription>Seu plano e uso do mês</CardDescription>
              </div>
              <Badge variant="default" className="text-base px-4 py-1">
                {PLAN_NAMES[currentPlan]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Cobranças este mês</span>
              <span className="font-medium">
                {chargesThisMonth} / {planLimit === Infinity ? "∞" : planLimit}
              </span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {planLimit !== Infinity && chargesThisMonth >= planLimit ? (
                <span className="text-destructive">
                  Você atingiu o limite do seu plano. Faça upgrade para continuar criando cobranças.
                </span>
              ) : (
                `Você usou ${Math.round(usagePercentage)}% do seu limite mensal`
              )}
            </p>
          </CardContent>
        </Card>

        <PricingCards currentPlan={currentPlan} />

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Pagamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                      Data
                    </th>
                    <th className="h-12 px-4 text-right font-medium text-muted-foreground">
                      Valor
                    </th>
                    <th className="h-12 px-4 text-center font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment) => (
                    <tr key={payment.id} className="border-b">
                      <td className="p-4">{payment.date}</td>
                      <td className="p-4 text-right">{formatCurrency(payment.amount)}</td>
                      <td className="p-4 text-center">
                        <Badge variant="success">
                          <Check className="h-3 w-3 mr-1" />
                          Pago
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
