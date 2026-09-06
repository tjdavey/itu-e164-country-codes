// Turns the ESM tsc output in dist/.esm into the flat .mjs/.d.mts layout that
// package.json's "import" condition points at, then removes the staging dir.
//
// tsc emits extensionless relative specifiers, which are invalid in real ESM
// once the files are renamed, so every relative specifier gains an .mjs
// extension. TypeScript resolves a ./x.mjs specifier to ./x.d.mts, so the same
// rewrite is correct for both the JavaScript and the declaration files.
import { readdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { join, extname } from 'node:path'

const STAGING = 'dist/.esm'
const OUT = 'dist'

const RELATIVE_SPECIFIER = /(\bfrom\s*|\bimport\s*\(\s*)(['"])(\.\.?\/[^'"]*)\2/g

function addExtensions (code) {
  return code.replace(RELATIVE_SPECIFIER, (match, keyword, quote, specifier) => {
    if (extname(specifier) !== '') return match
    return `${keyword}${quote}${specifier}.mjs${quote}`
  })
}

function outputNameFor (file) {
  if (file.endsWith('.d.ts')) return file.replace(/\.d\.ts$/, '.d.mts')
  if (file.endsWith('.js')) return file.replace(/\.js$/, '.mjs')
  return null
}

function convert (dir, relative = '') {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const source = join(dir, entry.name)
    if (entry.isDirectory()) {
      convert(source, join(relative, entry.name))
      continue
    }
    const outputName = outputNameFor(entry.name)
    if (outputName === null) continue
    const contents = addExtensions(readFileSync(source, 'utf8'))
    writeFileSync(join(OUT, relative, outputName), contents)
  }
}

convert(STAGING)
rmSync(STAGING, { recursive: true, force: true })
