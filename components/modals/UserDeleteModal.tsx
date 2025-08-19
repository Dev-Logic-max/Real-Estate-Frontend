"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FaTrash, FaTimes, FaExclamationTriangle } from "react-icons/fa"
import { User } from "@/types"

interface UserDeleteModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (userId: string) => void
}

export default function UserDeleteModal({ user, isOpen, onClose, onConfirm }: UserDeleteModalProps) {
  if (!user) return null

  const handleConfirm = () => {
    onConfirm(user._id)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-red-600 flex items-center">
            <FaExclamationTriangle className="mr-2" />
            Delete User
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-gray-700">
              Are you sure you want to delete <strong>{`${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || "Unknown"}</strong>?
            </p>
            <p className="text-sm text-gray-600 mt-2">Email: {user.email}</p>
            <p className="text-sm text-gray-600">Role: {user.roles[0]}</p>
            {/* <p className="text-sm text-gray-600">Role: {user.roles?.map(role => roleMap[role]).join(", ") || "User"}</p> */}
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Warning:</strong> This action cannot be undone. All user data, including their properties and
              connections, will be permanently deleted.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              <FaTimes className="mr-2" />
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirm} className="bg-red-600 hover:bg-red-700">
              <FaTrash className="mr-2" />
              Delete User
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
