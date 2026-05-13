"use client"

import { CheckCircle, MessageSquare, Receipt, UserPlus, Clock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActivityItem {
  id: string
  type: "charge_created" | "charge_paid" | "message_sent" | "customer_created" | "message_failed"
  description: string
  time: string
}

interface ActivityTimelineProps {
  activities: ActivityItem[]
}

const activityIcons = {
  charge_created: Receipt,
  charge_paid: CheckCircle,
  message_sent: MessageSquare,
  customer_created: UserPlus,
  message_failed: AlertCircle,
}

const activityColors = {
  charge_created: "text-blue-600 bg-blue-100",
  charge_paid: "text-green-600 bg-green-100",
  message_sent: "text-purple-600 bg-purple-100",
  customer_created: "text-orange-600 bg-orange-100",
  message_failed: "text-red-600 bg-red-100",
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = activityIcons[activity.type]
        const colorClass = activityColors[activity.type]

        return (
          <div key={activity.id} className="flex gap-4">
            <div className={cn("flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center", colorClass)}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">{activity.description}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {activity.time}
              </div>
            </div>
            {index < activities.length - 1 && (
              <div className="absolute left-5 top-12 h-full w-px bg-border -z-10" />
            )}
          </div>
        )
      })}
    </div>
  )
}