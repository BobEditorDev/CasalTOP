'use client'

import React, { useState } from 'react'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { createCategory, updateCategory } from '../actions'

interface CategoryFormProps {
  category?: {
    id: string
    name: string
    color?: string
  }
  onSuccess?: () => void
  onCancel?: () => void
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    color: category?.color || ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setIsSubmitting(true)

    try {
      const data = new FormData()
      data.append('name', formData.name)
      if (formData.color) {
        data.append('color', formData.color)
      }

      if (category) {
        await updateCategory(category.id, data)
      } else {
        await createCategory(data)
      }

      onSuccess?.()
      setFormData({ name: '', color: '' })
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ form: error.message })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nome"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
        required
      />

      <Input
        label="Cor (hexadecimal)"
        value={formData.color}
        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
        placeholder="#000000"
        error={errors.color}
      />

      {errors.form && (
        <div className="text-red-600 text-sm">{errors.form}</div>
      )}

      <div className="flex space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : category ? 'Atualizar' : 'Criar'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  )
}