"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    FaEye,
    FaEdit,
    FaTrash,
    FaPlus,
    FaSearch,
    FaUser,
    FaEnvelope,
    FaUserTag,
    FaCalendarAlt,
    FaUsers,
    FaToggleOn,
    FaCog,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa"
import UserViewModal from "@/components/modals/UserViewModal"
import UserEditModal from "@/components/modals/UserEditModal"
import UserDeleteModal from "@/components/modals/UserDeleteModal"
import AddUserModal from "@/components/modals/NewUserModal"
import { AddUser, RoleEnum, User } from "@/types"
import { userApi } from "@/lib/api/user"
import { toast } from "react-toastify"
import { MdArrowDropDown } from "react-icons/md"

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [viewModalOpen, setViewModalOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [addModalOpen, setAddModalOpen] = useState(false)
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const roleMap: { [key: number]: string } = {
        [RoleEnum.Admin]: "Admin",
        [RoleEnum.User]: "User",
        [RoleEnum.Seller]: "Seller",
        [RoleEnum.Buyer]: "Buyer",
        [RoleEnum.Agent]: "Agent",
    }

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true)
                const response = await userApi.usersList()
                setUsers(response.data.users)
            } catch (error) {
                toast.error("Failed to fetch users")
            } finally {
                setLoading(false)
            }
        }
        fetchUsers()
    }, [])

    const getRoleStyles = (role: string) => {
        switch (role.toLowerCase()) {
            case "admin":
                return "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:from-purple-600 hover:to-pink-600"
            case "agent":
                return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:from-blue-600 hover:to-cyan-600"
            case "seller":
                return "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:from-purple-600 hover:to-blue-600"
            case "buyer":
                return "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg hover:from-orange-600 hover:to-pink-600"
            case "investor":
                return "bg-gradient-to-r from-red-500 to-yellow-500 text-white shadow-lg hover:from-red-600 hover:to-yellow-600"
            case "user":
            default:
                return "bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg hover:from-emerald-600 hover:to-blue-600"
        }
    }

    const getStatusStyles = (status: string) => {
        switch (status.toLowerCase()) {
            case "active":
                return "bg-gradient-to-r from-green-400 to-emerald-400 text-white shadow-md hover:from-green-500 hover:to-emerald-500"
            case "inactive":
                return "bg-gradient-to-r from-red-400 to-pink-400 text-white shadow-md hover:from-red-500 hover:to-pink-500"
            default:
                return "bg-gradient-to-r from-gray-400 to-slate-400 text-white shadow-md hover:from-gray-500 hover:to-slate-500"
        }
    }

    const filteredUsers = users.map((user) => ({
        ...user,
        name: `${user.firstName} ${user.lastName}`.trim(),
        rolesDisplay: user.roles.map((role) => roleMap[role]).join(", "), // Map all roles
        joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N',
        avatar: user.profilePhotos?.[0],
        connections: user?.connections?.map((conn) => ({
            userId: conn.userId,
            role: conn.role,
            // id: conn.userId,
            // name: conn.userId, // Replace with actual name if available
            // avatar: "N",
            // role: roleMap[conn.role],
        })) ?? [],
    })).filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = roleFilter === "all" || user.rolesDisplay.toLowerCase().includes(roleFilter.toLowerCase())
        return matchesSearch && matchesRole
    })

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

    const handleViewUser = (user: User) => {
        setSelectedUser(user)
        setViewModalOpen(true)
    }

    const handleEditUser = (user: User) => {
        console.log("Selected user for edit:", user);
        setSelectedUser(user)
        setEditModalOpen(true)
    }

    const handleDeleteUser = (user: User) => {
        setSelectedUser(user)
        setDeleteModalOpen(true)
    }

    const handleSaveUser = async (userData: Partial<User>) => {
        if (!selectedUser) return
        try {
            await userApi.updateById(selectedUser._id, userData)
            setUsers(users.map((u) => (u._id === selectedUser._id ? { ...u, ...userData } : u)))
            toast.success("User updated successfully")
            setEditModalOpen(false)
        } catch (error) {
            toast.error("Failed to update user")
        }
    }

    const handleConfirmDelete = async (userId: string) => {
        try {
            await userApi.deleteUser(userId)
            setUsers(users.filter((u) => u._id !== userId))
            toast.success("User deleted successfully")
            setDeleteModalOpen(false)
        } catch (error) {
            toast.error("Failed to delete user")
        }
    }

    const handleAddUser = async (userData: AddUser) => {
        try {
            const response = await userApi.create(userData)
            setUsers([...users, response.data.user])
            toast.success("User added successfully")
            setAddModalOpen(false)
        } catch (error) {
            toast.error("Failed to add user")
        }
    }

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold gradient-text">User Management</h2>
                    <p className="text-gray-600">Manage all users, agents, and administrators</p>
                </div>
                <Button
                    className="gradient-primary text-white hover:opacity-90 shadow-gradient-blue"
                    onClick={() => setAddModalOpen(true)}
                    disabled={loading}
                >
                    <FaPlus className="mr-2" />
                    Add New User
                </Button>
            </div>

            {/* Search and Filter */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Search users by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                                disabled={loading}
                            />
                        </div>
                        <Select value={roleFilter} onValueChange={setRoleFilter} disabled={loading}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="admin" className="hover:bg-blue-100">Admin</SelectItem>
                                <SelectItem value="agent" className="hover:bg-blue-100">Agent</SelectItem>
                                <SelectItem value="seller" className="hover:bg-blue-100">Seller</SelectItem>
                                <SelectItem value="buyer" className="hover:bg-blue-100">Buyer</SelectItem>
                                <SelectItem value="user" className="hover:bg-blue-100">User</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card className="shadow-lg pt-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100 gap-0 pt-4 pb-4">
                    <CardTitle className="gradient-text text-blue-900">All Users ({filteredUsers.length})</CardTitle>
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
                                <TableHead className="font-semibold text-blue-900">
                                    <div className="flex items-center gap-2">
                                        <FaEnvelope className="text-green-600" />
                                        Email
                                    </div>
                                </TableHead>
                                <TableHead className="font-semibold text-blue-900">
                                    <div className="flex items-center gap-2">
                                        <FaUserTag className="text-purple-600" />
                                        Role
                                    </div>
                                </TableHead>
                                <TableHead className="font-semibold text-blue-900">
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="text-orange-600" />
                                        Joined
                                    </div>
                                </TableHead>
                                <TableHead className="font-semibold text-blue-900">
                                    <div className="flex items-center gap-2">
                                        <FaUsers className="text-cyan-600" />
                                        Connections
                                    </div>
                                </TableHead>
                                <TableHead className="font-semibold text-blue-900">
                                    <div className="flex items-center gap-2">
                                        <FaToggleOn className="text-emerald-600" />
                                        Status
                                    </div>
                                </TableHead>
                                <TableHead className="font-semibold text-blue-900">
                                    <div className="flex items-center justify-center gap-2">
                                        <FaCog className="text-red-600" />
                                        Actions
                                    </div>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-gray-600">
                                        Loading users...
                                    </TableCell>
                                </TableRow>
                            ) : paginatedUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-gray-600">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedUsers.map((user) => (
                                    <TableRow
                                        key={user._id}
                                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-blue-100"
                                    >
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                {user.profilePhotos?.[0] ? (
                                                    <img
                                                        src={`${process.env.NEXT_PUBLIC_PICTURES_URL}${user.profilePhotos?.[0]}`}
                                                        alt={user.name}
                                                        className="w-10 h-10 rounded-full object-cover border border-blue-400"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border border-blue-400 text-gray-600 bg-gradient-to-b from-purple-200 to-blue-400">
                                                        {`${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || 'N'}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium">{user.name}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm text-gray-600">{user.email}</div>
                                        </TableCell>
                                        <TableCell>
                                            {/* {user.rolesDisplay.split(", ").map((role, index) => (
                                                <Badge key={index} className={`${getRoleStyles(role)} font-medium px-3 py-1 rounded-full`}>
                                                    {role}
                                                </Badge>
                                            ))} */}
                                            {user.rolesDisplay.split(", ").length > 1 ? (
                                                <Select value={user.rolesDisplay.split(", ")[0]}>
                                                    <SelectTrigger className={`${getRoleStyles(user.rolesDisplay.split(", ")[0])} font-medium ps-3 pe-1 max-h-7 rounded-full text-xs gap-1`} iconSize={true}>
                                                        <SelectValue placeholder={user.rolesDisplay.split(", ")[0]} />
                                                        <MdArrowDropDown />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white rounded-2xl">
                                                        {user.rolesDisplay.split(", ").map((role, index) => (
                                                            <SelectItem key={index} value={role} className="py-1 rounded-2xl hover:bg-amber-100">
                                                                {role}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <Badge className={`${getRoleStyles(user.rolesDisplay.split(", ")[0])} font-medium px-3 py-1 rounded-full`}>
                                                    {user.rolesDisplay.split(", ")[0]}
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <FaCalendarAlt className="text-orange-500" />
                                                {user.joinDate}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex -space-x-2">
                                                {user.connections.slice(0, 3).map((connection, index) => (
                                                    <img
                                                    // key={connection.id}
                                                    // src={connection.avatar || "/placeholder.svg"}
                                                    // alt={connection.name}
                                                    // className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                                    // title={connection.name}
                                                    />
                                                ))}
                                                {user.connections.length > 3 && (
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                                                        +{user.connections.length - 3}
                                                    </div>
                                                )}
                                                {user.connections.length === 0 && <span className="text-sm text-gray-400">No connections</span>}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`${getStatusStyles(user.status)} font-medium px-3 py-1 rounded-full`}>
                                                {user.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center space-x-2">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleViewUser(user)}
                                                    className="text-blue-500 hover:bg-blue-100 hover:text-blue-700 rounded-full transition-all duration-200"
                                                >
                                                    <FaEye />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleEditUser(user)}
                                                    className="text-green-500 hover:bg-green-100 hover:text-green-700 rounded-full transition-all duration-200"
                                                >
                                                    <FaEdit />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleDeleteUser(user)}
                                                    className="text-red-500 hover:bg-red-100 hover:text-red-700 rounded-full transition-all duration-200"
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {totalPages > 1 && (
                <Card className="shadow-md">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of{" "}
                                {filteredUsers.length} users
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
                                >
                                    <FaChevronLeft className="text-blue-500" />
                                    Previous
                                </Button>

                                <div className="flex items-center space-x-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <Button
                                            key={page}
                                            variant={currentPage === page ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-10 h-10 ${currentPage === page
                                                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                                                : "hover:bg-blue-50 hover:border-blue-300"
                                                }`}
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
                                    className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
                                >
                                    Next
                                    <FaChevronRight className="text-blue-500" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <UserViewModal user={selectedUser} isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} />

            <UserEditModal
                user={selectedUser}
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                onSave={handleSaveUser}
            />

            <UserDeleteModal
                user={selectedUser}
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
            />

            <AddUserModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} onAdd={handleAddUser} />
        </div>
    )
}
