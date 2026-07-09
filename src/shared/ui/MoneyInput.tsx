import React from 'react'

interface MoneyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const MoneyInput: React.FC<MoneyInputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    const formatted = (Number(numbers) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
    return formatted
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const numbers = value.replace(/\D/g, '')
    const formatted = (Number(numbers) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
    e.target.value = formatted
    if (props.onChange) {
      props.onChange(e)
    }
  }

  return (
    <div className="flex flex-col">
      {label && (
        <label className="mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type="text"
        className={`px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? 'border-red-500' : ''
        } ${className}`}
        onChange={handleChange}
        {...props}
      />
      {error && (
        <span className="mt-1 text-sm text-red-600">{error}</span>
      )}
    </div>
  )
}