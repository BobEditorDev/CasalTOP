'use client'

import React, { useState } from 'react'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { createPaymentMethod, updatePaymentMethod } from '../actions'

interface PaymentMethodFormProps {
  paymentMethod?: {
    id: string
    name: string
  }
  onSuccess?: () => void
  onCancel?: () => void
}

export const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({
  paymentMethod,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: paymentMethod?.name || ''
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

      if (paymentMethod) {
        await updatePaymentMethod(paymentMethod.id, data)
      } else {
        await createPaymentMethod(data)
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
          {isSubmitting ? 'Salvando...' : paymentMethod ? 'Atualizar' : 'Criar'}
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