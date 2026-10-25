export type Role = 'USER' | 'SELLER' | 'ADMIN'

export interface User {
  id: number
  name: string
  phone: string
  roles: Role[]
  /** ISO date */
  joinedAt: string
  blocked: boolean
}

export type UserPatch = Partial<Omit<User, 'id'>>
