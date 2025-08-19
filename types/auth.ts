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
}

// Auth payloads
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface VerifyResponse {
  user: User;
  valid: boolean;
}
