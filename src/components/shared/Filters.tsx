"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FiltersProps {
  filters: Record<string, string>
  onFilterChange: (key: string, value: string) => void
  onClearFilters: () => void
  className?: string
}

const filterOptions = {
  status: [
    { value: "all", label: "Todos os status" },
    { value: "pending", label: "Pendente" },
    { value: "paid", label: "Pago" },
    { value: "overdue", label: "Vencido" },
    { value: "cancelled", label: "Cancelado" },
  ],
  period: [
    { value: "all", label: "Todos os períodos" },
    { value: "7days", label: "Últimos 7 dias" },
    { value: "30days", label: "Últimos 30 dias" },
    { value: "90days", label: "Últimos 90 dias" },
  ],
}

export function Filters({ filters, onFilterChange, onClearFilters, className }: FiltersProps) {
  const activeFilters = Object.entries(filters).filter(([_, value]) => value && value !== "all")

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <Select value={filters.status || "all"} onValueChange={(v) => onFilterChange("status", v)}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {filterOptions.status.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.period || "all"} onValueChange={(v) => onFilterChange("period", v)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Período" />
        </SelectTrigger>
        <SelectContent>
          {filterOptions.period.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {activeFilters.length > 0 && (
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          <X className="mr-1 h-4 w-4" />
          Limpar filtros
        </Button>
      )}
    </div>
  )
}
