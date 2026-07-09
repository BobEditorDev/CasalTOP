import { prisma } from '@/lib/prisma'
import { MonthlySummary, CategoryReport, PersonReport, IncomeVsExpenseReport } from '../types'

export class ReportsRepository {
  async getMonthlySummary(year: number, month: number): Promise<MonthlySummary> {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    const incomes = await prisma.income.findMany({
      where: {
        competence: {
          gte: startDate,
          lte: endDate
        }
      }
    })

    const expenses = await prisma.expense.findMany({
      where: {
        competence: {
          gte: startDate,
          lte: endDate
        }
      }
    })

    const totalIncome = incomes.reduce((sum, income) => sum + Number(income.amount), 0)
    const totalExpense = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0)

    return {
      year,
      month,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      incomeCount: incomes.length,
      expenseCount: expenses.length
    }
  }

  async getExpensesByCategory(year: number, month: number): Promise<CategoryReport[]> {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    const expenses = await prisma.expense.findMany({
      where: {
        competence: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        category: true
      }
    })

    const categoryMap = new Map<string, { amount: number; count: number }>()
    let totalAmount = 0

    expenses.forEach(expense => {
      const categoryName = expense.category.name
      const current = categoryMap.get(categoryName) || { amount: 0, count: 0 }
      categoryMap.set(categoryName, {
        amount: current.amount + Number(expense.amount),
        count: current.count + 1
      })
      totalAmount += Number(expense.amount)
    })

    return Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        totalAmount: data.amount,
        transactionCount: data.count,
        percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount)
  }

  async getExpensesByPerson(year: number, month: number): Promise<PersonReport[]> {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    const expenses = await prisma.expense.findMany({
      where: {
        competence: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        person: true
      }
    })

    const incomes = await prisma.income.findMany({
      where: {
        competence: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        person: true
      }
    })

    const personMap = new Map<string, { income: number; expense: number; count: number }>()

    expenses.forEach(expense => {
      const personName = expense.person.name
      const current = personMap.get(personName) || { income: 0, expense: 0, count: 0 }
      personMap.set(personName, {
        income: current.income,
        expense: current.expense + Number(expense.amount),
        count: current.count + 1
      })
    })

    incomes.forEach(income => {
      const personName = income.person.name
      const current = personMap.get(personName) || { income: 0, expense: 0, count: 0 }
      personMap.set(personName, {
        income: current.income + Number(income.amount),
        expense: current.expense,
        count: current.count + 1
      })
    })

    return Array.from(personMap.entries())
      .map(([person, data]) => ({
        person,
        totalIncome: data.income,
        totalExpense: data.expense,
        balance: data.income - data.expense,
        transactionCount: data.count
      }))
      .sort((a, b) => b.transactionCount - a.transactionCount)
  }

  async getIncomeVsExpense(year: number, month: number): Promise<IncomeVsExpenseReport[]> {
    const reports: IncomeVsExpenseReport[] = []

    for (let m = 1; m <= month; m++) {
      const startDate = new Date(year, m - 1, 1)
      const endDate = new Date(year, m, 0)

      const incomes = await prisma.income.findMany({
        where: {
          competence: {
            gte: startDate,
            lte: endDate
          }
        }
      })

      const expenses = await prisma.expense.findMany({
        where: {
          competence: {
            gte: startDate,
            lte: endDate
          }
        }
      })

      const totalIncome = incomes.reduce((sum, income) => sum + Number(income.amount), 0)
      const totalExpense = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0)

      const monthName = new Date(year, m - 1).toLocaleDateString('pt-BR', { month: 'long' })

      reports.push({
        month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        income: totalIncome,
        expense: totalExpense,
        balance: totalIncome - totalExpense
      })
    }

    return reports
  }
}

export const reportsRepository = new ReportsRepository()