export enum RoleEnum {
    Admin = 1,
    User = 2, // Default
    Seller = 3,
    Buyer = 4,
    Agent = 5,
    Investor = 6,
}

export enum StatusEnum {
    Active = 'active',
    Inactive = 'inactive',
    Pending = 'pending',
    Suspended = 'suspended',
}

export interface User {
    _id: string;
    email: string;
    password?: string; // Not stored in frontend
    roles: number[]; // Array of RoleEnum values
    status: StatusEnum;
    firstName?: string;
    lastName?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        zipCode?: string;
    };
    phone?: string;
    profilePhotos?: string[];
    connections?: { userId: string; role: number }[];
    createdAt?: string; // ISO date string
    updatedAt?: string;
}

export interface AddUser {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    roles: number[];
    status: StatusEnum;
    phone?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        zipCode?: string;
    };
    profilePhotos?: string[];
    connections?: { userId: string; role: number }[];
}

export interface Property {
    _id: string;
    title: string;
    description?: string;
    location?: { type: string; coordinates: number[] };
    price: number;
    area?: number;
    type: 'sale' | 'rent';
    images?: string[];
    videos?: string[];
    status: 'pending' | 'approved' | 'rejected' | 'active' | 'inactive';
    ownerId: string;
    agents?: {
        agentId: string;
        firstName: string;
        lastName?: string;
        commissionRate: number;
        terms?: string;
        status: 'pending' | 'accepted' | 'rejected';
        phone?: string;
        profilePhotos?: string[];
    }[];
    amenities?: string[];
    contactName?: string;
    contactEmail?: string;
    contactNumber?: string;
    availableFrom?: Date;
    currency?: string;
    rentPeriod?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    heatingSystem?: string;
    coolingSystem?: string;
    parkingSpaces?: number;
    floorNumber?: number;
    bathrooms?: number;
    bedrooms?: number;
    propertyType?: string;
    purpose?: string;
    isFurnished?: boolean;
    latitude: string;
    longitude: string;
    listingDate: string;
    views: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AddProperty {
    title: string;
    description?: string;
    location?: { type: string; coordinates: number[] };
    price: number;
    area?: number;
    type: 'sale' | 'rent';
    images?: string[];
    videos?: string[];
    status: 'pending' | 'approved' | 'rejected' | 'active' | 'inactive';
    ownerId: string;
    agents?: {
        agentId: string;
        firstName: string;
        lastName?: string;
        commissionRate: number;
        terms?: string;
        phone?: string;
        status: 'pending' | 'accepted' | 'rejected';
        profilePhotos?: string[];
    }[];
    amenities?: string[];
    contactName?: string;
    contactEmail?: string;
    contactNumber?: string;
    availableFrom?: string;
    currency?: string;
    rentPeriod?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    heatingSystem?: string;
    coolingSystem?: string;
    parkingSpaces?: number;
    floorNumber?: number;
    bathrooms?: number;
    bedrooms?: number;
    propertyType?: string;
    purpose?: string;
    isFurnished?: boolean;
    latitude: string;
    longitude: string;
}

export interface Notification {
    _id: string;
    userId: string;
    message: string;
    read: boolean;
    type: 'email' | 'in-app' | 'sms';
    allowedRoles: number[];
    purpose: 'PROPERTY_CREATED' | 'PROPERTY_LISTED' | 'PROPERTY_SOLD' | 'USER_REGISTERED' | 'ROLE_REQUEST' | 'AGENT_APPROVED' | 'AGENT_REJECTED' | 'DEAL_REQUEST';
    relatedId?: string;
    relatedModel: 'User' | 'Property' | 'Agent' | 'Transaction';
    firstName?: string;
    lastName?: string;
    profilePhotos?: string[];
    createdAt: Date;
}

// Add more for other endpoints as needed (e.g., PropertyCreateData)

// export interface Coordinates {
//   lat: number;
//   lng: number;
// }

// export interface PropertyModel {
//   _id: string;
//   title?: string;
//   description?: string;
//   price?: number;
//   type: "sale" | "rent";
//   images?: string[];
//   status?: string;
//   city?: string;
//   state?: string;
//   country?: string;
//   coordinates?: Coordinates;
//   bedrooms?: number;
//   bathrooms?: number;
//   propertyType?: string;
//   purpose?: string;
// }