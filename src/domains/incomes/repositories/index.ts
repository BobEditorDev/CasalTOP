import { prisma } from '@/lib/prisma'
import { Income, CreateIncomeInput, UpdateIncomeInput } from '../types'

export class IncomeRepository {
  async findAll(): Promise<Income[]> {
    return prisma.income.findMany({
      include: {
        person: true
      },
      orderBy: { date: 'desc' }
    })
  }

  async findById(id: string): Promise<Income | null> {
    return prisma.income.findUnique({
      where: { id },
      include: {
        person: true
      }
    })
  }

  async findByCompetence(year: number, month: number): Promise<Income[]> {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)
    
    return prisma.income.findMany({
      where: {
        competence: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        person: true
      },
      orderBy: { date: 'desc' }
    })
  }

  async create(data: CreateIncomeInput): Promise<Income> {
    return prisma.income.create({
      data,
      include: {
        person: true
      }
    })
  }

  async update(id: string, data: UpdateIncomeInput): Promise<Income> {
    return prisma.income.update({
      where: { id },
      data,
      include: {
        person: true
      }
    })
  }

  async delete(id: string): Promise<Income> {
    return prisma.income.delete({
      where: { id },
      include: {
        person: true
      }
    })
  }
}

export const incomeRepository = new IncomeRepository()