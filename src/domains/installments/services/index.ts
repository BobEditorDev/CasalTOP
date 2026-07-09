import { installmentRepository } from '../repositories'
import { CreateInstallmentGroupInput, InstallmentPlan } from '../types'
import { prisma } from '@/lib/prisma'

export class InstallmentService {
  async getAll() {
    return installmentRepository.findAll()
  }

  async getById(id: string) {
    return installmentRepository.findById(id)
  }

  calculateInstallments(
    totalAmount: number,
    numberOfInstallments: number,
    firstDate: Date
  ): Array<{ date: Date; amount: number; number: number }> {
    const installmentAmount = totalAmount / numberOfInstallments
    const installments = []

    for (let i = 0; i < numberOfInstallments; i++) {
      const installmentDate = new Date(firstDate)
      installmentDate.setMonth(installmentDate.getMonth() + i)
      
      installments.push({
        date: installmentDate,
        amount: Math.round(installmentAmount * 100) / 100, // Round to 2 decimal places
        number: i + 1
      })
    }

    return installments
  }

  async createInstallmentGroup(
    data: CreateInstallmentGroupInput,
    expenseData: {
      userId: string
      personId: string
      categoryId: string
      paymentMethodId: string
      observation?: string
    }
  ) {
    const installments = this.calculateInstallments(
      data.totalAmount,
      data.numberOfInstallments,
      data.firstInstallmentDate
    )

    // Create the installment group
    const group = await installmentRepository.create(data)

    // Create expense records for each installment
    for (const installment of installments) {
      await prisma.expense.create({
        data: {
          date: installment.date,
          competence: installment.date,
          description: `${data.description} - ${installment.number}/${data.numberOfInstallments}`,
          amount: installment.amount,
          type: 'INSTALLMENT',
          userId: expenseData.userId,
          personId: expenseData.personId,
          categoryId: expenseData.categoryId,
          paymentMethodId: expenseData.paymentMethodId,
          observation: expenseData.observation,
          installmentGroupId: group.id,
          installmentNumber: installment.number
        }
      })
    }

    return group
  }

  async deleteInstallmentGroup(id: string) {
    // First, delete all associated expenses
    await prisma.expense.deleteMany({
      where: { installmentGroupId: id }
    })

    // Then delete the group
    return installmentRepository.delete(id)
  }

  async deleteFutureInstallments(groupId: string, currentInstallmentNumber: number) {
    // Delete all installments greater than the current one
    await prisma.expense.deleteMany({
      where: {
        installmentGroupId: groupId,
        installmentNumber: {
          gt: currentInstallmentNumber
        }
      }
    })

    // Update the group to reflect the new number of installments
    const group = await installmentRepository.findById(groupId)
    if (group) {
      await prisma.installmentGroup.update({
        where: { id: groupId },
        data: {
          numberOfInstallments: currentInstallmentNumber
        }
      })
    }
  }
}

export const installmentService = new InstallmentService()