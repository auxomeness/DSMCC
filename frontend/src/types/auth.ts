export type Role = "ADMIN" | "STAFF" | "TENANT"
export type UserStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED"

export type AuthUser = {
  id: string
  email: string
  role: Role
  status: UserStatus
  firstName?: string
  lastName?: string
}
