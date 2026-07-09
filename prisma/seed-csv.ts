import { PrismaClient, TipoPagamento } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

// Mapeamento de tipos em português para o enum
const mapeamentoTipo: Record<string, TipoPagamento> = {
  'Rodrigo Paga': 'RODRIGO_PAGA',
  'Giovana Paga': 'GIOVANA_PAGA',
  'Rodrigo Pagou da Giovana': 'RODRIGO_PAGOU_DA_GIOVANA',
  'Giovana Pagou do Rodrigo': 'GIOVANA_PAGOU_DO_RODRIGO',
  // Adicione outras variações conforme necessário
}

async function importarCSV() {
  // Caminho para o arquivo CSV
  const csvPath = path.join(process.cwd(), 'dados-planilha.csv')
  
  if (!fs.existsSync(csvPath)) {
    console.log('Arquivo CSV não encontrado:', csvPath)
    console.log('Crie o arquivo dados-planilha.csv com formato: data,categoria,tipo,valor')
    console.log('Exemplo: 2024-01-15,Supermercado,Rodrigo Paga,150.50')
    return
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  const linhas = csvContent.split('\n').filter(line => line.trim())
  
  // Pular cabeçalho se existir
  const dadosCSV = linhas.slice(1).map(linha => {
    const [data, categoria, tipo, valor] = linha.split(',').map(item => item.trim())
    return { data, categoria, tipo, valor }
  })

  const usuarioRodrigo = await prisma.usuario.findUnique({
    where: { nome: 'Rodrigo' }
  })

  if (!usuarioRodrigo) {
    throw new Error('Usuário Rodrigo não encontrado. Execute o seed primeiro.')
  }

  let importados = 0
  let erros = 0

  for (const linha of dadosCSV) {
    try {
      const tipoEnum = mapeamentoTipo[linha.tipo]
      
      if (!tipoEnum) {
        console.warn(`Tipo não reconhecido: ${linha.tipo}`)
        erros++
        continue
      }

      await prisma.gasto.create({
        data: {
          data: new Date(linha.data),
          categoria: linha.categoria,
          tipo: tipoEnum,
          valor: parseFloat(linha.valor),
          usuarioId: usuarioRodrigo.id
        }
      })

      importados++
    } catch (error) {
      console.error(`Erro ao importar linha: ${linha}`, error)
      erros++
    }
  }

  console.log(`Importação concluída!`)
  console.log(`Importados: ${importados}`)
  console.log(`Erros: ${erros}`)
}

importarCSV()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })