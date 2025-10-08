"use client"

import { useEffect, useRef, useState } from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

import { FiBell, FiSearch, FiEdit3, FiTrash2, FiPlus, FiHome, FiUsers, FiUserCheck, FiMail, FiSmartphone, FiMonitor, FiCalendar, FiEye, FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { FcSynchronize } from "react-icons/fc"
import { FaUser } from "react-icons/fa"

import EditNotificationModal from "@/components/modals/NotificationEditModal"
import { toast } from "react-toastify"

import { notificationApi } from "@/lib/api/notification"
import { Notification } from "@/types"
import NotificationDeleteModal from "@/components/modals/NotificationDeleteModal"

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null)
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [editingNotification, setEditingNotification] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const [loading, setLoading] = useState(true)
  const syncRef = useRef<HTMLElement>(null);

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await notificationApi.getAllNotifications({ page: currentPage, limit: itemsPerPage })
      setNotifications(Array.isArray(response.data) ? response.data : [])
      setSelectedNotifications([])
      console.log("Notifications Response", response)
      console.log("Notifications state", notifications)
    } catch (error) {
      toast.error("Failed to fetch notifications")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()

    if (syncRef.current) {
      syncRef.current.addEventListener('animationend', () => {
        syncRef.current!.style.transform = 'rotate(0deg)';
      });
    }

    return () => {
      if (syncRef.current) {
        syncRef.current.removeEventListener("animationend", () => {
          syncRef.current!.style.transform = "rotate(0deg)";
        });
      }
    };
  }, [currentPage])

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${notification.firstName} ${notification.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || notification.type === filterType
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "read" && notification.read) ||
      (filterStatus === "unread" && !notification.read)

    return matchesSearch && matchesType && matchesStatus
  })

  const getNotificationsByCategory = (category: string) => {
    switch (category) {
      case "property":
        return filteredNotifications.filter((n) =>
          ["property_created", "PROPERTY_LISTED", "PROPERTY_SOLD", "property_deleted"].includes(n.purpose),
        )
      case "user":
        return filteredNotifications.filter((n) =>
          ["USER_REGISTERED", "ROLE_REQUEST", "AGENT_APPROVED", "AGENT_REJECTED"].includes(n.purpose),
        )
      case "deals":
        return filteredNotifications.filter((n) => ["DEAL_REQUEST"].includes(n.purpose))
      default:
        return filteredNotifications
    }
  }

  const getPurposeStyles = (purpose: string) => {
    switch (purpose) {
      case "property_created":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200"
      case "PROPERTY_LISTED":
        return "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-200"
      case "PROPERTY_SOLD":
        return "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-purple-200"
      case "property_deleted":
        return "bg-gradient-to-r from-red-100 to-red-100 text-red-800 border-pink-200"
      case "AGENT_APPROVED":
        return "bg-gradient-to-r from-green-100 to-teal-100 text-green-800 border-green-200"
      case "AGENT_REJECTED":
        return "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200"
      case "USER_REGISTERED":
        return "bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 border-indigo-200"
      case "ROLE_REQUEST":
        return "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-200"
      case "DEAL_REQUEST":
        return "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <FiMail className="w-4 h-4 text-blue-600" />
      case "sms":
        return <FiSmartphone className="w-4 h-4 text-green-600" />
      case "in-app":
        return <FiMonitor className="w-4 h-4 text-purple-600" />
      default:
        return <FiBell className="w-4 h-4 text-gray-600" />
    }
  }

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedNotifications = filteredNotifications.slice(startIndex, startIndex + itemsPerPage)

  const handleEditNotification = (notification: any) => {
    setEditingNotification(notification)
  }

  const handleDeleteNotification = async (id: string) => {
    setSelectedNotificationId(id)
    setDeleteModalOpen(true)
  }

  const handleSaveNotification = async (updatedNotification: Notification) => {
    try {
      await notificationApi.updateAllowedRoles(updatedNotification._id, { allowedRoles: updatedNotification.allowedRoles });
      setNotifications((prev) =>
        prev.map((n) => (n._id === updatedNotification._id ? updatedNotification : n))
      );
      toast.success("Notification updated successfully");
    } catch (error) {
      toast.error("Failed to update notification");
    }
  }

  return (
    <div className="space-y-6 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Notifications Management
          </h1>
          <p className="text-gray-600 mt-1">Manage and monitor all platform notifications</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
          <FiPlus className="w-4 h-4 mr-2" />
          Create Notification
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Notifications</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
              <FiBell className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Property Related</p>
                <p className="text-2xl font-bold">
                  {
                    notifications.filter((n) =>
                      ["property_created", "PROPERTY_LISTED", "PROPERTY_SOLD"].includes(n.purpose),
                    ).length
                  }
                </p>
              </div>
              <FiHome className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">User Related</p>
                <p className="text-2xl font-bold">
                  {
                    notifications.filter((n) =>
                      ["USER_REGISTERED", "ROLE_REQUEST", "AGENT_APPROVED", "AGENT_REJECTED"].includes(n.purpose),
                    ).length
                  }
                </p>
              </div>
              <FiUsers className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Unread</p>
                <p className="text-2xl font-bold">{notifications.filter((n) => !n.read).length}</p>
              </div>
              <FiEye className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search notifications or users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 border-blue-200 focus:border-blue-500"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48 border-2 border-blue-200 focus:border-blue-500">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="in-app">In-App</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48 border-2 border-blue-200 focus:border-blue-500">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-blue-100 to-purple-100 p-1 rounded-lg">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md font-semibold"
          >
            <FiBell className="w-4 h-4 mr-2" />
            All Notifications
          </TabsTrigger>
          <TabsTrigger
            value="property"
            className="data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-md font-semibold"
          >
            <FiHome className="w-4 h-4 mr-2" />
            Property
          </TabsTrigger>
          <TabsTrigger
            value="user"
            className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-md font-semibold"
          >
            <FiUsers className="w-4 h-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger
            value="deals"
            className="data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-md font-semibold"
          >
            <FiUserCheck className="w-4 h-4 mr-2" />
            Deals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card className="shadow-lg pt-0 gap-4 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100 relative gap-0 pt-4">
              {selectedNotifications.length > 0 && (
                <Button
                  className="absolute bg-red-400 hover:bg-red-600 left-72 top-2 cursor-pointer text-white"
                  onClick={async () => {
                    if (selectedNotifications.length > 0) {
                      try {
                        await Promise.all(selectedNotifications.map(id => notificationApi.deleteNotification(id)));
                        setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n._id)));
                        setSelectedNotifications([]);
                        toast.success("Selected notifications deleted successfully");
                      } catch (error) {
                        toast.error("Failed to delete selected notifications");
                      }
                    }
                  }}
                  disabled={selectedNotifications.length === 0}
                >
                  <FiTrash2 className="w-4 h-4" />
                  Delete ( {selectedNotifications.length} )
                </Button>
              )}
              <CardTitle className="flex items-center gradient-text text-blue-900">
                <FiBell className="w-5 h-5 mr-2" />
                All Notifications Management
                <div
                  ref={syncRef as any}
                  className="w-6 h-6 absolute top-4 right-6 p-1 bg-blue-100 rounded-sm hover:scale-125 cursor-pointer"
                  onClick={async () => {
                    if (syncRef.current) {
                      syncRef.current.style.transition = "transform 1s";
                      syncRef.current.style.transform = "rotate(360deg)";
                      await fetchNotifications();
                      toast.success("Notifications refreshed successfully");
                    }
                  }}
                >
                  <FcSynchronize className="w-full h-full" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 m-4 rounded-md overflow-hidden">
              <Table>
                <TableHeader className="bg-gradient-to-r from-blue-100 to-purple-100">
                  <TableRow className="border-blue-200">
                    <TableHead className="font-semibold text-blue-900">
                      <div className="flex items-center justify-center gap-2">
                        <FaUser className="text-blue-600" />
                        User
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-blue-900">Message</TableHead>
                    <TableHead className="font-semibold text-blue-900">Type</TableHead>
                    <TableHead className="font-semibold text-blue-900">Purpose</TableHead>
                    <TableHead className="font-semibold text-blue-900">Status</TableHead>
                    <TableHead className="font-semibold text-blue-900">
                      <FiCalendar className="w-4 h-4 inline mr-1" />
                      Date
                    </TableHead>
                    <TableHead className="font-semibold text-blue-900 w-0 text-center">Actions</TableHead>
                    <TableHead className="font-semibold text-blue-900">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.length === paginatedNotifications.length && paginatedNotifications.length > 0}
                        className="size-4 cursor-pointer me-2"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedNotifications(paginatedNotifications.map(n => n._id));
                          } else {
                            setSelectedNotifications([]);
                          }
                        }}
                      />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-600">
                        Loading notifications...
                      </TableCell>
                    </TableRow>
                  ) : paginatedNotifications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-600">
                        No notifications found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedNotifications.map((notification) => (
                      <TableRow key={notification._id} className="hover:bg-blue-50 transition-colors">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={notification.profilePhotos?.[0] ? `${process.env.NEXT_PUBLIC_PICTURES_URL}${notification.profilePhotos[0]}` : "/placeholder.svg"} />
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                {`${notification.firstName?.[0] ?? ''}${notification.lastName?.[0] ?? ''}`.toUpperCase() || 'N/A'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-gray-900">{`${notification.firstName} ${notification.lastName}`}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="truncate text-gray-700">{notification.message}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(notification.type)}
                            <span className="capitalize text-sm font-medium">{notification.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getPurposeStyles(notification.purpose)} border font-medium`}>
                            {notification.purpose
                              .replace(/_/g, " ")
                              .toLowerCase()
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={notification.read ? "secondary" : "default"}
                            className={notification.read ? "bg-emerald-100 text-green-800" : "bg-orange-100 text-red-800"}
                          >
                            {notification.read ? "Read" : "Unread"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditNotification(notification)}
                              className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
                            >
                              <FiEdit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteNotification(notification._id)}
                              className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedNotifications.includes(notification._id)}
                            className="size-4 cursor-pointer"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedNotifications([...selectedNotifications, notification._id]);
                              } else {
                                setSelectedNotifications(selectedNotifications.filter(id => id !== notification._id));
                              }
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between p-4 border-t bg-gray-50">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredNotifications.length)} of{" "}
                  {filteredNotifications.length} notifications
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="hover:bg-blue-50"
                  >
                    <FiChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={
                          currentPage === page
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                            : "hover:bg-blue-50"
                        }
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="hover:bg-blue-50"
                  >
                    <FiChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="property">
          <Card className="shadow-lg pt-0 gap-4">
            <CardHeader className="bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-t-lg py-4">
              <CardTitle className="flex items-center">
                <FiHome className="w-5 h-5 mr-2" />
                Property Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {getNotificationsByCategory("property").map((notification) => (
                  <div
                    key={notification._id}
                    className="flex items-start space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={notification.profilePhotos?.[0] ? `${process.env.NEXT_PUBLIC_PICTURES_URL}${notification.profilePhotos[0]}` : "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-b from-green-500 to-emerald-500 text-white">
                        {`${notification.firstName?.[0] ?? ''}${notification.lastName?.[0] ?? ''}`.toUpperCase() || 'N/A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">{`${notification.firstName} ${notification.lastName}`}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPurposeStyles(notification.purpose)}>
                            {notification.purpose
                              .replace(/_/g, " ")
                              .toLowerCase()
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 mt-1">{notification.message}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(notification.type)}
                          <span className="text-sm text-gray-600 capitalize">{notification.type}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" className="hover:bg-green-100 bg-transparent">
                            <FiEdit3 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="hover:bg-red-100 bg-transparent" onClick={() => handleDeleteNotification(notification._id)}>
                            <FiTrash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user">
          <Card className="shadow-lg pt-0 gap-4">
            <CardHeader className="bg-gradient-to-r from-purple-400 to-violet-500 text-white rounded-t-lg py-4">
              <CardTitle className="flex items-center">
                <FiUsers className="w-5 h-5 mr-2" />
                User Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {getNotificationsByCategory("user").map((notification) => (
                  <div
                    key={notification._id}
                    className="flex items-start space-x-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200"
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={notification.profilePhotos?.[0] ? `${process.env.NEXT_PUBLIC_PICTURES_URL}${notification.profilePhotos[0]}` : "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-b from-purple-500 to-violet-500 text-white">
                        {`${notification.firstName?.[0] ?? ''}${notification.lastName?.[0] ?? ''}`.toUpperCase() || 'N/A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">{`${notification.firstName} ${notification.lastName}`}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPurposeStyles(notification.purpose)}>
                            {notification.purpose
                              .replace(/_/g, " ")
                              .toLowerCase()
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 mt-1">{notification.message}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(notification.type)}
                          <span className="text-sm text-gray-600 capitalize">{notification.type}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" className="hover:bg-purple-100 bg-transparent">
                            <FiEdit3 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="hover:bg-red-100 bg-transparent">
                            <FiTrash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deals">
          <Card className="shadow-lg pt-0 gap-4">
            <CardHeader className="bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-t-lg py-4">
              <CardTitle className="flex items-center">
                <FiUserCheck className="w-5 h-5 mr-2" />
                Deal Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {getNotificationsByCategory("deals").map((notification) => (
                  <div
                    key={notification._id}
                    className="flex items-start space-x-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200"
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={notification.profilePhotos?.[0] ? `${process.env.NEXT_PUBLIC_PICTURES_URL}${notification.profilePhotos[0]}` : "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                        {`${notification.firstName?.[0] ?? ''}${notification.lastName?.[0] ?? ''}`.toUpperCase() || 'N/A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">{`${notification.firstName} ${notification.lastName}`}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPurposeStyles(notification.purpose)}>
                            {notification.purpose
                              .replace(/_/g, " ")
                              .toLowerCase()
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 mt-1">{notification.message}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(notification.type)}
                          <span className="text-sm text-gray-600 capitalize">{notification.type}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" className="hover:bg-orange-100 bg-transparent">
                            <FiEdit3 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="hover:bg-red-100 bg-transparent">
                            <FiTrash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <EditNotificationModal
        isOpen={!!editingNotification}
        onClose={() => setEditingNotification(null)}
        notification={editingNotification}
        onSave={handleSaveNotification}
      />

      <NotificationDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        notificationId={selectedNotificationId || ""}
        onDelete={() => {
          setNotifications((prev) => prev.filter((n) => n._id !== selectedNotificationId))
          setSelectedNotificationId(null)
        }}
      />
    </div>
  )
}
