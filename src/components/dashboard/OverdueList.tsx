"use client"

import Link from "next/link"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface OverdueListProps {
  charges: Array<{
    id: string
    customer: string
    amount: number
    dueDate: string
  }>
}

export function OverdueList({ charges }: OverdueListProps) {
  if (charges.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma cobrança vencida
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {charges.map((charge) => (
        <div
          key={charge.id}
          className="flex items-center justify-between p-3 rounded-lg border bg-card"
        >
          <div className="space-y-1">
            <p className="font-medium">{charge.customer}</p>
            <p className="text-sm text-muted-foreground">
              Vencimento: {charge.dueDate}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="danger">{formatCurrency(charge.amount)}</Badge>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/charges/${charge.id}`}>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      ))}
      <Button variant="outline" className="w-full" asChild>
        <Link href="/charges?status=overdue">Ver todas as cobranças vencidas</Link>
      </Button>
    </div>
  )
}
