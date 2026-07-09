export interface RecurringExpense {
  id: string
  description: string
  amount: number
  day: number
  active: boolean
  createdAt: Date
  updatedAt: Date
  expenses?: Array<{
    id: string
    date: Date
    amount: number
  }>
}

export interface CreateRecurringExpenseInput {
  description: string
  amount: number
  day: number
}

export interface UpdateRecurringExpenseInput {
  description?: string
  amount?: number
  day?: number
  active?: boolean
}