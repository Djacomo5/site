"use client"

import { useState } from "react"
import { UserMenu } from "./UserMenu"
import { Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TopbarProps {
  onToggleSidebar: () => void
  title?: string
}

export function Topbar({ onToggleSidebar, title }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {title && (
        <h1 className="text-xl font-semibold">{title}</h1>
      )}

      <div className="ml-auto flex items-center gap-4">
        <Button variant="ghost" size="icon" aria-label="Notificações">
          <Bell className="h-5 w-5" />
        </Button>
        <UserMenu />
      </div>
    </header>
  )
}
