import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Criar usuários
  const senhaRodrigo = await bcrypt.hash('senha123', 10)
  const senhaGiovana = await bcrypt.hash('senha123', 10)

  const rodrigo = await prisma.usuario.upsert({
    where: { nome: 'Rodrigo' },
    update: {},
    create: {
      nome: 'Rodrigo',
      salario: 10000,
      senhaHash: senhaRodrigo
    }
  })

  const giovana = await prisma.usuario.upsert({
    where: { nome: 'Giovana' },
    update: {},
    create: {
      nome: 'Giovana',
      salario: 6000,
      senhaHash: senhaGiovana
    }
  })

  // Criar configuração inicial
  const totalSalario = 10000 + 6000
  const percentualRodrigo = (10000 / totalSalario) * 100
  const percentualGiovana = (6000 / totalSalario) * 100

  await prisma.configuracao.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      percentualRodrigo: percentualRodrigo,
      percentualGiovana: percentualGiovana
    }
  })

  console.log('Seed inicial criado com sucesso!')
  console.log('Usuários:', { rodrigo, giovana })
  console.log('Configuração:', { percentualRodrigo, percentualGiovana })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })