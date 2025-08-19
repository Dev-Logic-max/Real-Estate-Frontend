"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FiX, FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiUpload, FiInfo, FiDollarSign } from "react-icons/fi"
import { PiUserCircleCheckDuotone } from "react-icons/pi";
import { RoleEnum, StatusEnum, AddUser } from "@/types"
import { toast } from "react-toastify"
import { userApi } from "@/lib/api/user"
import { CreateAgentDto } from "@/types/dto"
import { agentApi } from "@/lib/api/agent"
import { Badge } from "../ui/badge"

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (userData: AddUser) => void;
}

export default function AddUserModal({ isOpen, onClose, onAdd }: AddUserModalProps) {
  const [profilePhotos, setProfilePhotos] = useState<File[]>([]); // For local previews
  const [formData, setFormData] = useState<AddUser>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    roles: [RoleEnum.User],
    status: StatusEnum.Active,
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
    profilePhotos: [],
  });

  const [agentData, setAgentData] = useState<Partial<CreateAgentDto>>({
    commissionRate: 5,
    status: "approved", // Directly approved as per requirement
  })
  const [showAgentFields, setShowAgentFields] = useState(false)

  useEffect(() => {
    setShowAgentFields(formData.roles.includes(RoleEnum.Agent))
  }, [formData.roles])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.firstName || formData.password.length < 4) {
      toast.error("Please fill all required fields and ensure password is at least 4 characters");
      return;
    }
    // try {
    //   await onAdd(formData);
    //   toast.success("User added successfully");
    //   onClose();
    //   setFormData({
    //   });
    //   setProfilePhotos([]);
    // } catch (error) {
    //   toast.error("Failed to add user");
    // }

    try {
      // Create user first
      const userResponse = await userApi.create(formData)
      toast.success("User created successfully")

      const newUserId = userResponse.data.id // Assuming response contains the new user ID
      
      console.log("User api response", userResponse)

      // If Agent role, create agent record
      if (formData.roles.includes(RoleEnum.Agent)) {
        const agentPayload: CreateAgentDto = {
          userId: newUserId,
          license: agentData.license,
          commissionRate: agentData.commissionRate || 0,
          balance: agentData.balance,
          bio: agentData.bio,
          phone: agentData.phone, 
          documents: agentData.documents,
          status: agentData.status || "approved",
        }
        console.log("Agent Payload", agentPayload)
        await agentApi.createAgent(newUserId, agentPayload) 
      }

      toast.success("Agent created successfully")

      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
        roles: [RoleEnum.User],
        status: StatusEnum.Active,
        address: {
          street: "",
          city: "",
          state: "",
          country: "",
          zipCode: "",
        },
        profilePhotos: [],
      })
      setAgentData({ 
        commissionRate: 0, 
        status: "approved" 
      })
      setProfilePhotos([])
      onClose()
    } catch (error) {
      toast.error("Failed to add user or agent")
    }
  };

  const uploadProfilePhoto = async (file: File) => {
    try {
      const response = await userApi.uploadProfile(file);
      const newFilename = response.data; // Assuming response.data is the string (unique number or full filename)
      setFormData((prev) => ({
        ...prev,
        profilePhotos: [...(prev.profilePhotos ?? []), newFilename],
      }));
      toast.success("Profile photo uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload profile photo");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 3 - (formData.profilePhotos?.length ?? 0)); // Limit total to 3
      setProfilePhotos((prev) => [...prev, ...filesArray].slice(0, 3)); // Update local previews

      // Upload each file sequentially
      for (const file of filesArray) {
        await uploadProfilePhoto(file);
      }
      setProfilePhotos((prev) => prev.filter((f) => !filesArray.includes(f))); // Remove uploaded files from local previews
    }
  };

  const handleRoleChange = (value: string) => {
    const role = Number.parseInt(value)
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.includes(role) ? prev.roles : [role],
    }))
  }

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith("address.")) {
      const addressField = field.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else if (field.startsWith("agent.")) {
      const agentField = field.split(".")[1]
      setAgentData((prev) => ({ ...prev, [agentField]: value }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto bg-white border-2 border-blue-300 shadow-lg">
        <DialogHeader className="relative">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <PiUserCircleCheckDuotone className="w-10 h-10 text-green-400"/>
            Add New User
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-2 top-0 text-gray-500 bg-gray-100 hover:text-red-600 hover:bg-red-100 transition-colors"
          >
            <FiX className="h-5 w-5" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="bg-white rounded-lg p-5 border border-blue-100 shadow-sm flex justify-center">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2 justify-center">
                <FiUser className="text-blue-500" />
                Profile Picture
              </h3>
              <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {/* {formData.profilePhotos.length > 0 ? ( */}
                {(formData.profilePhotos?.length ?? 0) > 0 ? (
                  <img
                    src={`http://localhost:3010/uploads/${formData.profilePhotos![formData.profilePhotos!.length - 1]}`} // Use server URL for uploaded
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : profilePhotos.length > 0 ? (
                  <img
                    src={URL.createObjectURL(profilePhotos[profilePhotos.length - 1])}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500">No Image</span>
                )}
              </div>
              <div className="mt-4">
                <Label htmlFor="profilePhoto" className="text-blue-900 font-medium flex items-center gap-2 justify-center">
                  <FiUpload className="w-5 h-5 text-green-500" />
                  Upload Photos (max 3)
                </Label>
                <Input
                  id="profilePhoto"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileChange}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-300 mt-2"
                  multiple // Allow multiple file selection
                  placeholder="Select profile pictures"
                />
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-lg p-5 border border-blue-100 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <FiUser className="text-blue-500" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-blue-900 font-medium flex items-center gap-1">
                  <FiUser className="text-blue-500" />
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-300"
                  required
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-blue-900 font-medium flex items-center gap-1">
                  <FiUser className="text-blue-500" />
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-300"
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-blue-900 font-medium flex items-center gap-1">
                  <FiMail className="text-green-500" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-300"
                  required
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-blue-900 font-medium flex items-center gap-1">
                  <FiLock className="text-red-500" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-300"
                  required
                  placeholder="Enter password (min 4 chars)"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-blue-900 font-medium flex items-center gap-1">
                  <FiPhone className="text-purple-500" />
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-300"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="role" className="text-blue-900 font-medium flex items-center gap-1">
                  <FiUser className="text-orange-500" />
                  Role
                </Label>
                <Select
                  value={formData.roles[0]?.toString()}
                  onValueChange={handleRoleChange}
                  // onValueChange={(value) => handleInputChange("roles", [Number.parseInt(value)])}
                >
                  <SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-blue-300">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value={RoleEnum.User.toString()} className="hover:bg-blue-100">User</SelectItem>
                    <SelectItem value={RoleEnum.Agent.toString()} className="hover:bg-blue-100">Agent</SelectItem>
                    <SelectItem value={RoleEnum.Seller.toString()} className="hover:bg-blue-100">Seller</SelectItem>
                    <SelectItem value={RoleEnum.Buyer.toString()} className="hover:bg-blue-100">Buyer</SelectItem>
                    <SelectItem value={RoleEnum.Admin.toString()} className="hover:bg-blue-100">Admin</SelectItem>
                    <SelectItem value={RoleEnum.Investor.toString()} className="hover:bg-blue-100">Investor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-lg p-5 border border-blue-100 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <FiMapPin className="text-blue-500" />
              Address Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="street" className="text-blue-900 font-medium flex items-center gap-1">
                  <FiMapPin className="text-blue-500" />
                  Street Address
                </Label>
                <Input
                  id="street"
                  value={formData.address?.street}
                  onChange={(e) => handleInputChange("address.street", e.target.value)}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-300"
                  placeholder="Enter street address"
                />
              </div>
              <div>
                <Label htmlFor="city" className="text-blue-900 font-medium flex items-center gap-1">
                  <FiMapPin className="text-green-500" />
                  City
                </Label>
                <Input
                  id="city"
                  value={formData.address?.city}
                  onChange={(e) => handleInputChange("address.city", e.target.value)}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-300"
                  placeholder="Enter city"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-blue-900 font-medium flex items-center gap-1">
                  <FiMapPin className="text-purple-500" />
                  State
                </Label>
                <Input
                  id="state"
                  value={formData.address?.state}
                  onChange={(e) => handleInputChange("address.state", e.target.value)}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-300"
                  placeholder="Enter state"
                />
              </div>
              <div>
                <Label htmlFor="country" className="text-blue-900 font-medium flex items-center gap-1">
                  <FiMapPin className="text-orange-500" />
                  Country
                </Label>
                <Input
                  id="country"
                  value={formData.address?.country}
                  onChange={(e) => handleInputChange("address.country", e.target.value)}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-300"
                  placeholder="Enter country"
                />
              </div>
              <div>
                <Label htmlFor="zipCode" className="text-blue-900 font-medium flex items-center gap-1">
                  <FiMapPin className="text-red-500" />
                  Zip Code
                </Label>
                <Input
                  id="zipCode"
                  value={formData.address?.zipCode}
                  onChange={(e) => handleInputChange("address.zipCode", e.target.value)}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-300"
                  placeholder="Enter zip code"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-lg p-5 border border-blue-100 shadow-sm">
            <Label htmlFor="status" className="text-blue-900 font-medium flex items-center gap-1">
              <FiUser className="text-blue-500" />
              Status
            </Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-blue-300">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={StatusEnum.Active}>Active</SelectItem>
                <SelectItem value={StatusEnum.Inactive}>Inactive</SelectItem>
                <SelectItem value={StatusEnum.Pending}>Pending</SelectItem>
                <SelectItem value={StatusEnum.Suspended}>Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Agent Information (shown only if Agent role is selected) */}
          {showAgentFields && (
            <div className="bg-white rounded-lg p-5 border border-blue-100 shadow-sm">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <FiUser className="text-blue-500" />
                Agent Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="agent.license" className="text-blue-900 font-medium flex items-center gap-1">
                    <FiLock className="text-red-500" />
                    License
                  </Label>
                  <Input
                    id="agent.license"
                    value={agentData.license}
                    onChange={(e) => handleInputChange("agent.license", e.target.value)}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-300"
                    placeholder="Enter agent license"
                  />
                </div>
                <div>
                  <Label htmlFor="agent.commissionRate" className="text-blue-900 font-medium flex items-center gap-1">
                    <FiDollarSign className="text-green-500" />
                    Commission Rate (%)
                  </Label>
                  <Input
                    id="agent.commissionRate"
                    type="number"
                    value={agentData.commissionRate}
                    onChange={(e) => handleInputChange("agent.commissionRate", Number(e.target.value))}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-300"
                    placeholder="Enter commission rate"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label htmlFor="agent.bio" className="text-blue-900 font-medium flex items-center gap-1">
                    <FiInfo className="text-purple-500" />
                    Bio
                  </Label>
                  <Input
                    id="agent.bio"
                    value={agentData.bio}
                    onChange={(e) => handleInputChange("agent.bio", e.target.value)}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-300"
                    placeholder="Enter agent bio"
                  />
                </div>
                <div>
                  <Label htmlFor="agent.phone" className="text-blue-900 font-medium flex items-center gap-1">
                    <FiPhone className="text-purple-500" />
                    Phone
                  </Label>
                  <Input
                    id="agent.phone"
                    value={agentData.phone}
                    onChange={(e) => handleInputChange("agent.phone", e.target.value)}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-300"
                    placeholder="Enter agent phone"
                  />
                </div>
                <div>
                  <Label htmlFor="agent.documents" className="text-blue-900 font-medium flex items-center gap-1">
                    <FiUpload className="text-green-500" />
                    Documents (max 3)
                  </Label>
                  <Input
                    id="agent.documents"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,pdf"
                    onChange={async (e) => {
                      if (e.target.files) {
                        const filesArray = Array.from(e.target.files).slice(0, 3 - (agentData.documents?.length ?? 0))
                        const uploadPromises = filesArray.map(async (file) => {
                          const response = await agentApi.uploadDocument(file)
                          return response.data
                        })
                        const uploadedDocuments = await Promise.all(uploadPromises)
                        setAgentData((prev: any) => ({
                          ...prev,
                          documents: [...(prev.documents || []), ...uploadedDocuments],
                        }))
                      }
                    }}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-300 mt-2"
                    multiple
                  />
                  {agentData.documents?.map((doc, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 m-1">
                      {doc}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-blue-300 text-blue-900 hover:bg-blue-50 hover:border-blue-400"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
            >
              Add User
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}