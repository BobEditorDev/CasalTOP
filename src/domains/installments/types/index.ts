export interface InstallmentGroup {
  id: string
  description: string
  totalAmount: number
  numberOfInstallments: number
  firstInstallmentDate: Date
  createdAt: Date
  updatedAt: Date
  expenses?: Array<{
    id: string
    date: Date
    amount: number
    installmentNumber: number | null
  }>
}

export interface CreateInstallmentGroupInput {
  description: string
  totalAmount: number
  numberOfInstallments: number
  firstInstallmentDate: Date
}

export interface InstallmentPlan {
  group: InstallmentGroup
  installments: Array<{
    date: Date
    amount: number
    number: number
  }>
}