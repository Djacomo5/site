"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { chargeSchema, type ChargeFormData } from "@/lib/validations"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CurrencyInput } from "@/components/shared/CurrencyInput"
import { DatePicker } from "@/components/shared/DatePicker"
import { Loader2 } from "lucide-react"

interface ChargeFormProps {
  initialData?: Partial<ChargeFormData>
  onSubmit: (data: ChargeFormData) => void
  onClose: () => void
  onSuccess?: () => void
  isLoading?: boolean
}

export function ChargeForm({
  initialData,
  onSubmit,
  onClose,
  onSuccess,
  isLoading,
}: ChargeFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ChargeFormData>({
    resolver: zodResolver(chargeSchema),
    defaultValues: initialData,
  })

  const customers = [
    { id: "1", name: "João Silva" },
    { id: "2", name: "Maria Santos" },
    { id: "3", name: "Pedro Costa" },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="customer_id">
          Cliente <span className="text-destructive">*</span>
        </Label>
        <Select
          onValueChange={(value) => setValue("customer_id", value)}
          defaultValue={initialData?.customer_id}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um cliente" />
          </SelectTrigger>
          <SelectContent>
            {customers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.customer_id && (
          <p className="text-sm text-destructive">{errors.customer_id.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          {...register("description")}
          placeholder="Descrição da cobrança"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">
          Valor <span className="text-destructive">*</span>
        </Label>
        <CurrencyInput
          value={watch("amount")}
          onChange={(value) => setValue("amount", value)}
        />
        {errors.amount && (
          <p className="text-sm text-destructive">{errors.amount.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="due_date">
          Data de Vencimento <span className="text-destructive">*</span>
        </Label>
        <DatePicker
          value={watch("due_date")}
          onChange={(date) => setValue("due_date", date)}
          placeholder="Selecione a data"
        />
        {errors.due_date && (
          <p className="text-sm text-destructive">{errors.due_date.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Criar Cobrança
        </Button>
      </div>
    </form>
  )
}
