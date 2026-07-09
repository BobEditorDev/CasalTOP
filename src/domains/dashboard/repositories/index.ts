import { prisma } from '@/lib/prisma'
import { DashboardData } from '../types'

export class DashboardRepository {
  async getDataByCompetence(year: number, month: number): Promise<DashboardData> {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    // Get incomes for the month
    const incomes = await prisma.income.findMany({
      where: {
        competence: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        person: true
      },
      orderBy: { date: 'desc' }
    })

    // Get expenses for the month
    const expenses = await prisma.expense.findMany({
      where: {
        competence: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        person: true,
        category: true
      },
      orderBy: { date: 'desc' }
    })

    // Calculate totals
    const totalIncome = incomes.reduce((sum, income) => sum + Number(income.amount), 0)
    const totalExpense = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0)
    const balance = totalIncome - totalExpense

    // Get recent transactions (last 10)
    const recentTransactions = [
      ...incomes.slice(0, 5).map(income => ({
        id: income.id,
        type: 'income' as const,
        description: income.description,
        amount: Number(income.amount),
        date: income.date.toISOString()
      })),
      ...expenses.slice(0, 5).map(expense => ({
        id: expense.id,
        type: 'expense' as const,
        description: expense.description,
        amount: Number(expense.amount),
        date: expense.date.toISOString()
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10)

    // Calculate expenses by category
    const expensesByCategoryMap = new Map<string, number>()
    expenses.forEach(expense => {
      const categoryName = expense.category.name
      const current = expensesByCategoryMap.get(categoryName) || 0
      expensesByCategoryMap.set(categoryName, current + Number(expense.amount))
    })

    const expensesByCategory = Array.from(expensesByCategoryMap.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount)

    // Calculate expenses by person
    const expensesByPersonMap = new Map<string, number>()
    expenses.forEach(expense => {
      const personName = expense.person.name
      const current = expensesByPersonMap.get(personName) || 0
      expensesByPersonMap.set(personName, current + Number(expense.amount))
    })

    const expensesByPerson = Array.from(expensesByPersonMap.entries())
      .map(([person, amount]) => ({
        person,
        amount,
        percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount)

    return {
      totalIncome,
      totalExpense,
      balance,
      incomeCount: incomes.length,
      expenseCount: expenses.length,
      recentTransactions,
      expensesByCategory,
      expensesByPerson
    }
  }
}

export const dashboardRepository = new DashboardRepository()