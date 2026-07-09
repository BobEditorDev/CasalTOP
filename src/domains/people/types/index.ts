export interface Person {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface CreatePersonInput {
  name: string
}

export interface UpdatePersonInput {
  id: string
  name?: string
}