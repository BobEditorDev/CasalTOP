export interface Category {
  id: string
  name: string
  color?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateCategoryInput {
  name: string
  color?: string
}

export interface UpdateCategoryInput {
  name?: string
  color?: string
}