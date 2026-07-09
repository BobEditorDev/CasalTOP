'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '@/shared/ui/Input'
import { DatePicker } from '@/shared/ui/DatePicker'
import { Button } from '@/shared/ui/Button'
import { createInstallmentGroup } from '../actions'
import { getPeople } from '@/domains/people/actions'
import { getCategories } from '@/domains/categories/actions'
import { getPaymentMethods } from '@/domains/payment-methods/actions'

interface InstallmentFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export const InstallmentForm: React.FC<InstallmentFormProps> = ({
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    description: '',
    totalAmount: '',
    numberOfInstallments: '2',
    firstInstallmentDate: new Date().toISOString().split('T')[0],
    personId: '',
    categoryId: '',
    paymentMethodId: '',
    observation: '',
    userId: 'default-user' // TODO: Implement authentication
  })
  const [people, setPeople] = useState<Array<{ id: string; name: string }>>([])
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [paymentMethods, setPaymentMethods] = useState<Array<{ id: string; name: string }>>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setIsSubmitting(true)

    try {
      const data = new FormData()
      data.append('description', formData.description)
      data.append('totalAmount', formData.totalAmount)
      data.append('numberOfInstallments', formData.numberOfInstallments)
      data.append('firstInstallmentDate', formData.firstInstallmentDate)
      data.append('personId', formData.personId)
      data.append('categoryId', formData.categoryId)
      data.append('paymentMethodId', formData.paymentMethodId)
      if (formData.observation) {
        data.append('observation', formData.observation)
      }
      data.append('userId', formData.userId)

      await createInstallmentGroup(data)

      onSuccess?.()
      setFormData({
        description: '',
        totalAmount: '',
        numberOfInstallments: '2',
        firstInstallmentDate: new Date().toISOString().split('T')[0],
        personId: '',
        categoryId: '',
        paymentMethodId: '',
        observation: '',
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

  const calculatePreview = () => {
    const total = parseFloat(formData.totalAmount) || 0
    const num = parseInt(formData.numberOfInstallments) || 1
    return (total / num).toFixed(2)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Descrição"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        error={errors.description}
        required
      />

      <Input
        label="Valor Total"
        type="number"
        step="0.01"
        value={formData.totalAmount}
        onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
        error={errors.totalAmount}
        required
      />

      <Input
        label="Número de Parcelas"
        type="number"
        min="2"
        max="120"
        value={formData.numberOfInstallments}
        onChange={(e) => setFormData({ ...formData, numberOfInstallments: e.target.value })}
        error={errors.numberOfInstallments}
        required
      />

      <DatePicker
        label="Data da Primeira Parcela"
        value={formData.firstInstallmentDate}
        onChange={(e) => setFormData({ ...formData, firstInstallmentDate: e.target.value })}
        required
      />

      {formData.totalAmount && formData.numberOfInstallments && (
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-800">
            Valor de cada parcela: <strong>R$ {calculatePreview()}</strong>
          </p>
        </div>
      )}

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
          {isSubmitting ? 'Criando...' : 'Criar Parcelamento'}
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