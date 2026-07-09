import { prisma } from '@/lib/prisma'
import { InstallmentGroup, CreateInstallmentGroupInput } from '../types'

export class InstallmentRepository {
  async findAll(): Promise<InstallmentGroup[]> {
    return prisma.installmentGroup.findMany({
      include: {
        expenses: {
          orderBy: { installmentNumber: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  async findById(id: string): Promise<InstallmentGroup | null> {
    return prisma.installmentGroup.findUnique({
      where: { id },
      include: {
        expenses: {
          orderBy: { installmentNumber: 'asc' }
        }
      }
    })
  }

  async create(data: CreateInstallmentGroupInput): Promise<InstallmentGroup> {
    return prisma.installmentGroup.create({
      data
    })
  }

  async delete(id: string): Promise<InstallmentGroup> {
    return prisma.installmentGroup.delete({
      where: { id }
    })
  }
}

export const installmentRepository = new InstallmentRepository()