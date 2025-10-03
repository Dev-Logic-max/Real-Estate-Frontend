"use client"

import { useState, useEffect } from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import { FiMail, FiMessageSquare, FiPhone, FiTrash2, FiX } from "react-icons/fi"
import { toast } from "react-toastify"

import { notificationApi } from "@/lib/api/notification"
import { userApi } from "@/lib/api/user"

import { Notification, User } from "@/types"
import { Badge } from "../ui/badge"
import { FcCalendar } from "react-icons/fc"

interface NotificationDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  notificationId: string
  onDelete: () => void
}

export default function NotificationDeleteModal({ isOpen, onClose, notificationId, onDelete }: NotificationDeleteModalProps) {
  const [notification, setNotification] = useState<Notification>()
  const [user, setUser] = useState<User>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const notificationResponse = await notificationApi.getNotificationById(notificationId)
        const fetchedNotification = (notificationResponse.data && (notificationResponse.data.notification ?? notificationResponse.data)) as Notification
        setNotification(fetchedNotification)
        if (fetchedNotification?.userId) {
          const userResponse = await userApi.getUserById(fetchedNotification.userId)
          const fetchedUser = (userResponse.data && (userResponse.data.user ?? userResponse.data)) as User
          setUser(fetchedUser)
        }
      } catch (error) {
        toast.error("Failed to fetch notification or user data")
      } finally {
        setLoading(false)
      }
    }

    if (isOpen && notificationId) {
      fetchData()
    }
  }, [isOpen, notificationId])

  const handleDelete = async () => {
    try {
      await notificationApi.deleteNotification(notificationId)
      toast.success("Notification deleted successfully")
      onDelete()
      onClose()
    } catch (error) {
      toast.error("Failed to delete notification")
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <FiMail className="w-4 h-4 text-blue-500 mr-2" />;
      case 'in-app': return <FiMessageSquare className="w-4 h-4 text-green-500 mr-2" />;
      case 'sms': return <FiPhone className="w-4 h-4 text-purple-500 mr-2" />;
      default: return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <Label className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">Delete Notification</Label>
            <Label className="rounded-lg p-2 text-gray-600 bg-gray-100 border border-gray-200">{notification?.relatedModel}</Label>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : notification ? (
          <div className="space-y-6">
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 space-y-3">
              <p className="text-gray-700 text-sm font-semibold mb-5">{notification.message}</p>
              <div className="flex justify-between items-center">
                <p>{notification.purpose.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l: any) => l.toUpperCase())}</p>
                <Badge
                  variant={notification.read ? "secondary" : "default"}
                  className={notification.read ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800 border border-red-200"}
                >
                  {notification.read ? "Read" : "Unread"}
                </Badge>
                <div className="flex items-center text-sm text-gray-600">
                  {getTypeIcon(notification.type)}
                  <span className="capitalize">{notification.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FcCalendar className="w-4 h-4"/>
                  <p className="text-xs">{new Date(notification.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex justify-between">
                <p className="flex items-center gap-2">
                  <span><span className="font-semibold">Name : </span>{`${user?.firstName} ${user?.lastName}`}</span>
                  <Badge className="text-xs border border-green-200 capitalize bg-green-100 text-green-800">{user?.status}</Badge>
                </p>
                <p>{user?.roles.map((role: number) => ["Admin", "Agent", "Seller", "Renter", "User"][role - 1]).join(", ")}</p>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span>ID : <span className="text-gray-600">{notification._id}</span></span>
              <div className="space-x-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="px-4 py-2 border-2 border-gray-300 hover:border-gray-400 bg-transparent text-gray-700"
                >
                  <FiX className="w-3 h-3" /> Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white"
                >
                  <FiTrash2 className="w-3 h-3" /> Delete
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-600">No data available</div>
        )}
      </DialogContent>
    </Dialog>
  )
}