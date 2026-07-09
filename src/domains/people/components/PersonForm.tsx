'use client'

import React, { useState } from 'react'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { createPerson, updatePerson } from '../actions'

interface PersonFormProps {
  person?: {
    id: string
    name: string
  }
  onSuccess?: () => void
  onCancel?: () => void
}

export const PersonForm: React.FC<PersonFormProps> = ({
  person,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: person?.name || ''
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

      if (person) {
        await updatePerson(person.id, data)
      } else {
        await createPerson(data)
      }

      onSuccess?.()
      setFormData({ name: '' })
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

      {errors.form && (
        <div className="text-red-600 text-sm">{errors.form}</div>
      )}

      <div className="flex space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : person ? 'Atualizar' : 'Criar'}
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