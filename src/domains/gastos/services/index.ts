import { gastoRepository } from '../repositories'
import { CreateGastoInput, UpdateGastoInput } from '../types'

export class GastoService {
  async getAll() {
    return gastoRepository.findAll()
  }

  async getById(id: string) {
    return gastoRepository.findById(id)
  }

  async getByMonth(year: number, month: number) {
    return gastoRepository.findByMonth(year, month)
  }

  async getDistinctCategorias() {
    return gastoRepository.getDistinctCategorias()
  }

  async create(data: CreateGastoInput) {
    return gastoRepository.create(data)
  }

  async update(id: string, data: UpdateGastoInput) {
    const existing = await gastoRepository.findById(id)
    if (!existing) {
      throw new Error('Gasto não encontrado')
    }
    return gastoRepository.update(id, data)
  }

  async delete(id: string) {
    const existing = await gastoRepository.findById(id)
    if (!existing) {
      throw new Error('Gasto não encontrado')
    }
    return gastoRepository.delete(id)
  }
}

export const gastoService = new GastoService()