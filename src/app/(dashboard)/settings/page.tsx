"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IntegrationCard } from "@/components/settings/IntegrationCard"
import { TemplateEditor } from "@/components/settings/TemplateEditor"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, MessageSquare, Loader2 } from "lucide-react"

export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  return (
    <DashboardLayout title="Configurações">
      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <IntegrationCard
              title="Asaas"
              description="API de cobranças PIX"
              icon={<Zap className="h-6 w-6" />}
              fields={[
                { name: "asaas_api_key", label: "API Key", type: "password" },
              ]}
              testConnection={{
                label: "Testar conexão",
                action: async () => true,
              }}
            />

            <IntegrationCard
              title="Evolution API"
              description="API do WhatsApp"
              icon={<MessageSquare className="h-6 w-6" />}
              fields={[
                { name: "evolution_api_url", label: "URL da API", type: "text" },
                { name: "evolution_api_key", label: "API Key", type: "password" },
                { name: "evolution_instance", label: "Nome da Instância", type: "text" },
              ]}
              testConnection={{
                label: "Verificar conexão",
                action: async () => true,
              }}
              showQRCode
            />
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <TemplateEditor />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
