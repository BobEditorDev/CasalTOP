import { prisma } from '@/lib/prisma'
import { InstallmentGroup, CreateInstallmentGroupInput } from '../types'
import { decimalToNumber } from '@/shared/utils/prisma'

export class InstallmentRepository {
  async findAll(): Promise<InstallmentGroup[]> {
    const groups = await prisma.installmentGroup.findMany({
      include: {
        expenses: {
          orderBy: { installmentNumber: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return groups.map(group => ({
      ...group,
      totalAmount: decimalToNumber(group.totalAmount),
      expenses: group.expenses.map(expense => ({
        ...expense,
        amount: decimalToNumber(expense.amount)
      }))
    }))
  }

  async findById(id: string): Promise<InstallmentGroup | null> {
    const group = await prisma.installmentGroup.findUnique({
      where: { id },
      include: {
        expenses: {
          orderBy: { installmentNumber: 'asc' }
        }
      }
    })
    
    if (!group) return null
    
    return {
      ...group,
      totalAmount: decimalToNumber(group.totalAmount),
      expenses: group.expenses.map(expense => ({
        ...expense,
        amount: decimalToNumber(expense.amount)
      }))
    }
  }

  async create(data: CreateInstallmentGroupInput): Promise<InstallmentGroup> {
    const group = await prisma.installmentGroup.create({
      data
    })
    
    return {
      ...group,
      totalAmount: decimalToNumber(group.totalAmount),
      expenses: []
    }
  }

  async delete(id: string): Promise<InstallmentGroup> {
    const group = await prisma.installmentGroup.delete({
      where: { id }
    })
    
    return {
      ...group,
      totalAmount: decimalToNumber(group.totalAmount),
      expenses: []
    }
  }
}

export const installmentRepository = new InstallmentRepository()