import { expenseRepository } from '../repositories'
import { CreateExpenseInput, UpdateExpenseInput } from '../validations'

export class ExpenseService {
  async getAll() {
    return expenseRepository.findAll()
  }

  async getById(id: string) {
    return expenseRepository.findById(id)
  }

  async getByCompetence(year: number, month: number) {
    return expenseRepository.findByCompetence(year, month)
  }

  async create(data: CreateExpenseInput) {
    return expenseRepository.create(data)
  }

  async update(id: string, data: UpdateExpenseInput) {
    const existing = await expenseRepository.findById(id)
    if (!existing) {
      throw new Error('Despesa não encontrada')
    }
    return expenseRepository.update(id, data)
  }

  async delete(id: string) {
    const existing = await expenseRepository.findById(id)
    if (!existing) {
      throw new Error('Despesa não encontrada')
    }
    return expenseRepository.delete(id)
  }
}

export const expenseService = new ExpenseService()