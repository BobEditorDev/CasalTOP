export interface Income {
  id: string
  date: Date
  competence: Date
  description: string
  amount: number
  observation?: string | null
  userId: string
  personId: string
  createdAt: Date
  updatedAt: Date
  person?: {
    id: string
    name: string
  }
}

export interface CreateIncomeInput {
  date: Date
  competence: Date
  description: string
  amount: number
  observation?: string
  userId: string
  personId: string
}

export interface UpdateIncomeInput {
  date?: Date
  competence?: Date
  description?: string
  amount?: number
  observation?: string
  personId?: string
}