"use client"

import type React from "react"

import AdminSidebar from "@/components/admin/AdminSidebar"
import Header from "@/components/layout/Header"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        <AdminSidebar />

        <div className="flex-1 ml-64 overflow-auto">
          <div className="p-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
