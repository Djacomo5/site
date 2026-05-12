import type { Metadata } from "next"
import Link from "next/link"
import {
  Zap,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Clock,
  Shield,
  Bell,
  Smartphone,
  Check,
} from "lucide-react"

export const metadata: Metadata = {
  title: "CobraZap - Cobrança Inteligente via WhatsApp",
  description: "Automatize cobranças via WhatsApp para pequenas empresas brasileiras. Reduza inadimplência e melhore seu fluxo de caixa.",
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-primary">CobraZap</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-primary">
              Entrar
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Começar Grátis
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Cobranças automáticas via{" "}
                <span className="text-primary">WhatsApp</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Reduza a inadimplência da sua empresa com cobranças automáticas via PIX
                e lembretes pelo WhatsApp. Simples, rápido e eficaz.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Começar grátis 7 dias
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="#como-funciona"
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-base font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  Saiba mais
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="problema" className="py-16 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold">O problema da inadimplência</h2>
              <p className="mt-4 text-muted-foreground">
                No Brasil, mais de 78 milhões de pessoas estão endividadas. Para
                pequenas empresas, isso significa fluxo de caixa comprometido e
                horas perdidas em cobranças manuais.
              </p>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">R$ 70 bi</div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    em dívidas acumuladas
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">40%</div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    das PMEs sofrem com inadimplência
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">87%</div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    dos pagamentos são via PIX
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="py-16 lg:py-24">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center">Como funciona</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="mt-4 text-xl font-semibold">Cadastre seus clientes</h3>
                <p className="mt-2 text-muted-foreground">
                  Adicione seus clientes com dados de contato e histórico de pagamentos.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="mt-4 text-xl font-semibold">Configure cobranças</h3>
                <p className="mt-2 text-muted-foreground">
                  Crie cobranças PIX automaticamente e defina templates de mensagens.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="mt-4 text-xl font-semibold">Receba automaticamente</h3>
                <p className="mt-2 text-muted-foreground">
                  Cobranças são enviadas automaticamente e você recebe por PIX.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="beneficios" className="py-16 bg-muted/50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center">Benefícios</h2>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: BarChart3, title: "Dashboard completo", desc: "Acompanhe todas as suas cobranças em tempo real" },
                { icon: Clock, title: "Automação total", desc: "Esqueça cobranças manuais - nós fazemos por você" },
                { icon: Shield, title: "Segurança total", desc: "Seus dados protegidos com criptografia de ponta" },
                { icon: Bell, title: "Lembretes automáticos", desc: "Notifique clientes antes e depois do vencimento" },
                { icon: Smartphone, title: "WhatsApp integrado", desc: "Mensagens diretas para o celular do seu cliente" },
                { icon: CheckCircle, title: "PIX instantâneo", desc: "Receba pagamentos na hora via PIX" },
              ].map((benefit, i) => (
                <div key={i} className="flex gap-4 rounded-lg border bg-background p-6">
                  <benefit.icon className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">{benefit.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="planos" className="py-16 lg:py-24">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center">Planos</h2>
            <p className="mt-4 text-center text-muted-foreground">
              Escolha o plano ideal para o seu negócio
            </p>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                { name: "Starter", price: 49, limit: "100 cobranças", features: ["Gestão de clientes", "Envio WhatsApp", "Templates"] },
                { name: "Pro", price: 97, limit: "500 cobranças", features: ["Tudo do Starter", "Dashboard avançado", "Automação"] },
                { name: "Business", price: 197, limit: "Ilimitado", features: ["Tudo do Pro", "API integrations", "Suporte dedicado"] },
              ].map((plan, i) => (
                <div key={i} className={`rounded-lg border p-6 ${i === 1 ? "border-primary shadow-lg" : ""}`}>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">R$ {plan.price}</span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.limit}/mês</p>
                  <ul className="mt-4 space-y-2">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/signup"
                    className={`mt-6 inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium ${
                      i === 1
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "border border-input bg-background hover:bg-accent"
                    }`}
                  >
                    Começar grátis
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="py-16 bg-muted/50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center">Perguntas Frequentes</h2>
            <div className="mx-auto mt-12 max-w-2xl space-y-4">
              {[
                { q: "Como funciona o período grátis?", a: "Você tem 7 dias grátis para testar todas as funcionalidades. Cancele quando quiser." },
                { q: "Preciso ter conta no Asaas?", a: "Sim, você precisa criar uma conta no Asaas (gratuita) para processar pagamentos PIX." },
                { q: "Como envio mensagens pelo WhatsApp?", a: "Você precisa de uma instância da Evolution API connected ao seu WhatsApp." },
                { q: "Posso cancelar a qualquer momento?", a: "Sim, você pode cancelar seu plano a qualquer momento sem penalidades." },
                { q: "O que acontece se atingir o limite de cobranças?", a: "Você será notificado quando atingir 80% do limite. Fazendo upgrade, você continua sem interrupções." },
                { q: "Preciso ter conhecimento técnico?", a: "Não! O CobraZap foi projetado para ser simples e intuitivo. Qualquer pessoa consegue usar." },
              ].map((faq, i) => (
                <div key={i} className="rounded-lg border bg-background p-6">
                  <h3 className="font-semibold">{faq.q}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold">Comece a recuperar pagamentos hoje</h2>
              <p className="mt-4 text-muted-foreground">
                Teste grátis por 7 dias. Sem cartão de crédito.
              </p>
              <Link
                href="/signup"
                className="mt-8 inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90"
              >
                Criar conta grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-bold text-primary">CobraZap</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CobraZap. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
