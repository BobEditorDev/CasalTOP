'use client'

import React, { useState, useEffect, useRef } from 'react'

interface InlineEditCellProps {
  value: string | number | Date
  type: 'text' | 'date' | 'month' | 'currency' | 'select'
  options?: Array<{ value: string; label: string }> // para tipo select
  onSave: (newValue: string) => Promise<void>
}

export function InlineEditCell({ value, type, options, onSave }: InlineEditCellProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null)

  useEffect(() => {
    if (isEditing) {
      if (type === 'currency') {
        const cents = Math.round(Number(value) * 100).toString()
        setTempValue(cents)
      } else if (type === 'date') {
        const dateObj = new Date(value)
        const year = dateObj.getFullYear()
        const month = String(dateObj.getMonth() + 1).padStart(2, '0')
        const day = String(dateObj.getDate()).padStart(2, '0')
        setTempValue(`${year}-${month}-${day}`)
      } else if (type === 'month') {
        const dateObj = new Date(value)
        const year = dateObj.getFullYear()
        const month = String(dateObj.getMonth() + 1).padStart(2, '0')
        setTempValue(`${year}-${month}`)
      } else {
        setTempValue(String(value))
      }
      
      setTimeout(() => {
        inputRef.current?.focus()
        if (inputRef.current && 'select' in inputRef.current && type !== 'date' && type !== 'month' && type !== 'select') {
          (inputRef.current as HTMLInputElement).select()
        }
      }, 50)
    }
  }, [isEditing, value, type])

  const formatCurrencyDisplay = (val: number) => {
    return val.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const formatCurrencyMask = (valStr: string) => {
    const numbers = valStr.replace(/\D/g, '')
    return (Number(numbers) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      await save()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
    }
  }

  const save = async () => {
    if (isSaving) return
    setIsSaving(true)
    try {
      await onSave(tempValue)
      setIsEditing(false)
    } catch (err) {
      console.error('Erro ao salvar edição inline:', err)
    } finally {
      setIsSaving(false)
    }
  }

  if (isEditing) {
    if (type === 'select') {
      return (
        <select
          ref={inputRef as React.RefObject<HTMLSelectElement>}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={save}
          onKeyDown={handleKeyDown}
          className="w-full px-1 py-0.5 text-xs border border-blue-500 bg-white dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 rounded focus:outline-hidden"
        >
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type={type === 'date' ? 'date' : type === 'month' ? 'month' : 'text'}
        value={type === 'currency' ? formatCurrencyMask(tempValue) : tempValue}
        onChange={(e) => {
          if (type === 'currency') {
            const raw = e.target.value.replace(/\D/g, '')
            setTempValue(raw)
          } else {
            setTempValue(e.target.value)
          }
        }}
        onBlur={save}
        onKeyDown={handleKeyDown}
        className="w-full px-1.5 py-0.5 text-xs border border-blue-500 bg-white dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 rounded focus:outline-hidden font-semibold"
      />
    )
  }

  let displayValue = String(value)
  if (type === 'currency') {
    displayValue = formatCurrencyDisplay(Number(value))
  } else if (type === 'date') {
    displayValue = new Date(value).toLocaleDateString('pt-BR')
  } else if (type === 'month') {
    const dateObj = new Date(value)
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const year = dateObj.getFullYear()
    displayValue = `${month}/${year}`
  } else if (type === 'select' && options) {
    displayValue = options.find(o => o.value === value)?.label || String(value)
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="cursor-pointer hover:bg-slate-100/50 dark:hover:bg-zinc-800/40 px-2 py-1 -mx-2 -my-1 rounded transition-all duration-150 font-medium select-none min-h-[24px] flex items-center border border-transparent hover:border-slate-200/50 dark:hover:border-zinc-800/30"
    >
      {displayValue || <span className="text-slate-400 dark:text-zinc-650 italic">vazio</span>}
    </div>
  )
}
