"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendar, FaUsers } from "react-icons/fa"
import { RoleEnum, StatusEnum, User } from "@/types"
import { roleMap } from "@/utils"

interface UserViewModalProps {
    user: User | null
    isOpen: boolean
    onClose: () => void
}

export default function UserViewModal({ user, isOpen, onClose }: UserViewModalProps) {
    if (!user) return null

    const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || "Unknown"
    const joined = `${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}`

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto bg-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold gradient-text">User Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Profile Section */}
                    <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                        {/* <img
                            src={user.profilePhotos?.[0]}
                            alt={fullName}
                            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                        /> */}

                        {user.profilePhotos?.[0] ? (
                            <img
                                src={`${process.env.NEXT_PUBLIC_PICTURES_URL}${user.profilePhotos?.[0]}`}
                                alt={fullName}
                                className="w-20 h-20 rounded-full object-cover border-4 border-blue-400 shadow-lg"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full flex items-center justify-center text-sm font-medium border-4 border-blue-400 text-gray-600 bg-gradient-to-b from-purple-200 to-blue-400 shadow-lg">
                                {`${user.firstName?.[0]}${user.lastName?.[0]}`.toUpperCase() || 'Unknown'}
                            </div>
                        )}
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900">{fullName}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                                <Badge
                                    className={`${user.roles?.[0] === RoleEnum.Admin
                                        ? "bg-purple-500 hover:bg-purple-600"
                                        : user.roles?.[0] === RoleEnum.Agent
                                            ? "bg-blue-500 hover:bg-blue-600"
                                            : "bg-green-500 hover:bg-green-600"
                                        } text-white`}
                                >
                                    {/* {user.role} */}
                                    {/* {roleMap[user.roles?.[0]]} */}
                                    {roleMap[user.roles?.[0] ?? RoleEnum.User]}
                                </Badge>
                                <Badge
                                    variant={user.status === StatusEnum.Active ? "default" : "secondary"}
                                    className={user.status === StatusEnum.Active ? "bg-green-500 hover:bg-green-600 text-white" : ""}
                                >
                                    {user.status}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                                <FaUser className="mr-2 text-blue-500" />
                                Contact Information
                            </h4>

                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <FaEnvelope className="text-gray-400" />
                                    <span className="text-gray-700">{user.email}</span>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <FaPhone className="text-gray-400" />
                                    <span className="text-gray-700">{user.phone || '-----'}</span>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <FaCalendar className="text-gray-400" />
                                    <span className="text-gray-700">Joined {joined}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                                <FaMapMarkerAlt className="mr-2 text-red-500" />
                                Address
                            </h4>

                            {user.address ? (
                                <div className="text-gray-700 space-y-1">
                                    {user.address.street && <p>{user.address.street}</p>}
                                    <p>
                                        {user.address.city && `${user.address.city}, `}
                                        {user.address.state && `${user.address.state} `}
                                        {user.address.zipCode}
                                    </p>
                                    {user.address.country && <p>{user.address.country}</p>}
                                </div>
                            ) : (
                                <p className="text-gray-500">No address provided</p>
                            )}
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg text-center">
                            {/* <div className="text-2xl font-bold text-blue-700">{user.assets}</div> */}
                            <div className="text-sm text-blue-600">Total Assets</div>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-green-100 to-green-200 rounded-lg text-center">
                            <div className="text-2xl font-bold text-green-700">{user.connections?.length}</div>
                            <div className="text-sm text-green-600">Connections</div>
                        </div>
                    </div>

                    {/* Connections */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                            <FaUsers className="mr-2 text-purple-500" />
                            {/* Connections ({user.connections?.length ?? 0}) */}
                            Connections ({user.connections?.length})
                        </h4>

                        {/* {(user.connections.length) > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {user.connections.map((connection) => (
                                    <div key={connection.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <img
                                            src={connection.avatar || "/placeholder.svg"}
                                            alt={connection.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{connection.name}</p>
                                            <p className="text-sm text-gray-500">{connection.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No connections found</p>
                        )} */}

                        {user.connections && user.connections.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {user.connections.map((connection) => (
                                    <div key={connection.userId} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium bg-gray-200">
                                            {connection.userId.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{connection.userId}</p>
                                            {/* <p className="text-sm text-gray-500">{roleMap[connection.role] || "Unknown"}</p> */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No connections found</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button variant="outline" onClick={onClose} className="cursor-pointer">
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
