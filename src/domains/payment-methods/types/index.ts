export interface PaymentMethod {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface CreatePaymentMethodInput {
  name: string
}

export interface UpdatePaymentMethodInput {
  name?: string
}