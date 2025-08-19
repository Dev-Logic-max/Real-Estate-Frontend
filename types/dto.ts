export interface CreateAgentDto {
  userId: string; // Will be set to the newly created user's ID
  license?: string;
  commissionRate: number;
  balance?: number;
  bio?: string;
  phone?: string;
  documents?: string[];
  status?: 'pending' | 'approved' | 'rejected';
}