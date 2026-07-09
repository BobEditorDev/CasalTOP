'use server'

import { personService } from '../services'
import { createPersonSchema, updatePersonSchema } from '../validations'
import { revalidatePath } from 'next/cache'

export async function getPeople() {
  return personService.getAll()
}

export async function getPerson(id: string) {
  return personService.getById(id)
}

export async function createPerson(formData: FormData) {
  const data = {
    name: formData.get('name') as string,
  }
  
  const validated = createPersonSchema.parse(data)
  await personService.create(validated)
  revalidatePath('/people')
}

export async function updatePerson(id: string, formData: FormData) {
  const data = {
    name: formData.get('name') as string | undefined,
  }
  
  const validated = updatePersonSchema.parse(data)
  await personService.update(id, validated)
  revalidatePath('/people')
}

export async function deletePerson(id: string) {
  await personService.delete(id)
  revalidatePath('/people')
}