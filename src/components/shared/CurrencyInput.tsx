"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface CurrencyInputProps {
  value?: number
  onChange?: (value: number) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function CurrencyInput({
  value,
  onChange,
  placeholder = "R$ 0,00",
  className,
  disabled,
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = React.useState("")

  React.useEffect(() => {
    if (value !== undefined) {
      setDisplayValue(formatToBRL(value))
    }
  }, [value])

  const formatToBRL = (num: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(num)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, "")
    if (raw === "") {
      setDisplayValue("")
      onChange?.(0)
      return
    }
    const numericValue = parseInt(raw, 10) / 100
    setDisplayValue(formatToBRL(numericValue))
    onChange?.(numericValue)
  }

  return (
    <input
      type="text"
      inputMode="decimal"
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    />
  )
}
