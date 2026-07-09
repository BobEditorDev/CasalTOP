import { prisma } from '@/lib/prisma'
import { Person, CreatePersonInput, UpdatePersonInput } from '../types'

export class PersonRepository {
  async findAll(): Promise<Person[]> {
    return prisma.person.findMany({
      orderBy: { name: 'asc' }
    })
  }

  async findById(id: string): Promise<Person | null> {
    return prisma.person.findUnique({
      where: { id }
    })
  }

  async create(data: CreatePersonInput): Promise<Person> {
    return prisma.person.create({
      data
    })
  }

  async update(id: string, data: UpdatePersonInput): Promise<Person> {
    return prisma.person.update({
      where: { id },
      data
    })
  }

  async delete(id: string): Promise<Person> {
    return prisma.person.delete({
      where: { id }
    })
  }
}

export const personRepository = new PersonRepository()