import { redirect } from 'next/navigation'
import { getSessaoUsuario } from '@/domains/auth/actions'
import { getGastos } from '@/domains/gastos/actions'
import { configuracaoRepository } from '@/domains/configuracao/repositories'
import { ResumoPageClient } from '@/domains/gastos/components/ResumoPageClient'

export default async function ResumoPage() {
  const usuario = await getSessaoUsuario()
  if (!usuario) {
    redirect('/login')
  }

  const gastos = await getGastos()
  const configuracao = await configuracaoRepository.get()

  const percentualRodrigo = configuracao?.percentualRodrigo || 62.5
  const percentualGiovana = configuracao?.percentualGiovana || 37.5

  return (
    <ResumoPageClient
      gastos={gastos}
      percentualRodrigo={percentualRodrigo}
      percentualGiovana={percentualGiovana}
    />
  )
}
