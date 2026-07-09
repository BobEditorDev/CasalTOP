'use client'

import React from 'react'
import { Button } from '@/shared/ui/Button'
import { deleteCategory } from '../actions'
import { useRouter } from 'next/navigation'

interface CategoryListProps {
  categories: Array<{
    id: string
    name: string
    color?: string | null
  }>
}

export const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      await deleteCategory(id)
      router.refresh()
    }
  }

  if (categories.length === 0) {
    return <p className="text-gray-500">Nenhuma categoria cadastrada</p>
  }

  return (
    <ul className="space-y-2">
      {categories.map((category) => (
        <li key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            {category.color && (
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: category.color }}
              />
            )}
            <span>{category.name}</span>
          </div>
          <Button 
            variant="danger" 
            size="sm"
            onClick={() => handleDelete(category.id)}
          >
            Excluir
          </Button>
        </li>
      ))}
    </ul>
  )
}