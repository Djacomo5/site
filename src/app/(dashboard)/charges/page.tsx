"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ChargeTable } from "@/components/charges/ChargeTable"
import { ChargeForm } from "@/components/charges/ChargeForm"
import { Filters } from "@/components/shared/Filters"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Download, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"
import type { Charge, ChargeStatus } from "@/types/database.types"

export const dynamic = 'force-dynamic'

interface ChargeWithCustomer extends Charge {
  customers?: { name: string }
}

export default function ChargesPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [charges, setCharges] = useState<ChargeWithCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Record<string, string>>({})
  const supabase = createClient()

  useEffect(() => {
    async function fetchCharges() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        let query = supabase
          .from('charges')
          .select('*, customers(name)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (filters.status && filters.status !== 'all') {
          query = query.eq('status', filters.status)
        }

        const { data, error } = await query

        if (error) throw error
        setCharges(data || [])
      } catch (err) {
        console.error('Error fetching charges:', err)
        toast({ title: "Erro", description: "Falha ao carregar cobranças" })
      } finally {
        setLoading(false)
      }
    }

    fetchCharges()
  }, [filters])

  const handleExport = () => {
    const csv = [
      ["Cliente", "Descrição", "Valor", "Vencimento", "Status"],
      ...charges.map((c) => [c.customers?.name || '', c.description || '', c.amount, c.due_date, c.status]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "cobrancas.csv"
    a.click()
  }

  const handleSubmit = async (data: { customer_id: string; description?: string; amount: number; due_date: string }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Não autenticado')

      const { error } = await supabase
        .from('charges')
        .insert([{ ...data, user_id: user.id }])

      if (error) throw error

      toast({ title: "Sucesso", description: "Cobrança criada com sucesso" })
      setIsOpen(false)

      let query = supabase
        .from('charges')
        .select('*, customers(name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }

      const { data: updated } = await query
      setCharges(updated || [])
    } catch (err) {
      console.error('Error creating charge:', err)
      toast({ title: "Erro", description: "Falha ao criar cobrança" })
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Cobranças">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  const tableCharges = charges.map(c => ({
    id: c.id,
    customer: c.customers?.name || 'Cliente',
    description: c.description || '',
    amount: Number(c.amount),
    dueDate: c.due_date,
    status: c.status as ChargeStatus,
  }))

  return (
    <DashboardLayout title="Cobranças">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Filters
            filters={filters}
            onFilterChange={(key, value) => setFilters({ ...filters, [key]: value })}
            onClearFilters={() => setFilters({})}
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport} disabled={charges.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Cobrança
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Nova Cobrança</DialogTitle>
                </DialogHeader>
                <ChargeForm
                  onClose={() => setIsOpen(false)}
                  onSubmit={handleSubmit}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <ChargeTable charges={tableCharges} />
      </div>
    </DashboardLayout>
  )
}
