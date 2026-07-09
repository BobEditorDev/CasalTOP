export interface MonthlySummary {
  year: number
  month: number
  totalIncome: number
  totalExpense: number
  balance: number
  incomeCount: number
  expenseCount: number
}

export interface CategoryReport {
  category: string
  totalAmount: number
  transactionCount: number
  percentage: number
}

export interface PersonReport {
  person: string
  totalIncome: number
  totalExpense: number
  balance: number
  transactionCount: number
}

export interface IncomeVsExpenseReport {
  month: string
  income: number
  expense: number
  balance: number
}