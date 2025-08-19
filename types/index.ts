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
        commissionRate: number;
        terms: string;
        status: 'pending' | 'accepted' | 'rejected';
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
        commissionRate: number;
        terms: string;
        status: 'pending' | 'accepted' | 'rejected';
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
}

// Add more for other endpoints as needed (e.g., PropertyCreateData)