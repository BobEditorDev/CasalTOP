import { paymentMethodRepository } from '../repositories'
import { CreatePaymentMethodInput, UpdatePaymentMethodInput } from '../validations'
import { Prisma } from '@prisma/client'

export class PaymentMethodService {
  async getAll() {
    return paymentMethodRepository.findAll()
  }

  async getById(id: string) {
    return paymentMethodRepository.findById(id)
  }

  async create(data: CreatePaymentMethodInput) {
    return paymentMethodRepository.create(data)
  }

  async update(id: string, data: UpdatePaymentMethodInput) {
    const existing = await paymentMethodRepository.findById(id)
    if (!existing) {
      throw new Error('Forma de pagamento não encontrada')
    }
    return paymentMethodRepository.update(id, data)
  }

  async delete(id: string) {
    const existing = await paymentMethodRepository.findById(id)
    if (!existing) {
      throw new Error('Forma de pagamento não encontrada')
    }
    
    try {
      return paymentMethodRepository.delete(id)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new Error('Não é possível excluir forma de pagamento que possui despesas vinculadas')
        }
      }
      throw error
    }
  }
}

export const paymentMethodService = new PaymentMethodService()