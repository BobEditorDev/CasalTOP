import { personRepository } from '../repositories'
import { CreatePersonInput, UpdatePersonInput } from '../validations'
import { Prisma } from '@prisma/client'

export class PersonService {
  async getAll() {
    return personRepository.findAll()
  }

  async getById(id: string) {
    return personRepository.findById(id)
  }

  async create(data: CreatePersonInput) {
    return personRepository.create(data)
  }

  async update(id: string, data: UpdatePersonInput) {
    const existing = await personRepository.findById(id)
    if (!existing) {
      throw new Error('Pessoa não encontrada')
    }
    return personRepository.update(id, data)
  }

  async delete(id: string) {
    const existing = await personRepository.findById(id)
    if (!existing) {
      throw new Error('Pessoa não encontrada')
    }
    
    try {
      return personRepository.delete(id)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new Error('Não é possível excluir pessoa que possui lançamentos vinculados')
        }
      }
      throw error
    }
  }
}

export const personService = new PersonService()