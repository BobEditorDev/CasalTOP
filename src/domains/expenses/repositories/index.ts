import { prisma } from '@/lib/prisma'
import { Expense, CreateExpenseInput, UpdateExpenseInput } from '../types'

export class ExpenseRepository {
  async findAll(): Promise<Expense[]> {
    return prisma.expense.findMany({
      include: {
        person: true,
        category: true,
        paymentMethod: true
      },
      orderBy: { date: 'desc' }
    })
  }

  async findById(id: string): Promise<Expense | null> {
    return prisma.expense.findUnique({
      where: { id },
      include: {
        person: true,
        category: true,
        paymentMethod: true
      }
    })
  }

  async findByCompetence(year: number, month: number): Promise<Expense[]> {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)
    
    return prisma.expense.findMany({
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
  }

  async create(data: CreateExpenseInput): Promise<Expense> {
    return prisma.expense.create({
      data,
      include: {
        person: true,
        category: true,
        paymentMethod: true
      }
    })
  }

  async update(id: string, data: UpdateExpenseInput): Promise<Expense> {
    return prisma.expense.update({
      where: { id },
      data,
      include: {
        person: true,
        category: true,
        paymentMethod: true
      }
    })
  }

  async delete(id: string): Promise<Expense> {
    return prisma.expense.delete({
      where: { id },
      include: {
        person: true,
        category: true,
        paymentMethod: true
      }
    })
  }
}

export const expenseRepository = new ExpenseRepository()