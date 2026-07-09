export interface Expense {
  id: string
  date: Date
  competence: Date
  description: string
  amount: number
  observation?: string | null
  type: 'UNIQUE' | 'INSTALLMENT' | 'RECURRING'
  userId: string
  personId: string
  categoryId: string
  paymentMethodId: string
  installmentGroupId?: string | null
  installmentNumber?: number | null
  recurringExpenseId?: string | null
  createdAt: Date
  updatedAt: Date
  person?: {
    id: string
    name: string
  }
  category?: {
    id: string
    name: string
    color?: string | null
  }
  paymentMethod?: {
    id: string
    name: string
  }
}

export interface CreateExpenseInput {
  date: Date
  competence: Date
  description: string
  amount: number
  observation?: string
  type: 'UNIQUE' | 'INSTALLMENT' | 'RECURRING'
  userId: string
  personId: string
  categoryId: string
  paymentMethodId: string
  installmentGroupId?: string
  installmentNumber?: number
  recurringExpenseId?: string
}

export interface UpdateExpenseInput {
  date?: Date
  competence?: Date
  description?: string
  amount?: number
  observation?: string
  personId?: string
  categoryId?: string
  paymentMethodId?: string
}