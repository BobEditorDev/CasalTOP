'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ContextoMensalBar } from './ContextoMensalBar'
import { QuickAddRow } from './QuickAddRow'
import { GastoList } from './GastoList'
import { useMonthNavigation } from '@/shared/hooks/useMonthNavigation'
import { Gasto } from '../types'
import { ResultadoRateio, calcularRateioMensal } from '@/lib/calculos'
import { deleteGasto, duplicateGasto, updateGasto } from '../actions'
import { UndoToast } from '@/shared/ui/UndoToast'

interface GastoDashboardClientProps {
  initialGastos: Gasto[]
  rateio: ResultadoRateio
  distinctCategorias: string[]
  topCategorias: string[]
  usuarioId: string
  percentualRodrigo: number
  percentualGiovana: number
  filtroCategoria?: string
}

export function GastoDashboardClient({
  initialGastos,
  distinctCategorias,
  topCategorias,
  usuarioId,
  percentualRodrigo,
  percentualGiovana,
  filtroCategoria
}: GastoDashboardClientProps) {
  const { year, month, setMonth } = useMonthNavigation()
  const router = useRouter()

  // Lista local de gastos para updates otimistas
  const [gastos, setGastos] = useState<Gasto[]>(initialGastos)

  // Sincronizar estado local quando as props mudarem (ex: troca de mês)
  useEffect(() => {
    setGastos(initialGastos)
  }, [initialGastos])

  // Lógica de exclusão pendente (Undo)
  const [gastoPendente, setGastoPendente] = useState<Gasto | null>(null)
  const [showToast, setShowToast] = useState(false)

  // Se o componente for desmontado ou trocar de mês, processamos qualquer exclusão pendente
  useEffect(() => {
    return () => {
      if (gastoPendente) {
        deleteGasto(gastoPendente.id)
      }
    }
  }, [gastoPendente])

  // Calcular o rateio em tempo real com base no estado local (gastos)
  const rateioCalculado = useMemo(() => {
    const gastosParaCalculo = gastos.map(g => ({
      tipo: g.tipo,
      valor: g.valor,
      data: new Date(g.data),
      categoria: g.categoria
    }))
    return calcularRateioMensal(
      gastosParaCalculo,
      percentualRodrigo,
      percentualGiovana,
      year,
      month
    )
  }, [gastos, percentualRodrigo, percentualGiovana, year, month])

  const handleMonthChange = (newYear: number, newMonth: number) => {
    // Processar exclusão pendente antes de trocar de mês
    if (gastoPendente) {
      deleteGasto(gastoPendente.id)
      setGastoPendente(null)
      setShowToast(false)
    }
    setMonth(newYear, newMonth)
  }

  const handleAddSuccess = () => {
    router.refresh()
  }

  const handleEdit = async (gastoId: string, field: string, newValue: string) => {
    const originalGastos = [...gastos]
    
    // update otimista local
    setGastos(prev => prev.map(g => {
      if (g.id === gastoId) {
        let val = g.valor
        let dataVal = g.data
        if (field === 'valor') {
          val = Number(newValue) / 100
        } else if (field === 'data') {
          const parts = newValue.split('-').map(Number)
          if (parts.length === 2) {
            dataVal = new Date(parts[0], parts[1] - 1, 1, 12, 0, 0)
          } else {
            dataVal = new Date(parts[0], parts[1] - 1, parts[2] || 1, 12, 0, 0)
          }
        }
        return {
          ...g,
          [field]: field === 'valor' ? val : field === 'data' ? dataVal : newValue
        }
      }
      return g
    }))

    try {
      const formData = new FormData()
      formData.append(field, newValue)
      await updateGasto(gastoId, formData)
      router.refresh()
    } catch (err) {
      console.error('Erro ao editar gasto:', err)
      // Rollback
      setGastos(originalGastos)
    }
  }

  const handleDeleteTrigger = (id: string) => {
    // Se já havia um pendente, deletamos ele agora definitivamente
    if (gastoPendente) {
      deleteGasto(gastoPendente.id)
    }

    const g = gastos.find(item => item.id === id)
    if (!g) return

    // Guardar para possível desfazer
    setGastoPendente(g)
    // Remover visualmente da lista
    setGastos(prev => prev.filter(item => item.id !== id))
    setShowToast(true)
  }

  const handleUndoDelete = () => {
    if (!gastoPendente) return
    // Reinserir na lista
    setGastos(prev => [gastoPendente, ...prev].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()))
    setGastoPendente(null)
    setShowToast(false)
  }

  const handleConfirmDelete = async () => {
    if (!gastoPendente) return
    const id = gastoPendente.id
    setGastoPendente(null)
    setShowToast(false)
    try {
      await deleteGasto(id)
      router.refresh()
    } catch (err) {
      console.error('Erro ao excluir gasto:', err)
    }
  }

  const handleRepeat = async (id: string) => {
    try {
      const novoGasto = await duplicateGasto(id)
      // Inserir otimisticamente na lista local
      setGastos(prev => [novoGasto, ...prev])
      router.refresh()
    } catch (err) {
      console.error('Erro ao repetir gasto:', err)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col">
      {/* Barra de Contexto Fixa no Topo */}
      <ContextoMensalBar
        year={year}
        month={month}
        totalCompartilhado={rateioCalculado.totalCompartilhado}
        parteGiovana={rateioCalculado.parteGiovana}
        parteRodrigo={rateioCalculado.parteRodrigo}
        giovanaDevePagar={rateioCalculado.giovanaDevePagar}
        onMonthChange={handleMonthChange}
        currentTab="lancamentos"
      />

      {/* Conteúdo Principal */}
      <main className="max-w-4xl w-full mx-auto p-4 flex flex-col gap-5">
        {/* Linha de Adição Rápida */}
        <QuickAddRow
          distinctCategorias={distinctCategorias}
          topCategorias={topCategorias}
          usuarioId={usuarioId}
          onSaveSuccess={handleAddSuccess}
          year={year}
          month={month}
        />

        {/* Lista de Gastos */}
        <GastoList 
          gastos={gastos} 
          onDelete={handleDeleteTrigger}
          onRepeat={handleRepeat}
          onEdit={handleEdit}
          filtroCategoria={filtroCategoria}
        />
      </main>

      {/* Toast para desfazer exclusão */}
      <UndoToast
        visible={showToast}
        message="Lançamento excluído."
        onUndo={handleUndoDelete}
        onDismiss={handleConfirmDelete}
      />
    </div>
  )
}
