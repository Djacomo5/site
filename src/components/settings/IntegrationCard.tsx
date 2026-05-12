"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, QrCode, Loader2 } from "lucide-react"

interface IntegrationCardProps {
  title: string
  description: string
  icon: React.ReactNode
  fields: Array<{
    name: string
    label: string
    type: "text" | "password"
  }>
  testConnection?: {
    label: string
    action: () => Promise<boolean>
  }
  showQRCode?: boolean
}

export function IntegrationCard({
  title,
  description,
  icon,
  fields,
  testConnection,
  showQRCode,
}: IntegrationCardProps) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"connected" | "disconnected" | null>(null)
  const [showQR, setShowQR] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      if (testConnection) {
        const result = await testConnection.action()
        setStatus(result ? "connected" : "disconnected")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          {status && (
            <Badge variant={status === "connected" ? "success" : "danger"}>
              {status === "connected" ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Conectado
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3 mr-1" />
                  Erro
                </>
              )}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              type={field.type}
              value={values[field.name] || ""}
              onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
              placeholder="••••••••"
            />
          </div>
        ))}

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleSave} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar
          </Button>
          {testConnection && (
            <Button variant="outline" onClick={handleSave} disabled={loading}>
              {testConnection.label}
            </Button>
          )}
          {showQRCode && (
            <Button variant="outline" onClick={() => setShowQR(!showQR)}>
              <QrCode className="mr-2 h-4 w-4" />
              QR Code
            </Button>
          )}
        </div>

        {showQR && (
          <div className="mt-4 p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              Escaneie o QR Code com seu WhatsApp para conectar
            </p>
            <div className="mt-4 p-8 bg-white rounded-lg inline-block">
              <QrCode className="h-32 w-32 text-black" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
