"use client"

import { Badge } from "@/components/ui/badge"
import type { ChargeStatus } from "@/types/database.types"

interface StatusBadgeProps {
  status: ChargeStatus
}

const statusConfig = {
  pending: {
    label: "Pendente",
    variant: "warning" as const,
  },
  paid: {
    label: "Pago",
    variant: "success" as const,
  },
  overdue: {
    label: "Vencido",
    variant: "danger" as const,
  },
  cancelled: {
    label: "Cancelado",
    variant: "secondary" as const,
  },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  )
}
