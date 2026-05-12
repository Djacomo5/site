"use client"

import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface PixDisplayProps {
  pixCode: string
  qrCodeUrl?: string | null
}

export function PixDisplay({ pixCode, qrCodeUrl }: PixDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pixCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  if (!pixCode && !qrCodeUrl) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>PIX não disponível</p>
        <p className="text-sm">Esta cobrança ainda não foi processada</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {qrCodeUrl && (
        <div className="flex justify-center p-4 bg-white rounded-lg">
          <img
            src={qrCodeUrl}
            alt="QR Code PIX"
            className="w-48 h-48"
          />
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Código PIX (Copia e Cola)</p>
        <div className="relative">
          <div className="p-3 bg-muted rounded-md text-xs font-mono break-all max-h-24 overflow-y-auto">
            {pixCode || "Código não disponível"}
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
