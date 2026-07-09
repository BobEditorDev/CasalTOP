#!/usr/bin/env node

/**
 * Architecture Validator
 * Validates minimal project structure for the finance app.
 */

const fs = require('fs')
const path = require('path')

const DOMAINS_PATH = path.join(process.cwd(), 'src', 'domains')

const errors = []

function validateDomainStructure(domainPath, domainName) {
  const existingFolders = fs.readdirSync(domainPath)

  if (!existingFolders.includes('index.ts')) {
    errors.push({
      type: 'error',
      domain: domainName,
      message: 'Missing index.ts file'
    })
  }

  if (!existingFolders.includes('repositories')) {
    errors.push({
      type: 'warning',
      domain: domainName,
      message: 'Missing folder: repositories'
    })
  }

  if (!existingFolders.includes('types')) {
    errors.push({
      type: 'warning',
      domain: domainName,
      message: 'Missing folder: types'
    })
  }
}

function main() {
  console.log('🔍 Validating Architecture...\n')

  if (!fs.existsSync(DOMAINS_PATH)) {
    errors.push({
      type: 'error',
      domain: 'root',
      message: 'Domains folder does not exist'
    })
  } else {
    const domains = fs.readdirSync(DOMAINS_PATH)

    for (const domain of domains) {
      const domainPath = path.join(DOMAINS_PATH, domain)
      if (fs.statSync(domainPath).isDirectory()) {
        validateDomainStructure(domainPath, domain)
      }
    }
  }

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
