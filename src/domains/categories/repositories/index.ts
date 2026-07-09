import { prisma } from '@/lib/prisma'
import { Category, CreateCategoryInput, UpdateCategoryInput } from '../types'

export class CategoryRepository {
  async findAll(): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
    
    return categories.map(category => ({
      ...category,
      color: category.color || undefined
    }))
  }

  async findById(id: string): Promise<Category | null> {
    const category = await prisma.category.findUnique({
      where: { id }
    })
    
    if (!category) return null
    
    return {
      ...category,
      color: category.color || undefined
    }
  }

  async create(data: CreateCategoryInput): Promise<Category> {
    const category = await prisma.category.create({
      data
    })
    
    return {
      ...category,
      color: category.color || undefined
    }
  }

  async update(id: string, data: UpdateCategoryInput): Promise<Category> {
    const category = await prisma.category.update({
      where: { id },
      data
    })
    
    return {
      ...category,
      color: category.color || undefined
    }
  }

  async delete(id: string): Promise<Category> {
    const category = await prisma.category.delete({
      where: { id }
    })
    
    return {
      ...category,
      color: category.color || undefined
    }
  }
}

export const categoryRepository = new CategoryRepository()