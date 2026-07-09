import { prisma } from '@/lib/prisma'
import { RecurringExpense, CreateRecurringExpenseInput, UpdateRecurringExpenseInput } from '../types'
import { decimalToNumber } from '@/shared/utils/prisma'

export class RecurringExpenseRepository {
  async findAll(): Promise<RecurringExpense[]> {
    const expenses = await prisma.recurringExpense.findMany({
      include: {
        expenses: {
          orderBy: { date: 'desc' },
          take: 12 // Last 12 expenses
        }
      },
      orderBy: { description: 'asc' }
    })
    
    return expenses.map(expense => ({
      ...expense,
      amount: decimalToNumber(expense.amount),
      expenses: expense.expenses.map(e => ({
        ...e,
        amount: decimalToNumber(e.amount)
      }))
    }))
  }

  async findActive(): Promise<RecurringExpense[]> {
    const expenses = await prisma.recurringExpense.findMany({
      where: { active: true },
      include: {
        expenses: {
          orderBy: { date: 'desc' },
          take: 12
        }
      },
      orderBy: { description: 'asc' }
    })
    
    return expenses.map(expense => ({
      ...expense,
      amount: decimalToNumber(expense.amount),
      expenses: expense.expenses.map(e => ({
        ...e,
        amount: decimalToNumber(e.amount)
      }))
    }))
  }

  async findById(id: string): Promise<RecurringExpense | null> {
    const expense = await prisma.recurringExpense.findUnique({
      where: { id },
      include: {
        expenses: {
          orderBy: { date: 'desc' }
        }
      }
    })
    
    if (!expense) return null
    
    return {
      ...expense,
      amount: decimalToNumber(expense.amount),
      expenses: expense.expenses.map(e => ({
        ...e,
        amount: decimalToNumber(e.amount)
      }))
    }
  }

  async create(data: CreateRecurringExpenseInput): Promise<RecurringExpense> {
    const expense = await prisma.recurringExpense.create({
      data
    })
    
    return {
      ...expense,
      amount: decimalToNumber(expense.amount),
      expenses: []
    }
  }

  async update(id: string, data: UpdateRecurringExpenseInput): Promise<RecurringExpense> {
    const expense = await prisma.recurringExpense.update({
      where: { id },
      data
    })
    
    return {
      ...expense,
      amount: decimalToNumber(expense.amount),
      expenses: []
    }
  }

  async delete(id: string): Promise<RecurringExpense> {
    const expense = await prisma.recurringExpense.delete({
      where: { id }
    })
    
    return {
      ...expense,
      amount: decimalToNumber(expense.amount),
      expenses: []
    }
  }
}

export const recurringExpenseRepository = new RecurringExpenseRepository()