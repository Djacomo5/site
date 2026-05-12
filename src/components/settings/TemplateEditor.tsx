"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Plus, Send } from "lucide-react"
import type { TemplateType } from "@/types/database.types"

const templateTypes: { value: TemplateType; label: string; description: string }[] = [
  { value: "pre_due", label: "Antes do vencimento", description: "Enviado 3 dias antes do vencimento" },
  { value: "due_day", label: "Dia do vencimento", description: "Enviado no dia do vencimento" },
  { value: "overdue_1", label: "1 dia de atraso", description: "Enviado 1 dia após o vencimento" },
  { value: "overdue_3", label: "3 dias de atraso", description: "Enviado 3 dias após o vencimento" },
  { value: "overdue_7", label: "7 dias de atraso", description: "Enviado 7 dias após o vencimento" },
]

const variables = [
  { name: "nome", description: "Nome do cliente" },
  { name: "valor", description: "Valor formatado" },
  { name: "vencimento", description: "Data de vencimento" },
  { name: "pix", description: "Código PIX" },
]

export function TemplateEditor() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("pre_due")
  const [content, setContent] = useState("")
  const [preview, setPreview] = useState("")
  const [saving, setSaving] = useState(false)

  const handleVariableClick = (variable: string) => {
    setContent((prev) => prev + `{{${variable}}}`)
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 500))
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Templates de Mensagem</CardTitle>
            <CardDescription>
              Personalize as mensagens enviadas aos seus clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTemplate} onValueChange={(v) => setSelectedTemplate(v as TemplateType)}>
              <TabsList className="grid grid-cols-3 lg:grid-cols-5 h-auto">
                {templateTypes.map((template) => (
                  <TabsTrigger key={template.value} value={template.value} className="text-xs">
                    {template.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label>Variáveis disponíveis</Label>
                <div className="flex flex-wrap gap-2">
                  {variables.map((variable) => (
                    <Badge
                      key={variable.name}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary/20"
                      onClick={() => handleVariableClick(variable.name)}
                      title={variable.description}
                    >
                      {`{{${variable.name}}}`}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Mensagem</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Digite sua mensagem aqui..."
                  className="min-h-[200px]"
                />
              </div>

              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Template
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>Veja como a mensagem será enviada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-[#dcf8c6] rounded-lg p-4 min-h-[300px]">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm whitespace-pre-wrap">
                  {content || "Sua mensagem aparecerá aqui..."}
                </p>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4" disabled>
              <Send className="mr-2 h-4 w-4" />
              Enviar Teste
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
