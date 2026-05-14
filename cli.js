#!/usr/bin/env node

import fse from 'fs-extra'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const { copy, pathExists, readJSON, writeJSON } = fse

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Leer versión dinámicamente desde package.json
const packageJson = await readJSON(resolve(__dirname, 'package.json'))
const VERSION = packageJson.version

// Banner
console.log(`
╔══════════════════════════════════════════════╗
║  🚀 Create Minimalize Template v${VERSION}       ║
║  React + Vite + TypeScript + Tailwind       ║
╚══════════════════════════════════════════════╝
`)

// Parse argumentos
const args = process.argv.slice(2)
const projectName = args[0]

// Mostrar ayuda
if (!projectName || projectName === '-h' || projectName === '--help') {
  console.log('📖 Uso:')
  console.log('  npx create-minimalize-template <nombre-proyecto>')
  console.log('')
  console.log('📋 Ejemplos:')
  console.log('  npx create-minimalize-template mi-app')
  console.log('  npx create-minimalize-template my-awesome-project')
  console.log('')
  console.log('🔗 Más info:')
  console.log('  https://github.com/yourusername/minimalize-template-cli')
  process.exit(projectName ? 0 : 1)
}

// Mostrar versión
if (projectName === '-v' || projectName === '--version') {
  console.log(VERSION)
  process.exit(0)
}

// Validar nombre de proyecto
if (!/^[a-z0-9-_]+$/i.test(projectName)) {
  console.error('❌ Nombre de proyecto inválido.')
  console.error('   Usa solo letras, números, guiones y guiones bajos.')
  console.error('')
  console.error('   Ejemplos válidos: mi-app, my_project, app123')
  process.exit(1)
}

const targetDir = resolve(process.cwd(), projectName)
const templateDir = resolve(__dirname, 'template')

// Verificar que el directorio no existe
;(async () => {
  try {
    const exists = await pathExists(targetDir)
    if (exists) {
      console.error(`❌ El directorio "${projectName}" ya existe.`)
      console.error('   Elige otro nombre o elimina el directorio existente.')
      process.exit(1)
    }

    // Verificar que el template existe
    const templateExists = await pathExists(templateDir)
    if (!templateExists) {
      console.error('❌ Error: Template no encontrado.')
      console.error('   Por favor reporta este error en GitHub.')
      process.exit(1)
    }

    console.log(`📦 Creando proyecto "${projectName}"...`)
    console.log('')

    // Copiar template
    await copy(templateDir, targetDir)

    // Actualizar nombre del package.json con el nombre del proyecto
    const targetPackageJsonPath = resolve(targetDir, 'package.json')
    const targetPackageJson = await readJSON(targetPackageJsonPath)
    targetPackageJson.name = projectName
    await fse.writeJSON(targetPackageJsonPath, targetPackageJson, { spaces: 2 })

    console.log('✅ ¡Proyecto creado exitosamente!')
    console.log('')
    console.log('🚀 Próximos pasos:')
    console.log('')
    console.log(`   cd ${projectName}`)
    console.log('   npm install')
    console.log('   npm run dev')
    console.log('')
    console.log('📚 Stack incluido:')
    console.log('   • React 19 + TypeScript')
    console.log('   • Vite 7 (build tool)')
    console.log('   • Tailwind CSS v4')
    console.log('   • Wouter (router)')
    console.log('   • Zustand (state management)')
    console.log('   • ESLint configurado')
    console.log('')
    console.log('💡 Comandos disponibles:')
    console.log('   npm run dev      → Servidor de desarrollo')
    console.log('   npm run build    → Build de producción')
    console.log('   npm run preview  → Preview del build')
    console.log('   npm run lint     → Ejecutar linter')
    console.log('')
    console.log('¡Happy coding! 🎉')
    console.log('')
  } catch (err) {
    console.error('')
    console.error('❌ Error al crear el proyecto:')
    console.error('   ', err.message)
    console.error('')
    console.error('💡 Si el problema persiste, reporta el error en:')
    console.error('   https://github.com/yourusername/minimalize-template-cli/issues')
    process.exit(1)
  }
})()
