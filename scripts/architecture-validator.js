#!/usr/bin/env node

/**
 * Architecture Validator for CasalTOP
 * 
 * This script validates that the project structure follows the established
 * architecture patterns and prevents regression.
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_DOMAIN_FOLDERS = [
  'actions',
  'components', 
  'repositories',
  'services',
  'types',
  'validations',
  'utils',
  'index.ts'
];

const DOMAINS_PATH = path.join(process.cwd(), 'src', 'domains');
const SHARED_PATH = path.join(process.cwd(), 'src', 'shared');

const errors = [];

function validateDomainStructure(domainPath, domainName) {
  const existingFolders = fs.readdirSync(domainPath);
  
  // Check for required folders
  for (const required of REQUIRED_DOMAIN_FOLDERS) {
    if (required === 'index.ts') {
      if (!existingFolders.includes('index.ts')) {
        errors.push({
          type: 'error',
          domain: domainName,
          message: `Missing index.ts file`
        });
      }
    } else if (!existingFolders.includes(required)) {
      errors.push({
        type: 'warning',
        domain: domainName,
        message: `Missing folder: ${required}`
      });
    }
  }

  // Check for unexpected folders
  const allowedFolders = [...REQUIRED_DOMAIN_FOLDERS];
  for (const folder of existingFolders) {
    if (!allowedFolders.includes(folder)) {
      errors.push({
        type: 'error',
        domain: domainName,
        message: `Unexpected folder/file: ${folder}`
      });
    }
  }

  // Validate index.ts exports
  const indexPath = path.join(domainPath, 'index.ts');
  if (fs.existsSync(indexPath)) {
    const indexContent = fs.readFileSync(indexPath, 'utf-8');
    
    // Skip validation for placeholder domains
    if (indexContent.includes('Placeholder') || indexContent.includes('TODO')) {
      return;
    }
    
    // Domains that don't need validations (read-only domains)
    const noValidationDomains = ['dashboard', 'reports'];
    
    const requiredExports = [
      'types',
      ...(!noValidationDomains.includes(domainName) ? ['validations'] : []),
      'Service',
      'Repository',
      'actions'
    ];

    for (const required of requiredExports) {
      if (!indexContent.includes(required)) {
        errors.push({
          type: 'warning',
          domain: domainName,
          message: `index.ts should export ${required}`
        });
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
  ];

  if (!fs.existsSync(SHARED_PATH)) {
    errors.push({
      type: 'error',
      domain: 'shared',
      message: 'Shared folder does not exist'
    });
    return;
  }

  const existingFolders = fs.readdirSync(SHARED_PATH);
  
  for (const required of requiredSharedFolders) {
    if (!existingFolders.includes(required)) {
      errors.push({
        type: 'warning',
        domain: 'shared',
        message: `Missing folder: ${required}`
      });
    }
  }
}

function validateNoBusinessLogicInComponents() {
  if (!fs.existsSync(DOMAINS_PATH)) return;
  
  const domains = fs.readdirSync(DOMAINS_PATH);
  
  for (const domain of domains) {
    const componentsPath = path.join(DOMAINS_PATH, domain, 'components');
    if (!fs.existsSync(componentsPath)) continue;
    
    const componentFiles = fs.readdirSync(componentsPath).filter(f => f.endsWith('.tsx'));
    
    for (const file of componentFiles) {
      const filePath = path.join(componentsPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Check for direct Prisma imports (should only be in repositories)
      if (content.includes('@prisma/client') && content.includes('import')) {
        errors.push({
          type: 'error',
          domain: domain,
          message: `Component ${file} should not import Prisma directly`
        });
      }
      
      // Check for repository imports (should use services/actions)
      if (content.includes('Repository') && content.includes('import')) {
        errors.push({
          type: 'error',
          domain: domain,
          message: `Component ${file} should not import repositories directly`
        });
      }
    }
  }
}

function validateServerActions() {
  if (!fs.existsSync(DOMAINS_PATH)) return;
  
  const domains = fs.readdirSync(DOMAINS_PATH);
  
  for (const domain of domains) {
    const actionsPath = path.join(DOMAINS_PATH, domain, 'actions');
    if (!fs.existsSync(actionsPath)) continue;
    
    const actionsFiles = fs.readdirSync(actionsPath).filter(f => f.endsWith('.ts'));
    
    for (const file of actionsFiles) {
      const filePath = path.join(actionsPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Check for 'use server' directive
      if (!content.includes("'use server'")) {
        errors.push({
          type: 'error',
          domain: domain,
          message: `Actions file ${file} must have 'use server' directive`
        });
      }
      
      // Check for revalidatePath usage
      if (content.includes('await') && !content.includes('revalidatePath')) {
        errors.push({
          type: 'warning',
          domain: domain,
          message: `Actions in ${file} should use revalidatePath after mutations`
        });
      }
    }
  }
}

function main() {
  console.log('🔍 Validating CasalTOP Architecture...\n');
  
  // Validate domains structure
  if (fs.existsSync(DOMAINS_PATH)) {
    const domains = fs.readdirSync(DOMAINS_PATH);
    
    for (const domain of domains) {
      const domainPath = path.join(DOMAINS_PATH, domain);
      if (fs.existsSync(path.join(domainPath, 'index.ts'))) {
        validateDomainStructure(domainPath, domain);
      }
    }
  } else {
    errors.push({
      type: 'error',
      domain: 'root',
      message: 'Domains folder does not exist'
    });
  }
  
  // Validate shared structure
  validateSharedStructure();
  
  // Validate architectural patterns
  validateNoBusinessLogicInComponents();
  validateServerActions();
  
  // Report results
  const errorCount = errors.filter(e => e.type === 'error').length;
  const warningCount = errors.filter(e => e.type === 'warning').length;
  
  if (errors.length === 0) {
    console.log('✅ Architecture validation passed!');
    process.exit(0);
  } else {
    console.log(`❌ Found ${errorCount} errors and ${warningCount} warnings:\n`);
    
    for (const error of errors) {
      const icon = error.type === 'error' ? '❌' : '⚠️';
      console.log(`${icon} [${error.domain}] ${error.message}`);
    }
    
    if (errorCount > 0) {
      console.log(`\n❌ Architecture validation failed with ${errorCount} errors`);
      process.exit(1);
    } else {
      console.log(`\n⚠️ Architecture validation passed with ${warningCount} warnings`);
      process.exit(0);
    }
  }
}

main();