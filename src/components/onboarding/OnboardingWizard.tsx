"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Zap, MessageSquare, CreditCard, Receipt, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface OnboardingWizardProps {
  open: boolean
  onComplete: () => void
}

const steps = [
  {
    id: 1,
    title: "Bem-vindo ao CobraZap!",
    description: "Vamos configurar sua conta em alguns passos.",
    icon: Zap,
  },
  {
    id: 2,
    title: "Conectar WhatsApp",
    description: "Configure a Evolution API para enviar mensagens automaticamente.",
    icon: MessageSquare,
  },
  {
    id: 3,
    title: "Configurar Asaas",
    description: "Adicione sua chave da API Asaas para processar pagamentos PIX.",
    icon: CreditCard,
  },
  {
    id: 4,
    title: "Criar primeira cobrança",
    description: "Prontinho! Vamos criar sua primeira cobrança.",
    icon: Receipt,
  },
]

export function OnboardingWizard({ open, onComplete }: OnboardingWizardProps) {
  const router = useRouter()
  const supabase = createClient()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    company_name: "",
    evolution_api_url: "",
    evolution_api_key: "",
    evolution_instance: "",
    asaas_api_key: "",
  })

  const handleNext = async () => {
    setLoading(true)

    if (currentStep === 1) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase
          .from("profiles")
          .update({
            name: formData.name,
            company_name: formData.company_name,
            onboarding_step: 2,
          })
          .eq("id", user.id)
      }
    }

    if (currentStep === 4) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase
          .from("profiles")
          .update({
            onboarding_completed: true,
            onboarding_step: 4,
          })
          .eq("id", user.id)
        onComplete()
        router.refresh()
      }
    }

    setLoading(false)
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleSkip = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from("profiles")
        .update({ onboarding_completed: true })
        .eq("id", user.id)
    }
    onComplete()
  }

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">{steps[currentStep - 1].title}</DialogTitle>
        </DialogHeader>

        <div className="flex justify-center gap-2 py-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                "flex h-2 w-2 rounded-full transition-colors",
                step.id <= currentStep ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>

        {currentStep === 1 && (
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              {steps[0].description}
            </p>
            <div className="space-y-2">
              <Label htmlFor="name">Seu nome</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Seu nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_name">Nome da empresa</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                placeholder="Sua empresa (opcional)"
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              {steps[1].description}
            </p>
            <div className="space-y-2">
              <Label htmlFor="evolution_api_url">URL da Evolution API</Label>
              <Input
                id="evolution_api_url"
                value={formData.evolution_api_url}
                onChange={(e) => setFormData({ ...formData, evolution_api_url: e.target.value })}
                placeholder="https://evolution-api.exemplo.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="evolution_api_key">API Key</Label>
              <Input
                id="evolution_api_key"
                type="password"
                value={formData.evolution_api_key}
                onChange={(e) => setFormData({ ...formData, evolution_api_key: e.target.value })}
                placeholder="Sua API Key"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="evolution_instance">Nome da Instância</Label>
              <Input
                id="evolution_instance"
                value={formData.evolution_instance}
                onChange={(e) => setFormData({ ...formData, evolution_instance: e.target.value })}
                placeholder="minha-instancia"
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              {steps[2].description}
            </p>
            <div className="space-y-2">
              <Label htmlFor="asaas_api_key">API Key do Asaas</Label>
              <Input
                id="asaas_api_key"
                type="password"
                value={formData.asaas_api_key}
                onChange={(e) => setFormData({ ...formData, asaas_api_key: e.target.value })}
                placeholder="Sua API Key do Asaas"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Você pode encontrar sua API Key no painel do Asaas em{" "}
              <strong>Configurações &gt; Chave de API</strong>.
            </p>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              {steps[3].description}
            </p>
            <div className="flex items-center justify-center gap-2 py-8">
              <div className="rounded-full bg-green-100 p-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Configuração completa! Sua conta está pronta para uso.
            </p>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button variant="ghost" onClick={handleSkip}>
            Pular
          </Button>
          <Button onClick={handleNext} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {currentStep === 4 ? "Concluir" : "Próximo"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
