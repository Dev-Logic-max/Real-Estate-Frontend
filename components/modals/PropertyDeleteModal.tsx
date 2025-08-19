"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FaExclamationTriangle, FaTimes } from "react-icons/fa"
import { Property } from "@/types"

interface PropertyDeleteModalProps {
  property: Property | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (propertyId: string) => void
}

export default function PropertyDeleteModal({ property, isOpen, onClose, onConfirm }: PropertyDeleteModalProps) {
  if (!property) return null

  const handleConfirm = () => {
    onConfirm(property._id)
    onClose()
  }

  const formatPrice = (price: number, type: string) => {
    if (type === "rent") {
      return `$${price.toLocaleString()}/month`
    }
    return `$${price.toLocaleString()}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-md bg-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
            <FaExclamationTriangle className="text-red-500" />
            Delete Property
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <FaTimes className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-gray-700 mb-3">
              Are you sure you want to delete this property? This action cannot be undone.
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Property:</span>
                <span className="font-medium">{property.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">
                  {property.city}, {property.state}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium text-green-600">{formatPrice(property.price, property.type)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ID:</span>
                <span className="font-medium text-gray-500">{property._id}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirm} className="bg-red-600 hover:bg-red-700">
              Delete Property
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
