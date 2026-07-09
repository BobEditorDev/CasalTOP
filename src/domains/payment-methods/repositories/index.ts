import { prisma } from '@/lib/prisma'
import { PaymentMethod, CreatePaymentMethodInput, UpdatePaymentMethodInput } from '../types'

export class PaymentMethodRepository {
  async findAll(): Promise<PaymentMethod[]> {
    return prisma.paymentMethod.findMany({
      orderBy: { name: 'asc' }
    })
  }

  async findById(id: string): Promise<PaymentMethod | null> {
    return prisma.paymentMethod.findUnique({
      where: { id }
    })
  }

  async create(data: CreatePaymentMethodInput): Promise<PaymentMethod> {
    return prisma.paymentMethod.create({
      data
    })
  }

  async update(id: string, data: UpdatePaymentMethodInput): Promise<PaymentMethod> {
    return prisma.paymentMethod.update({
      where: { id },
      data
    })
  }

  async delete(id: string): Promise<PaymentMethod> {
    return prisma.paymentMethod.delete({
      where: { id }
    })
  }
}

export const paymentMethodRepository = new PaymentMethodRepository()