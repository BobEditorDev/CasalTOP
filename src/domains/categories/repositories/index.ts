import { prisma } from '@/lib/prisma'
import { Category, CreateCategoryInput, UpdateCategoryInput } from '../types'

export class CategoryRepository {
  async findAll(): Promise<Category[]> {
    return prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
  }

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { id }
    })
  }

  async create(data: CreateCategoryInput): Promise<Category> {
    return prisma.category.create({
      data
    })
  }

  async update(id: string, data: UpdateCategoryInput): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data
    })
  }

  async delete(id: string): Promise<Category> {
    return prisma.category.delete({
      where: { id }
    })
  }
}

export const categoryRepository = new CategoryRepository()