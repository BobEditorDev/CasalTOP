import { prisma } from '@/lib/prisma'
import { Income, CreateIncomeInput, UpdateIncomeInput } from '../types'
import { decimalToNumber } from '@/shared/utils/prisma'

export class IncomeRepository {
  async findAll(): Promise<Income[]> {
    const incomes = await prisma.income.findMany({
      include: {
        person: true
      },
      orderBy: { date: 'desc' }
    })
    
    return incomes.map(income => ({
      ...income,
      amount: decimalToNumber(income.amount),
      observation: income.observation || undefined
    }))
  }

  async findById(id: string): Promise<Income | null> {
    const income = await prisma.income.findUnique({
      where: { id },
      include: {
        person: true
      }
    })
    
    if (!income) return null
    
    return {
      ...income,
      amount: decimalToNumber(income.amount),
      observation: income.observation || undefined
    }
  }

  async findByCompetence(year: number, month: number): Promise<Income[]> {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)
    
    const incomes = await prisma.income.findMany({
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
    
    return incomes.map(income => ({
      ...income,
      amount: decimalToNumber(income.amount),
      observation: income.observation || undefined
    }))
  }

  async create(data: CreateIncomeInput): Promise<Income> {
    const income = await prisma.income.create({
      data,
      include: {
        person: true
      }
    })
    
    return {
      ...income,
      amount: decimalToNumber(income.amount),
      observation: income.observation || undefined
    }
  }

  async update(id: string, data: UpdateIncomeInput): Promise<Income> {
    const income = await prisma.income.update({
      where: { id },
      data,
      include: {
        person: true
      }
    })
    
    return {
      ...income,
      amount: decimalToNumber(income.amount),
      observation: income.observation || undefined
    }
  }

  async delete(id: string): Promise<Income> {
    const income = await prisma.income.delete({
      where: { id },
      include: {
        person: true
      }
    })
    
    return {
      ...income,
      amount: decimalToNumber(income.amount),
      observation: income.observation || undefined
    }
  }
}

export const incomeRepository = new IncomeRepository()