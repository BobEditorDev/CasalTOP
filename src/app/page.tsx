import { redirect } from 'next/navigation'
import { getSessaoUsuario } from '@/domains/auth/actions'
import { getMonthSummary, getDistinctCategorias, getTopCategorias } from '@/domains/gastos/actions'
import { GastoDashboardClient } from '@/domains/gastos/components/GastoDashboardClient'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Home({ searchParams }: PageProps) {
  const usuario = await getSessaoUsuario()
  if (!usuario) {
    redirect('/login')
  }

  const resolvedSearchParams = await searchParams
  const mesParam = resolvedSearchParams.mes as string | undefined
  const categoriaParam = resolvedSearchParams.categoria as string | undefined
  
  let year = new Date().getFullYear()
  let month = new Date().getMonth() + 1

  if (mesParam && /^\d{4}-\d{2}$/.test(mesParam)) {
    const [y, m] = mesParam.split('-').map(Number)
    year = y
    month = m
  }

  // Carregar os dados de forma paralela
  const [summary, distinctCategorias, topCategorias] = await Promise.all([
    getMonthSummary(year, month),
    getDistinctCategorias(),
    getTopCategorias(year, month)
  ])

  return (
    <GastoDashboardClient
      initialGastos={summary.gastos}
      rateio={summary.rateio}
      distinctCategorias={distinctCategorias}
      topCategorias={topCategorias}
      usuarioId={usuario.id}
      percentualRodrigo={summary.percentualRodrigo}
      percentualGiovana={summary.percentualGiovana}
      filtroCategoria={categoriaParam}
    />
  )
}
