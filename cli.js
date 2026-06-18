#!/usr/bin/env node

import fse from 'fs-extra'
import { resolve, dirname, relative } from 'path'
import { fileURLToPath } from 'url'

const { copy, pathExists, readJSON, writeJSON, readFile, writeFile } = fse

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
  console.log('  pnpx create-minimalize-template <nombre-proyecto>')
  console.log('')
  console.log('📋 Ejemplos:')
  console.log('  pnpx create-minimalize-template mi-app')
  console.log('  pnpx create-minimalize-template my-awesome-project')
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

    // Copiar template (excluyendo artefactos locales que romperían el proyecto)
    await copy(templateDir, targetDir, {
      filter: (src) => {
        const rel = relative(templateDir, src)
        return !/(^|[\\/])(node_modules|dist|dev-dist)([\\/]|$)/.test(rel)
      },
    })

    // Renombrar gitignore -> .gitignore (npm elimina los .gitignore al publicar)
    const gitignoreSrc = resolve(targetDir, 'gitignore')
    if (await pathExists(gitignoreSrc)) {
      await fse.move(gitignoreSrc, resolve(targetDir, '.gitignore'))
    }

    // Actualizar nombre del package.json con el nombre del proyecto
    const targetPackageJsonPath = resolve(targetDir, 'package.json')
    const targetPackageJson = await readJSON(targetPackageJsonPath)
    targetPackageJson.name = projectName
    await fse.writeJSON(targetPackageJsonPath, targetPackageJson, { spaces: 2 })

    // Actualizar el <title> de index.html con el nombre del proyecto
    const targetIndexHtmlPath = resolve(targetDir, 'index.html')
    const targetIndexHtml = await readFile(targetIndexHtmlPath, 'utf-8')
    await writeFile(
      targetIndexHtmlPath,
      targetIndexHtml.replace(
        '<title>minimalize-template</title>',
        `<title>${projectName}</title>`,
      ),
    )

    console.log('✅ ¡Proyecto creado exitosamente!')
    console.log('')
    console.log('🚀 Próximos pasos:')
    console.log('')
    console.log(`   cd ${projectName}`)
    console.log('   pnpm install')
    console.log('   pnpm dev')
    console.log('')
    console.log('📚 Stack incluido:')
    console.log('   • React 19 + TypeScript')
    console.log('   • Vite 7 (build tool)')
    console.log('   • Tailwind CSS v4')
    console.log('   • React Router v6 (loaders, actions, guards)')
    console.log('   • Zustand (state management + persist)')
    console.log('   • PWA (vite-plugin-pwa) — instalable + offline')
    console.log('   • ESLint configurado')
    console.log('')
    console.log('💡 Comandos disponibles:')
    console.log('   pnpm dev         → Servidor de desarrollo')
    console.log('   pnpm build       → Build de producción')
    console.log('   pnpm preview     → Preview del build')
    console.log('   pnpm lint        → Ejecutar linter')
    console.log('')
    console.log('¡Happy coding! 🎉')
    console.log('')
  } catch (err) {
    console.error('')
    console.error('❌ Error al crear el proyecto:')
    console.error('   ', err.message)
    console.error('')
    console.error('💡 Si el problema persiste, reporta el error en:')
    console.error(
      '   https://github.com/yourusername/minimalize-template-cli/issues',
    )
    process.exit(1)
  }
})()
