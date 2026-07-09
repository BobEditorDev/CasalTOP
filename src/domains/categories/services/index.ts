import { categoryRepository } from '../repositories'
import { CreateCategoryInput, UpdateCategoryInput } from '../validations'
import { Prisma } from '@prisma/client'

export class CategoryService {
  async getAll() {
    return categoryRepository.findAll()
  }

  async getById(id: string) {
    return categoryRepository.findById(id)
  }

  async create(data: CreateCategoryInput) {
    return categoryRepository.create(data)
  }

  async update(id: string, data: UpdateCategoryInput) {
    const existing = await categoryRepository.findById(id)
    if (!existing) {
      throw new Error('Categoria não encontrada')
    }
    return categoryRepository.update(id, data)
  }

  async delete(id: string) {
    const existing = await categoryRepository.findById(id)
    if (!existing) {
      throw new Error('Categoria não encontrada')
    }
    
    try {
      return categoryRepository.delete(id)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new Error('Não é possível excluir categoria que possui despesas vinculadas')
        }
      }
      throw error
    }
  }
}

export const categoryService = new CategoryService()