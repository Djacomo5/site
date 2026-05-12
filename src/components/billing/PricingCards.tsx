"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { formatCurrency, PLAN_LIMITS, PLAN_NAMES, PLAN_PRICES } from "@/lib/utils"
import type { Plan } from "@/types/database.types"

interface PricingCardsProps {
  currentPlan: Plan
}

const plans: Plan[] = ["starter", "pro", "business"]

const planFeatures = {
  starter: [
    "100 cobranças/mês",
    "Gestão de clientes",
    "Envio via WhatsApp",
    "Templates personalizáveis",
    "Suporte por email",
  ],
  pro: [
    "500 cobranças/mês",
    "Tudo do Starter",
    "Dashboard avançado",
    "Automação de lembretes",
    "Suporte prioritário",
  ],
  business: [
    "Cobranças ilimitadas",
    "Tudo do Pro",
    "API integrations",
    "White-label",
    "Suporte dedicado",
    "Treinamento exclusivo",
  ],
}

export function PricingCards({ currentPlan }: PricingCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan) => {
        const isCurrentPlan = plan === currentPlan
        const isPopular = plan === "pro"

        return (
          <Card
            key={plan}
            className={`relative ${isPopular ? "border-primary shadow-lg" : ""}`}
          >
            {isPopular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                Mais Popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle>{PLAN_NAMES[plan]}</CardTitle>
              <CardDescription>
                {plan === "business"
                  ? "Para empresas em crescimento"
                  : plan === "pro"
                  ? "Para profissionais sérios"
                  : "Para começar"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatCurrency(PLAN_PRICES[plan])}
                <span className="text-sm font-normal text-muted-foreground">
                  /mês
                </span>
              </div>
              <ul className="mt-4 space-y-2">
                {planFeatures[plan].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={isCurrentPlan ? "outline" : isPopular ? "default" : "outline"}
                disabled={isCurrentPlan}
              >
                {isCurrentPlan ? "Plano Atual" : "Selecionar Plano"}
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
