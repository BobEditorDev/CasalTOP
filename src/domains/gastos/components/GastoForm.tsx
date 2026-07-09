'use client'

import React, { useState, useEffect } from 'react'
import { createGasto } from '../actions'
import { getDistinctCategorias } from '../actions'
import { getSessaoUsuario } from '@/lib/auth'

export function GastoForm() {
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    categoria: '',
    tipo: 'RODRIGO_PAGA' as 'RODRIGO_PAGA' | 'GIOVANA_PAGA' | 'RODRIGO_PAGOU_DA_GIOVANA' | 'GIOVANA_PAGOU_DO_RODRIGO',
    valor: '',
    observacao: '',
    usuarioId: ''
  })

  const [categorias, setCategorias] = useState<string[]>([])
  const [sugestoes, setSugestoes] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false)
  const [usuario, setUsuario] = useState<{ id: string; nome: string } | null>(null)

  useEffect(() => {
    loadUsuario()
    loadCategorias()
  }, [])

  const loadUsuario = async () => {
    try {
      const usuarioSessao = await getSessaoUsuario()
      if (usuarioSessao) {
        setUsuario(usuarioSessao)
        setFormData(prev => ({ ...prev, usuarioId: usuarioSessao.id }))
      }
    } catch (error) {
      console.error('Failed to load usuario:', error)
    }
  }

  const loadCategorias = async () => {
    try {
      const data = await getDistinctCategorias()
      setCategorias(data)
    } catch (error) {
      console.error('Failed to load categorias:', error)
    }
  }

  const handleCategoriaChange = (value: string) => {
    setFormData(prev => ({ ...prev, categoria: value }))
    
    if (value.length > 0) {
      const filtradas = categorias.filter(cat => 
        cat.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5)
      setSugestoes(filtradas)
      setMostrarSugestoes(true)
    } else {
      setMostrarSugestoes(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const data = new FormData()
      data.append('data', formData.data)
      data.append('categoria', formData.categoria)
      data.append('tipo', formData.tipo)
      data.append('valor', formData.valor)
      if (formData.observacao) data.append('observacao', formData.observacao)
      data.append('usuarioId', formData.usuarioId)

      await createGasto(data)

      // Limpar formulário e manter foco pronto para próximo lançamento
      setFormData({
        data: new Date().toISOString().split('T')[0],
        categoria: '',
        tipo: 'RODRIGO_PAGA',
        valor: '',
        observacao: '',
        usuarioId: formData.usuarioId
      })

      // Feedback visual simples
      alert('Gasto salvo com sucesso!')
    } catch (error) {
      console.error('Failed to create gasto:', error)
      alert('Erro ao salvar gasto')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return (Number(numbers) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numbers = e.target.value.replace(/\D/g, '')
    const formatted = (Number(numbers) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
    e.target.value = formatted
    setFormData(prev => ({ ...prev, valor: numbers }))
  }

  if (!usuario) {
    return <div className="text-center py-8">Carregando...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data
        </label>
        <input
          type="date"
          value={formData.data}
          onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          required
        />
      </div>

      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Categoria
        </label>
        <input
          type="text"
          value={formData.categoria}
          onChange={(e) => handleCategoriaChange(e.target.value)}
          onFocus={() => setMostrarSugestoes(true)}
          onBlur={() => setTimeout(() => setMostrarSugestoes(false), 200)}
          placeholder="Digite a categoria..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          required
          autoComplete="off"
        />
        
        {mostrarSugestoes && sugestoes.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
            {sugestoes.map((sugestao) => (
              <div
                key={sugestao}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setFormData(prev => ({ ...prev, categoria: sugestao }))
                  setMostrarSugestoes(false)
                }}
              >
                {sugestao}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo
        </label>
        <select
          value={formData.tipo}
          onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as any }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          required
        >
          <option value="RODRIGO_PAGA">Rodrigo Paga</option>
          <option value="GIOVANA_PAGA">Giovana Paga</option>
          <option value="RODRIGO_PAGOU_DA_GIOVANA">Rodrigo Pagou da Giovana</option>
          <option value="GIOVANA_PAGOU_DO_RODRIGO">Giovana Pagou do Rodrigo</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Valor
        </label>
        <input
          type="text"
          value={formData.valor ? formatCurrency(formData.valor) : ''}
          onChange={handleValorChange}
          placeholder="R$ 0,00"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg text-right"
          inputMode="numeric"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observação (opcional)
        </label>
        <input
          type="text"
          value={formData.observacao}
          onChange={(e) => setFormData(prev => ({ ...prev, observacao: e.target.value }))}
          placeholder="Detalhes adicionais..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Salvando...' : 'Salvar Gasto'}
      </button>
    </form>
  )
}