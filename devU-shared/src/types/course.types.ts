export type Course = {
  id?: number
  name: string
  semester: string
  number: string
  startDate: string
  endDate: string
  createdAt?: string
  updatedAt?: string
  isPublic?: boolean;
  private_data?: string;
  allowlist?: string[]; 
  blocklist?: string[]; 
}
