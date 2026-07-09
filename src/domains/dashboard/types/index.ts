export interface DashboardData {
  totalIncome: number
  totalExpense: number
  balance: number
  incomeCount: number
  expenseCount: number
  recentTransactions: Array<{
    id: string
    type: 'income' | 'expense'
    description: string
    amount: number
    date: string
  }>
  expensesByCategory: Array<{
    category: string
    amount: number
    percentage: number
  }>
  expensesByPerson: Array<{
    person: string
    amount: number
    percentage: number
  }>
}