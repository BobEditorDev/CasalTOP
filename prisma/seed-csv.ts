import { PrismaClient, TipoPagamento } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

// Mapeamento flexível de tipos em português para o enum
function normalizarTipo(tipo: string): TipoPagamento | null {
  const normalizado = tipo
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

  const map: Record<string, TipoPagamento> = {
    'rodrigo paga': 'RODRIGO_PAGA',
    'giovana paga': 'GIOVANA_PAGA',
    'rodrigo pagou da giovana': 'RODRIGO_PAGOU_DA_GIOVANA',
    'rodrigo pagou giovana': 'RODRIGO_PAGOU_DA_GIOVANA',
    'pagou da giovana': 'RODRIGO_PAGOU_DA_GIOVANA',
    'giovana pagou do rodrigo': 'GIOVANA_PAGOU_DO_RODRIGO',
    'giovana pagou rodrigo': 'GIOVANA_PAGOU_DO_RODRIGO',
    'pagou do rodrigo': 'GIOVANA_PAGOU_DO_RODRIGO'
  }

  return map[normalizado] || null
}

function parseCSVLine(line: string): string[] {
  // Suporta campos entre aspas e vírgulas dentro de categoria
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  result.push(current.trim())
  return result
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

  if (linhas.length === 0) {
    console.log('Arquivo CSV vazio')
    return
  }

  // Detectar se a primeira linha é cabeçalho
  const primeiraLinha = linhas[0]
  const colunasPrimeira = parseCSVLine(primeiraLinha)
  const primeiroValor = colunasPrimeira[0].toLowerCase()
  const temCabecalho = ['data', 'date', 'dt'].some(termo => primeiroValor.includes(termo))

  const dadosCSV = temCabecalho ? linhas.slice(1) : linhas

  const usuarioRodrigo = await prisma.usuario.findUnique({
    where: { nome: 'Rodrigo' }
  })

  if (!usuarioRodrigo) {
    throw new Error('Usuário Rodrigo não encontrado. Execute o seed primeiro.')
  }

  let importados = 0
  let erros = 0
  const linhasComErro: string[] = []

  for (const linha of dadosCSV) {
    try {
      const [dataStr, categoria, tipoStr, valorStr] = parseCSVLine(linha)

      if (!dataStr || !categoria || !tipoStr || !valorStr) {
        console.warn(`Linha incompleta ignorada: ${linha}`)
        erros++
        linhasComErro.push(linha)
        continue
      }

      const tipoEnum = normalizarTipo(tipoStr)

      if (!tipoEnum) {
        console.warn(`Tipo não reconhecido: ${tipoStr}`)
        erros++
        linhasComErro.push(linha)
        continue
      }

      // Parse de data no formato YYYY-MM-DD sem fuso horário
      const [ano, mes, dia] = dataStr.split('-').map(Number)
      if (!ano || !mes || !dia) {
        console.warn(`Data inválida: ${dataStr}`)
        erros++
        linhasComErro.push(linha)
        continue
      }

      const data = new Date(ano, mes - 1, dia, 12, 0, 0)

      // Parse de valor: detecta formato brasileiro (1.500,00) ou americano (1500.00)
      let valorLimpo = valorStr.replace(/R\$/g, '').replace(/\s/g, '').trim()

      if (valorLimpo.includes(',')) {
        // Formato brasileiro: remove pontos de milhar e substitui vírgula por ponto
        valorLimpo = valorLimpo.replace(/\./g, '').replace(/,/g, '.')
      }

      const valor = Number(valorLimpo)

      if (isNaN(valor) || valor <= 0) {
        console.warn(`Valor inválido: ${valorStr}`)
        erros++
        linhasComErro.push(linha)
        continue
      }

      const categoriaLimpa = categoria
        .replace(/^"|"$/g, '')
        .trim()
        .replace(/^\(sem descrição\)$/i, 'Sem descrição')

      await prisma.gasto.create({
        data: {
          data,
          categoria: categoriaLimpa,
          tipo: tipoEnum,
          valor,
          usuarioId: usuarioRodrigo.id
        }
      })

      importados++
    } catch (error) {
      console.error(`Erro ao importar linha: ${linha}`, error)
      erros++
      linhasComErro.push(linha)
    }
  }

  console.log(`Importação concluída!`)
  console.log(`Importados: ${importados}`)
  console.log(`Erros: ${erros}`)

  if (linhasComErro.length > 0) {
    console.log('\nLinhas com erro:')
    linhasComErro.forEach(linha => console.log(`  - ${linha}`))
  }
}

importarCSV()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
