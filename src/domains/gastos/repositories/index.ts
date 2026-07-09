import { prisma } from '@/lib/prisma'
import { Gasto, CreateGastoInput, UpdateGastoInput } from '../types'

export class GastoRepository {
  async findAll(): Promise<Gasto[]> {
    const gastos = await prisma.gasto.findMany({
      include: {
        usuario: true
      },
      orderBy: { data: 'desc' }
    })
    
    return gastos.map(gasto => ({
      ...gasto,
      valor: Number(gasto.valor)
    }))
  }

  async findById(id: string): Promise<Gasto | null> {
    const gasto = await prisma.gasto.findUnique({
      where: { id },
      include: {
        usuario: true
      }
    })
    
    if (!gasto) return null
    
    return {
      ...gasto,
      valor: Number(gasto.valor)
    }
  }

  async findByMonth(year: number, month: number): Promise<Gasto[]> {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)
    
    const gastos = await prisma.gasto.findMany({
      where: {
        data: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        usuario: true
      },
      orderBy: { data: 'desc' }
    })
    
    return gastos.map(gasto => ({
      ...gasto,
      valor: Number(gasto.valor)
    }))
  }

  async getDistinctCategorias(): Promise<string[]> {
    const categorias = await prisma.gasto.findMany({
      select: { categoria: true },
      distinct: ['categoria'],
      orderBy: { categoria: 'asc' }
    })
    
    return categorias.map(c => c.categoria)
  }

  async create(data: CreateGastoInput): Promise<Gasto> {
    const gasto = await prisma.gasto.create({
      data,
      include: {
        usuario: true
      }
    })
    
    return {
      ...gasto,
      valor: Number(gasto.valor)
    }
  }

  async update(id: string, data: UpdateGastoInput): Promise<Gasto> {
    const gasto = await prisma.gasto.update({
      where: { id },
      data,
      include: {
        usuario: true
      }
    })
    
    return {
      ...gasto,
      valor: Number(gasto.valor)
    }
  }

  async delete(id: string): Promise<Gasto> {
    const gasto = await prisma.gasto.delete({
      where: { id },
      include: {
        usuario: true
      }
    })
    
    return {
      ...gasto,
      valor: Number(gasto.valor)
    }
  }
}

export const gastoRepository = new GastoRepository()