'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '@/shared/ui/Input'
import { DatePicker } from '@/shared/ui/DatePicker'
import { Button } from '@/shared/ui/Button'
import { createExpense, updateExpense } from '../actions'
import { getPeople } from '@/domains/people/actions'
import { getCategories } from '@/domains/categories/actions'
import { getPaymentMethods } from '@/domains/payment-methods/actions'

interface ExpenseFormProps {
  expense?: {
    id: string
    date: string
    competence: string
    description: string
    amount: number
    observation?: string
    type: 'UNIQUE' | 'INSTALLMENT' | 'RECURRING'
    personId: string
    categoryId: string
    paymentMethodId: string
  }
  onSuccess?: () => void
  onCancel?: () => void
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  expense,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    date: expense?.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    competence: expense?.competence ? new Date(expense.competence).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    description: expense?.description || '',
    amount: expense?.amount ? expense.amount.toString() : '',
    observation: expense?.observation || '',
    type: expense?.type || 'UNIQUE',
    personId: expense?.personId || '',
    categoryId: expense?.categoryId || '',
    paymentMethodId: expense?.paymentMethodId || '',
    userId: 'default-user' // TODO: Implement authentication
  })
  const [people, setPeople] = useState<Array<{ id: string; name: string }>>([])
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [paymentMethods, setPaymentMethods] = useState<Array<{ id: string; name: string }>>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadData = async () => {
    try {
      const [peopleData, categoriesData, paymentMethodsData] = await Promise.all([
        getPeople(),
        getCategories(),
        getPaymentMethods()
      ])
      setPeople(peopleData)
      setCategories(categoriesData)
      setPaymentMethods(paymentMethodsData)
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

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
      data.append('type', formData.type)
      data.append('personId', formData.personId)
      data.append('categoryId', formData.categoryId)
      data.append('paymentMethodId', formData.paymentMethodId)
      data.append('userId', formData.userId)

      if (expense) {
        await updateExpense(expense.id, data)
      } else {
        await createExpense(data)
      }

      onSuccess?.()
      setFormData({
        date: new Date().toISOString().split('T')[0],
        competence: new Date().toISOString().split('T')[0],
        description: '',
        amount: '',
        observation: '',
        type: 'UNIQUE',
        personId: '',
        categoryId: '',
        paymentMethodId: '',
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
        <label className="mb-1 text-sm font-medium text-gray-700">Tipo</label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as 'UNIQUE' | 'INSTALLMENT' | 'RECURRING' })}
          required
        >
          <option value="UNIQUE">Única</option>
          <option value="INSTALLMENT">Parcelada</option>
          <option value="RECURRING">Recorrente</option>
        </select>
      </div>

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

      <div>
        <label className="mb-1 text-sm font-medium text-gray-700">Categoria</label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={formData.categoryId}
          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
          required
        >
          <option value="">Selecione uma categoria</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 text-sm font-medium text-gray-700">Forma de Pagamento</label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={formData.paymentMethodId}
          onChange={(e) => setFormData({ ...formData, paymentMethodId: e.target.value })}
          required
        >
          <option value="">Selecione uma forma de pagamento</option>
          {paymentMethods.map((method) => (
            <option key={method.id} value={method.id}>
              {method.name}
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
          {isSubmitting ? 'Salvando...' : expense ? 'Atualizar' : 'Criar'}
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