import { recurringExpenseRepository } from '../repositories'
import { CreateRecurringExpenseInput, UpdateRecurringExpenseInput } from '../validations'
import { prisma } from '@/lib/prisma'

export class RecurringExpenseService {
  async getAll() {
    return recurringExpenseRepository.findAll()
  }

  async getActive() {
    return recurringExpenseRepository.findActive()
  }

  async getById(id: string) {
    return recurringExpenseRepository.findById(id)
  }

  async create(data: CreateRecurringExpenseInput) {
    return recurringExpenseRepository.create(data)
  }

  async update(id: string, data: UpdateRecurringExpenseInput) {
    const existing = await recurringExpenseRepository.findById(id)
    if (!existing) {
      throw new Error('Despesa recorrente não encontrada')
    }
    return recurringExpenseRepository.update(id, data)
  }

  async deactivate(id: string) {
    return this.update(id, { active: false })
  }

  async delete(id: string) {
    const existing = await recurringExpenseRepository.findById(id)
    if (!existing) {
      throw new Error('Despesa recorrente não encontrada')
    }
    // Deactivate instead of delete to preserve history
    return this.deactivate(id)
  }

  async generateExpenseForMonth(
    recurringId: string,
    year: number,
    month: number,
    expenseData: {
      userId: string
      personId: string
      categoryId: string
      paymentMethodId: string
      observation?: string
    }
  ) {
    const recurring = await recurringExpenseRepository.findById(recurringId)
    if (!recurring) {
      throw new Error('Despesa recorrente não encontrada')
    }

    if (!recurring.active) {
      throw new Error('Despesa recorrente não está ativa')
    }

    // Calculate the date for this month
    const date = new Date(year, month - 1, recurring.day)
    
    // Check if expense already exists for this month
    const existingExpense = await prisma.expense.findFirst({
      where: {
        recurringExpenseId: recurringId,
        competence: {
          gte: new Date(year, month - 1, 1),
          lte: new Date(year, month, 0)
        }
      }
    })

    if (existingExpense) {
      return existingExpense
    }

    // Create the expense
    return prisma.expense.create({
      data: {
        date: date,
        competence: date,
        description: recurring.description,
        amount: recurring.amount,
        type: 'RECURRING',
        userId: expenseData.userId,
        personId: expenseData.personId,
        categoryId: expenseData.categoryId,
        paymentMethodId: expenseData.paymentMethodId,
        observation: expenseData.observation,
        recurringExpenseId: recurringId
      }
    })
  }

  async generateAllForMonth(
    year: number,
    month: number,
    expenseData: {
      userId: string
      personId: string
      categoryId: string
      paymentMethodId: string
      observation?: string
    }
  ) {
    const activeRecurring = await this.getActive()
    const results = []

    for (const recurring of activeRecurring) {
      try {
        const expense = await this.generateExpenseForMonth(
          recurring.id,
          year,
          month,
          expenseData
        )
        results.push({ recurring, expense, success: true })
      } catch (error) {
        results.push({ recurring, error, success: false })
      }
    }

    return results
  }
}

export const recurringExpenseService = new RecurringExpenseService()