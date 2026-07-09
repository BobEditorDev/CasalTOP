import { prisma } from '@/lib/prisma'
import { Expense, CreateExpenseInput, UpdateExpenseInput } from '../types'
import { decimalToNumber } from '@/shared/utils/prisma'

export class ExpenseRepository {
  async findAll(): Promise<Expense[]> {
    const expenses = await prisma.expense.findMany({
      include: {
        person: true,
        category: true,
        paymentMethod: true
      },
      orderBy: { date: 'desc' }
    })
    
    return expenses.map(expense => ({
      ...expense,
      amount: decimalToNumber(expense.amount),
      observation: expense.observation || undefined,
      installmentGroupId: expense.installmentGroupId || undefined,
      installmentNumber: expense.installmentNumber || undefined,
      recurringExpenseId: expense.recurringExpenseId || undefined
    }))
  }

  async findById(id: string): Promise<Expense | null> {
    const expense = await prisma.expense.findUnique({
      where: { id },
      include: {
        person: true,
        category: true,
        paymentMethod: true
      }
    })
    
    if (!expense) return null
    
    return {
      ...expense,
      amount: decimalToNumber(expense.amount),
      observation: expense.observation || undefined,
      installmentGroupId: expense.installmentGroupId || undefined,
      installmentNumber: expense.installmentNumber || undefined,
      recurringExpenseId: expense.recurringExpenseId || undefined
    }
  }

  async findByCompetence(year: number, month: number): Promise<Expense[]> {
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
        person: true,
        category: true,
        paymentMethod: true
      },
      orderBy: { date: 'desc' }
    })
    
    return expenses.map(expense => ({
      ...expense,
      amount: decimalToNumber(expense.amount),
      observation: expense.observation || undefined,
      installmentGroupId: expense.installmentGroupId || undefined,
      installmentNumber: expense.installmentNumber || undefined,
      recurringExpenseId: expense.recurringExpenseId || undefined
    }))
  }

  async create(data: CreateExpenseInput): Promise<Expense> {
    const expense = await prisma.expense.create({
      data,
      include: {
        person: true,
        category: true,
        paymentMethod: true
      }
    })
    
    return {
      ...expense,
      amount: decimalToNumber(expense.amount),
      observation: expense.observation || undefined,
      installmentGroupId: expense.installmentGroupId || undefined,
      installmentNumber: expense.installmentNumber || undefined,
      recurringExpenseId: expense.recurringExpenseId || undefined
    }
  }

  async update(id: string, data: UpdateExpenseInput): Promise<Expense> {
    const expense = await prisma.expense.update({
      where: { id },
      data,
      include: {
        person: true,
        category: true,
        paymentMethod: true
      }
    })
    
    return {
      ...expense,
      amount: decimalToNumber(expense.amount),
      observation: expense.observation || undefined,
      installmentGroupId: expense.installmentGroupId || undefined,
      installmentNumber: expense.installmentNumber || undefined,
      recurringExpenseId: expense.recurringExpenseId || undefined
    }
  }

  async delete(id: string): Promise<Expense> {
    const expense = await prisma.expense.delete({
      where: { id },
      include: {
        person: true,
        category: true,
        paymentMethod: true
      }
    })
    
    return {
      ...expense,
      amount: decimalToNumber(expense.amount),
      observation: expense.observation || undefined,
      installmentGroupId: expense.installmentGroupId || undefined,
      installmentNumber: expense.installmentNumber || undefined,
      recurringExpenseId: expense.recurringExpenseId || undefined
    }
  }
}

export const expenseRepository = new ExpenseRepository()