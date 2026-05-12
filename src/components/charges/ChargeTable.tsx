"use client"

import Link from "next/link"
import { formatCurrency, formatDate } from "@/lib/utils"
import { StatusBadge } from "./StatusBadge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Send, Copy, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EmptyState } from "@/components/shared/EmptyState"
import type { ChargeStatus } from "@/types/database.types"

interface Charge {
  id: string
  customer: string
  description: string
  amount: number
  dueDate: string
  status: ChargeStatus
}

interface ChargeTableProps {
  charges: Charge[]
  onDelete?: (charge: Charge) => void
}

export function ChargeTable({ charges, onDelete }: ChargeTableProps) {
  const handleCopyPix = async (pixCode: string) => {
    try {
      await navigator.clipboard.writeText(pixCode)
    } catch {
      console.error("Failed to copy PIX code")
    }
  }

  if (charges.length === 0) {
    return (
      <EmptyState
        title="Nenhuma cobrança cadastrada"
        description="Comece criando sua primeira cobrança para receber via PIX."
        action={{
          label: "Criar cobrança",
          onClick: () => {},
        }}
      />
    )
  }

  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                Cliente
              </th>
              <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                Descrição
              </th>
              <th className="h-12 px-4 text-right font-medium text-muted-foreground">
                Valor
              </th>
              <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                Vencimento
              </th>
              <th className="h-12 px-4 text-center font-medium text-muted-foreground">
                Status
              </th>
              <th className="h-12 px-4 text-center font-medium text-muted-foreground">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {charges.map((charge) => (
              <tr key={charge.id} className="border-b hover:bg-muted/30">
                <td className="p-4">
                  <span className="font-medium">{charge.customer}</span>
                </td>
                <td className="p-4 text-muted-foreground">
                  {charge.description || "-"}
                </td>
                <td className="p-4 text-right font-medium">
                  {formatCurrency(charge.amount)}
                </td>
                <td className="p-4">{formatDate(charge.dueDate)}</td>
                <td className="p-4 text-center">
                  <StatusBadge status={charge.status} />
                </td>
                <td className="p-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/charges/${charge.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalhes
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar WhatsApp
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCopyPix("")}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar PIX
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete?.(charge)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Cancelar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
