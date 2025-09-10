"use client"

import UserSidebar from "@/components/dashboard/Sidebar"
import type React from "react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
        <UserSidebar />
        <div className="flex-1 ml-64 overflow-auto">
          <div className="p-8">{children}</div>
        </div>
    </div>
  )
}
