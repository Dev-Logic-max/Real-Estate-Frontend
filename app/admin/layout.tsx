"use client"

import type React from "react"

import { useState } from "react"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)

  const toggleHeader = () => {
    setIsHeaderVisible(!isHeaderVisible)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader isHeaderVisible={isHeaderVisible} toggleHeader={toggleHeader} />

      <div className="flex">
        <AdminSidebar />

        <div className="flex-1 ml-64 overflow-auto">
          <div className="p-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
