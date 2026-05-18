export interface Guest {
  id: string
  name: string
  nucleus?: string
  invitedAt: string
  confirmed?: boolean
  phone?: string
  message?: string
  totalGuests?: number
  confirmedAt?: string | null
  companions?: string[]
  groupLeaderId?: string
}

export interface Message {
  id?: string
  name: string
  text: string
  createdAt: Date | string
}

export interface Gift {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  purchased?: boolean
  featured?: boolean
}
