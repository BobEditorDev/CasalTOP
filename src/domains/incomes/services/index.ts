import { incomeRepository } from '../repositories'
import { CreateIncomeInput, UpdateIncomeInput } from '../validations'

export class IncomeService {
  async getAll() {
    return incomeRepository.findAll()
  }

  async getById(id: string) {
    return incomeRepository.findById(id)
  }

  async getByCompetence(year: number, month: number) {
    return incomeRepository.findByCompetence(year, month)
  }

  async create(data: CreateIncomeInput) {
    return incomeRepository.create(data)
  }

  async update(id: string, data: UpdateIncomeInput) {
    const existing = await incomeRepository.findById(id)
    if (!existing) {
      throw new Error('Receita não encontrada')
    }
    return incomeRepository.update(id, data)
  }

  async delete(id: string) {
    const existing = await incomeRepository.findById(id)
    if (!existing) {
      throw new Error('Receita não encontrada')
    }
    return incomeRepository.delete(id)
  }
}

export const incomeService = new IncomeService()