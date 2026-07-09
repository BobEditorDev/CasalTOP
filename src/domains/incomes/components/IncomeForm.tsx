'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '@/shared/ui/Input'
import { DatePicker } from '@/shared/ui/DatePicker'
import { MoneyInput } from '@/shared/ui/MoneyInput'
import { Button } from '@/shared/ui/Button'
import { createIncome, updateIncome } from '../actions'
import { getPeople } from '@/domains/people/actions'

interface IncomeFormProps {
  income?: {
    id: string
    date: string
    competence: string
    description: string
    amount: number
    observation?: string
    personId: string
  }
  onSuccess?: () => void
  onCancel?: () => void
}

export const IncomeForm: React.FC<IncomeFormProps> = ({
  income,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    date: income?.date ? new Date(income.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    competence: income?.competence ? new Date(income.competence).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    description: income?.description || '',
    amount: income?.amount ? (income.amount / 100).toFixed(2) : '',
    observation: income?.observation || '',
    personId: income?.personId || '',
    userId: 'default-user' // TODO: Implement authentication
  })
  const [people, setPeople] = useState<Array<{ id: string; name: string }>>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadPeople()
  }, [])

  const loadPeople = async () => {
    try {
      const data = await getPeople()
      setPeople(data)
    } catch (error) {
      console.error('Failed to load people:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setIsSubmitting(true)

    try {
      const data = new FormData()
      data.append('date', formData.date)
      data.append('competence', formData.competence)
      data.append('description', formData.description)
      data.append('amount', formData.amount)
      if (formData.observation) {
        data.append('observation', formData.observation)
      }
      data.append('personId', formData.personId)
      data.append('userId', formData.userId)

      if (income) {
        await updateIncome(income.id, data)
      } else {
        await createIncome(data)
      }

      onSuccess?.()
      setFormData({
        date: new Date().toISOString().split('T')[0],
        competence: new Date().toISOString().split('T')[0],
        description: '',
        amount: '',
        observation: '',
        personId: '',
        userId: 'default-user'
      })
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ form: error.message })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const parseAmount = (value: string): number => {
    const numbers = value.replace(/\D/g, '')
    return Number(numbers) / 100
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DatePicker
        label="Data"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        required
      />

      <DatePicker
        label="Competência"
        value={formData.competence}
        onChange={(e) => setFormData({ ...formData, competence: e.target.value })}
        required
      />

      <div>
        <label className="mb-1 text-sm font-medium text-gray-700">Pessoa</label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={formData.personId}
          onChange={(e) => setFormData({ ...formData, personId: e.target.value })}
          required
        >
          <option value="">Selecione uma pessoa</option>
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Descrição"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        error={errors.description}
        required
      />

      <Input
        label="Valor"
        type="number"
        step="0.01"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        error={errors.amount}
        required
      />

      <Input
        label="Observação"
        value={formData.observation}
        onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
        error={errors.observation}
      />

      {errors.form && (
        <div className="text-red-600 text-sm">{errors.form}</div>
      )}

      <div className="flex space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : income ? 'Atualizar' : 'Criar'}
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