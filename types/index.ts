export interface Guest {
  id: string
  name: string
}

export interface Confirmation {
  id?: string
  guestId: string
  guestName: string
  email: string
  message?: string
  totalPeople: number
  confirmedAt: Date | string
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
