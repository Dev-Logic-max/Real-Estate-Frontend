"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  FiSearch,
  FiFilter,
  FiStar,
  FiMapPin,
  FiPhone,
  FiMail,
  FiDollarSign,
  FiTrendingUp,
  FiUsers,
  FiAward,
  FiEye,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import agentsData from "@/json/agents.json"
import EditAgentModal from "@/components/modals/AgentEditModal"
import DeleteAgentModal from "@/components/modals/AgentDeleteModal"
import AddAgentModal from "@/components/modals/NewAgentModal"

export default function AgentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedAgent, setSelectedAgent] = useState<any>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)

  const itemsPerPage = 6

  // Filter agents based on search and status
  const filteredAgents = agentsData.filter((agent) => {
    const matchesSearch =
      agent.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.license.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || agent.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAgents = filteredAgents.slice(startIndex, startIndex + itemsPerPage)

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200"
      case "pending":
        return "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-200"
      case "rejected":
        return "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200"
      default:
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200"
    }
  }

  const handleEdit = (agent: any) => {
    setSelectedAgent(agent)
    setEditModalOpen(true)
  }

  const handleDelete = (agent: any) => {
    setSelectedAgent(agent)
    setDeleteModalOpen(true)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Agent Management
          </h1>
          <p className="text-gray-600 mt-1">Manage and monitor real estate agents</p>
        </div>
        <Button
          onClick={() => setAddModalOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <FiPlus className="mr-2 h-4 w-4" />
          Add New Agent
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search agents by name, email, or license..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 border-blue-200 focus:border-blue-400">
              <FiFilter className="mr-2 h-4 w-4 text-blue-600" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {paginatedAgents.map((agent) => (
          <Card
            key={agent.id}
            className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-16 w-16 ring-4 ring-blue-100 group-hover:ring-blue-200 transition-all duration-300">
                    <AvatarImage
                      src={agent.user.profilePhotos[0] || "/placeholder.svg"}
                      alt={`${agent.user.firstName} ${agent.user.lastName}`}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-lg font-semibold">
                      {agent.user.firstName[0]}
                      {agent.user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {agent.user.firstName} {agent.user.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">License: {agent.license}</p>
                    <div className="flex items-center mt-1">
                      <FiStar className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-semibold text-gray-700">{agent.rating}</span>
                      <span className="text-xs text-gray-500 ml-1">({agent.clientsServed} clients)</span>
                    </div>
                  </div>
                </div>
                <Badge className={`${getStatusStyles(agent.status)} font-medium px-3 py-1`}>{agent.status}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <FiMail className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="truncate">{agent.user.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FiPhone className="h-4 w-4 mr-2 text-green-500" />
                  <span>{agent.user.phone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FiMapPin className="h-4 w-4 mr-2 text-red-500" />
                  <span className="truncate">
                    {agent.user.address.city}, {agent.user.address.state}
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg border border-green-100">
                  <div className="flex items-center justify-between">
                    <FiDollarSign className="h-5 w-5 text-green-600" />
                    <span className="text-xs font-medium text-green-700">Balance</span>
                  </div>
                  <p className="text-lg font-bold text-green-800 mt-1">{formatCurrency(agent.balance)}</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between">
                    <FiTrendingUp className="h-5 w-5 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700">Commission</span>
                  </div>
                  <p className="text-lg font-bold text-blue-800 mt-1">{agent.commissionRate}%</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-100">
                  <div className="flex items-center justify-between">
                    <FiAward className="h-5 w-5 text-purple-600" />
                    <span className="text-xs font-medium text-purple-700">Projects</span>
                  </div>
                  <p className="text-lg font-bold text-purple-800 mt-1">{agent.projectCount}</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-3 rounded-lg border border-orange-100">
                  <div className="flex items-center justify-between">
                    <FiUsers className="h-5 w-5 text-orange-600" />
                    <span className="text-xs font-medium text-orange-700">Sales</span>
                  </div>
                  <p className="text-lg font-bold text-orange-800 mt-1">{formatCurrency(agent.totalSales)}</p>
                </div>
              </div>

              {/* Specializations */}
              <div>
                <p className="text-xs font-medium text-gray-700 mb-2">Specializations</p>
                <div className="flex flex-wrap gap-1">
                  {agent.specializations.slice(0, 2).map((spec: string, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-blue-200"
                    >
                      {spec}
                    </Badge>
                  ))}
                  {agent.specializations.length > 2 && (
                    <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                      +{agent.specializations.length - 2}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div>
                <p className="text-sm text-gray-600 line-clamp-2">{agent.bio}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-colors bg-transparent"
                >
                  <FiEye className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(agent)}
                  className="text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300 transition-colors"
                >
                  <FiEdit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(agent)}
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-colors"
                >
                  <FiTrash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <FiChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className={
                currentPage === page
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "border-blue-200 text-blue-600 hover:bg-blue-50"
              }
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <FiChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Modals */}
      <EditAgentModal agent={selectedAgent} open={editModalOpen} onOpenChange={setEditModalOpen} />

      <DeleteAgentModal agent={selectedAgent} open={deleteModalOpen} onOpenChange={setDeleteModalOpen} />

      <AddAgentModal open={addModalOpen} onOpenChange={setAddModalOpen} />
    </div>
  )
}
