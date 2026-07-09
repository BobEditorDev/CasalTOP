#!/usr/bin/env tsx

/**
 * Architecture Validator for CasalTOP
 * 
 * This script validates that the project structure follows the established
 * architecture patterns and prevents regression.
 */

import { readdirSync, existsSync, readFileSync } from 'fs'
import { join } from 'path'

const REQUIRED_DOMAIN_FOLDERS = [
  'actions',
  'components', 
  'repositories',
  'services',
  'types',
  'validations',
  'utils',
  'index.ts'
]

const DOMAINS_PATH = join(process.cwd(), 'src', 'domains')
const SHARED_PATH = join(process.cwd(), 'src', 'shared')

interface ValidationError {
  type: 'error' | 'warning'
  domain: string
  message: string
}

const errors: ValidationError[] = []

function validateDomainStructure(domainPath: string, domainName: string) {
  const existingFolders = readdirSync(domainPath)
  
  // Check for required folders
  for (const required of REQUIRED_DOMAIN_FOLDERS) {
    if (required === 'index.ts') {
      if (!existingFolders.includes('index.ts')) {
        errors.push({
          type: 'error',
          domain: domainName,
          message: `Missing index.ts file`
        })
      }
    } else if (!existingFolders.includes(required)) {
      errors.push({
        type: 'warning',
        domain: domainName,
        message: `Missing folder: ${required}`
      })
    }
  }

  // Check for unexpected folders
  const allowedFolders = [...REQUIRED_DOMAIN_FOLDERS]
  for (const folder of existingFolders) {
    if (!allowedFolders.includes(folder)) {
      errors.push({
        type: 'error',
        domain: domainName,
        message: `Unexpected folder/file: ${folder}`
      })
    }
  }

  // Validate index.ts exports
  const indexPath = join(domainPath, 'index.ts')
  if (existsSync(indexPath)) {
    const indexContent = readFileSync(indexPath, 'utf-8')
    
    const requiredExports = [
      'types',
      'validations', 
      'Service',
      'Repository',
      'actions'
    ]

    for (const required of requiredExports) {
      if (!indexContent.includes(required)) {
        errors.push({
          type: 'warning',
          domain: domainName,
          message: `index.ts should export ${required}`
        })
      }
    }
  }
}

function validateSharedStructure() {
  const requiredSharedFolders = [
    'ui',
    'components',
    'lib',
    'hooks',
    'utils',
    'constants',
    'types'
  ]

  if (!existsSync(SHARED_PATH)) {
    errors.push({
      type: 'error',
      domain: 'shared',
      message: 'Shared folder does not exist'
    })
    return
  }

  const existingFolders = readdirSync(SHARED_PATH)
  
  for (const required of requiredSharedFolders) {
    if (!existingFolders.includes(required)) {
      errors.push({
        type: 'warning',
        domain: 'shared',
        message: `Missing folder: ${required}`
      })
    }
  }
}

function validateNoBusinessLogicInComponents() {
  // This is a simplified check - in reality, you'd want to parse the AST
  const domains = readdirSync(DOMAINS_PATH)
  
  for (const domain of domains) {
    const componentsPath = join(DOMAINS_PATH, domain, 'components')
    if (!existsSync(componentsPath)) continue
    
    const componentFiles = readdirSync(componentsPath).filter(f => f.endsWith('.tsx'))
    
    for (const file of componentFiles) {
      const filePath = join(componentsPath, file)
      const content = readFileSync(filePath, 'utf-8')
      
      // Check for direct Prisma imports (should only be in repositories)
      if (content.includes('@prisma/client') && content.includes('import')) {
        errors.push({
          type: 'error',
          domain: domain,
          message: `Component ${file} should not import Prisma directly`
        })
      }
      
      // Check for repository imports (should use services/actions)
      if (content.includes('Repository') && content.includes('import')) {
        errors.push({
          type: 'error',
          domain: domain,
          message: `Component ${file} should not import repositories directly`
        })
      }
    }
  }
}

function validateServerActions() {
  const domains = readdirSync(DOMAINS_PATH)
  
  for (const domain of domains) {
    const actionsPath = join(DOMAINS_PATH, domain, 'actions')
    if (!existsSync(actionsPath)) continue
    
    const actionsFiles = readdirSync(actionsPath).filter(f => f.endsWith('.ts'))
    
    for (const file of actionsFiles) {
      const filePath = join(actionsPath, file)
      const content = readFileSync(filePath, 'utf-8')
      
      // Check for 'use server' directive
      if (!content.includes("'use server'")) {
        errors.push({
          type: 'error',
          domain: domain,
          message: `Actions file ${file} must have 'use server' directive`
        })
      }
      
      // Check for revalidatePath usage
      if (content.includes('await') && !content.includes('revalidatePath')) {
        errors.push({
          type: 'warning',
          domain: domain,
          message: `Actions in ${file} should use revalidatePath after mutations`
        })
      }
    }
  }
}

function main() {
  console.log('🔍 Validating CasalTOP Architecture...\n')
  
  // Validate domains structure
  if (existsSync(DOMAINS_PATH)) {
    const domains = readdirSync(DOMAINS_PATH)
    
    for (const domain of domains) {
      const domainPath = join(DOMAINS_PATH, domain)
      if (existsSync(join(domainPath, 'index.ts'))) {
        validateDomainStructure(domainPath, domain)
      }
    }
  } else {
    errors.push({
      type: 'error',
      domain: 'root',
      message: 'Domains folder does not exist'
    })
  }
  
  // Validate shared structure
  validateSharedStructure()
  
  // Validate architectural patterns
  validateNoBusinessLogicInComponents()
  validateServerActions()
  
  // Report results
  const errorCount = errors.filter(e => e.type === 'error').length
  const warningCount = errors.filter(e => e.type === 'warning').length
  
  if (errors.length === 0) {
    console.log('✅ Architecture validation passed!')
    process.exit(0)
  } else {
    console.log(`❌ Found ${errorCount} errors and ${warningCount} warnings:\n`)
    
    for (const error of errors) {
      const icon = error.type === 'error' ? '❌' : '⚠️'
      console.log(`${icon} [${error.domain}] ${error.message}`)
    }
    
    if (errorCount > 0) {
      console.log(`\n❌ Architecture validation failed with ${errorCount} errors`)
      process.exit(1)
    } else {
      console.log(`\n⚠️ Architecture validation passed with ${warningCount} warnings`)
      process.exit(0)
    }
  }
}

main()