"use client"

import { formatCurrency, formatPhone } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EmptyState } from "@/components/shared/EmptyState"
import Link from "next/link"

interface Customer {
  id: string
  name: string
  phone: string
  email: string | null
  cpf_cnpj: string | null
  notes: string | null
  activeCharges?: number
  totalOpen?: number
}

interface CustomerTableProps {
  customers: Customer[]
  onEdit?: (customer: Customer) => void
  onDelete?: (customer: Customer) => void
}

export function CustomerTable({ customers, onEdit, onDelete }: CustomerTableProps) {
  if (customers.length === 0) {
    return (
      <EmptyState
        title="Nenhum cliente cadastrado"
        description="Comece adicionando seu primeiro cliente para criar cobranças."
        action={{
          label: "Adicionar cliente",
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
                Nome
              </th>
              <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                Telefone
              </th>
              <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                Email
              </th>
              <th className="h-12 px-4 text-center font-medium text-muted-foreground">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b hover:bg-muted/30">
                <td className="p-4">
                  <Link
                    href={`/customers/${customer.id}`}
                    className="font-medium hover:underline"
                  >
                    {customer.name}
                  </Link>
                </td>
                <td className="p-4 text-muted-foreground">
                  {formatPhone(customer.phone)}
                </td>
                <td className="p-4 text-muted-foreground">
                  {customer.email || '-'}
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
                        <Link href={`/customers/${customer.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalhes
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit?.(customer)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete?.(customer)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
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
