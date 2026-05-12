"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { CustomerTable } from "@/components/customers/CustomerTable"
import { CustomerForm } from "@/components/customers/CustomerForm"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Download, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"
import type { Customer } from "@/types/database.types"

export const dynamic = 'force-dynamic'

export default function CustomersPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const supabase = createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) return

        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setCustomers(data || [])
      } catch (err) {
        console.error('Error fetching customers:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  const handleExport = () => {
    const csv = [
      ["Nome", "Telefone", "Email", "CPF/CNPJ"],
      ...customers.map((c) => [c.name, c.phone, c.email || '', c.cpf_cnpj || '']),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "clientes.csv"
    a.click()
  }

  const handleSubmit = async (data: { name: string; phone: string; email?: string; cpf_cnpj?: string; notes?: string }) => {
    try {
      const supabase = createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        toast({ title: "Erro", description: "Sessão expirada. Faça login novamente." })
        return
      }

      const { error } = await supabase
        .from('customers')
        .insert([{ ...data, user_id: user.id }])

      if (error) throw error

      toast({ title: "Sucesso", description: "Cliente criado com sucesso" })
      setIsOpen(false)

      const { data: updated } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setCustomers(updated || [])
    } catch (err) {
      console.error('Error creating customer:', err)
      toast({ title: "Erro", description: "Falha ao criar cliente" })
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Clientes">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  const tableCustomers = customers.map(c => ({
    ...c,
    activeCharges: 0,
    totalOpen: 0,
  }))

  return (
    <DashboardLayout title="Clientes">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex-1 max-w-md">
            <input
              type="search"
              placeholder="Buscar clientes..."
              className="w-full h-10 px-4 rounded-md border border-input bg-background text-sm"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport} disabled={customers.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Cliente
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Cliente</DialogTitle>
                </DialogHeader>
                <CustomerForm
                  onClose={() => setIsOpen(false)}
                  onSubmit={handleSubmit}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <CustomerTable customers={tableCustomers} />
      </div>
    </DashboardLayout>
  )
}
