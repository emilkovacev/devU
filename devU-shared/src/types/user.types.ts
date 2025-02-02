export type User = {
  id?: number
  externalId: string // School's unique identifier (the thing that links to the schools auth)
  email: string
  createdAt?: string
  updatedAt?: string
  preferredName?: string
  isAdmin: boolean
}
