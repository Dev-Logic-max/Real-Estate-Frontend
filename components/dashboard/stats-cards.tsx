import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  gradient: string
  change?: string
  changeType?: "positive" | "negative"
}

export default function StatsCard({ title, value, icon, gradient, change, changeType }: StatsCardProps) {
  return (
    <Card className="hover-lift border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            {change && (
              <p className={`text-sm mt-1 ${changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
                {change}
              </p>
            )}
          </div>
          <div
            className={`w-16 h-16 ${gradient} rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg`}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
