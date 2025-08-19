"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FiAlertTriangle, FiTrash2, FiX } from "react-icons/fi"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface DeleteAgentModalProps {
  agent: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DeleteAgentModal({ agent, open, onOpenChange }: DeleteAgentModalProps) {
  const handleDelete = () => {
    // Handle agent deletion
    console.log("Deleting agent:", agent?.id)
    onOpenChange(false)
  }

  if (!agent) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-gradient-to-br from-white to-red-50/30">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-red-600 flex items-center">
            <FiAlertTriangle className="mr-2 h-5 w-5" />
            Delete Agent
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Agent Info */}
          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-lg border border-red-100">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={agent.user.profilePhotos[0] || "/placeholder.svg"}
                alt={`${agent.user.firstName} ${agent.user.lastName}`}
              />
              <AvatarFallback className="bg-gradient-to-br from-red-500 to-rose-500 text-white">
                {agent.user.firstName[0]}
                {agent.user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">
                {agent.user.firstName} {agent.user.lastName}
              </h3>
              <p className="text-sm text-gray-600">{agent.user.email}</p>
              <p className="text-sm text-gray-600">License: {agent.license}</p>
            </div>
          </div>

          {/* Warning Message */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <FiAlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-800">Warning</h4>
                <p className="text-sm text-yellow-700 mt-1">This action cannot be undone. Deleting this agent will:</p>
                <ul className="text-sm text-yellow-700 mt-2 space-y-1 list-disc list-inside">
                  <li>Remove all agent data permanently</li>
                  <li>Unassign them from all properties</li>
                  <li>Remove their commission history</li>
                  <li>Cancel any pending transactions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <FiX className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white"
            >
              <FiTrash2 className="mr-2 h-4 w-4" />
              Delete Agent
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
