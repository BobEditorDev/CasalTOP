'use server'

import { categoryService } from '../services'
import { createCategorySchema, updateCategorySchema } from '../validations'
import { revalidatePath } from 'next/cache'

export async function getCategories() {
  return categoryService.getAll()
}

export async function getCategory(id: string) {
  return categoryService.getById(id)
}

export async function createCategory(formData: FormData) {
  const data = {
    name: formData.get('name') as string,
    color: formData.get('color') as string | undefined,
  }
  
  const validated = createCategorySchema.parse(data)
  await categoryService.create(validated)
  revalidatePath('/categories')
}

export async function updateCategory(id: string, formData: FormData) {
  const data = {
    name: formData.get('name') as string | undefined,
    color: formData.get('color') as string | undefined,
  }
  
  const validated = updateCategorySchema.parse(data)
  await categoryService.update(id, validated)
  revalidatePath('/categories')
}

export async function deleteCategory(id: string) {
  await categoryService.delete(id)
  revalidatePath('/categories')
}