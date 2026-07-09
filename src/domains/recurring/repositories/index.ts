import { prisma } from '@/lib/prisma'
import { RecurringExpense, CreateRecurringExpenseInput, UpdateRecurringExpenseInput } from '../types'

export class RecurringExpenseRepository {
  async findAll(): Promise<RecurringExpense[]> {
    return prisma.recurringExpense.findMany({
      include: {
        expenses: {
          orderBy: { date: 'desc' },
          take: 12 // Last 12 expenses
        }
      },
      orderBy: { description: 'asc' }
    })
  }

  async findActive(): Promise<RecurringExpense[]> {
    return prisma.recurringExpense.findMany({
      where: { active: true },
      include: {
        expenses: {
          orderBy: { date: 'desc' },
          take: 12
        }
      },
      orderBy: { description: 'asc' }
    })
  }

  async findById(id: string): Promise<RecurringExpense | null> {
    return prisma.recurringExpense.findUnique({
      where: { id },
      include: {
        expenses: {
          orderBy: { date: 'desc' }
        }
      }
    })
  }

  async create(data: CreateRecurringExpenseInput): Promise<RecurringExpense> {
    return prisma.recurringExpense.create({
      data
    })
  }

  async update(id: string, data: UpdateRecurringExpenseInput): Promise<RecurringExpense> {
    return prisma.recurringExpense.update({
      where: { id },
      data
    })
  }

  async delete(id: string): Promise<RecurringExpense> {
    return prisma.recurringExpense.delete({
      where: { id }
    })
  }
}

export const recurringExpenseRepository = new RecurringExpenseRepository()