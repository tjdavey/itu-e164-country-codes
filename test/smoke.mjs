/**
 * Smoke test for the built distributables in ./dist.
 *
 * The Jest suite runs against the TypeScript sources in ./src, so it cannot
 * catch packaging faults: a broken CommonJS interop, an ESM build whose
 * relative specifiers were never given their .mjs extensions, or an "exports"
 * map pointing at the wrong file. This exercises the published entry points
 * exactly as a consumer would.
 *
 * Run with `npm run test:dist` after `npm run build`.
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(here, '../dist')
const require = createRequire(import.meta.url)

const AUSTRALIA = { itu_country_code: 61, name: 'Australia', iso_country_code: 'AU' }
const AUSTRALIAN_EXTERNAL = {
  itu_country_code: 672,
  name: 'Australian External Territories',
  iso_country_code: 'AU'
}

/** Every entry point must behave identically, so they all run the same checks. */
function checkExports (mod, label) {
  assert.equal(typeof mod.fromITUCode, 'function', `${label}: fromITUCode is not exported`)
  assert.equal(typeof mod.fromISOCode, 'function', `${label}: fromISOCode is not exported`)

  assert.deepEqual(mod.fromITUCode(61), [AUSTRALIA], `${label}: fromITUCode(61)`)
  assert.deepEqual(mod.fromITUCode('61'), [AUSTRALIA], `${label}: fromITUCode('61')`)
  assert.equal(mod.fromITUCode(1).length, 25, `${label}: fromITUCode(1) shared-code count`)
  assert.deepEqual(mod.fromITUCode('bad'), [], `${label}: fromITUCode('bad')`)

  assert.deepEqual(
    mod.fromISOCode('au'),
    [AUSTRALIA, AUSTRALIAN_EXTERNAL],
    `${label}: fromISOCode('au')`
  )
  assert.deepEqual(mod.fromISOCode('ZZ'), [], `${label}: fromISOCode('ZZ')`)

  // The dataset is the bulk of the bundle; a truncated build still passes the
  // lookups above, so assert its full shape.
  const all = mod.fromITUCode(0).concat(mod.fromITUCode(999))
  assert.equal(all.length, 2, `${label}: reserved boundary entries missing`)

  console.log(`✓ ${label}`)
}

// 1. The built files directly.
checkExports(require(path.join(dist, 'index.js')), 'dist/index.js (CommonJS)')
checkExports(await import(pathToFileURL(path.join(dist, 'index.mjs'))), 'dist/index.mjs (ESM)')

// 2. Resolved through the "exports" map, the way a consumer reaches them.
//    Node self-references the package by name, so this validates the map
//    itself rather than a hardcoded path.
const NAME = 'itu-e164-country-codes'
checkExports(require(NAME), `require('${NAME}') via exports map`)
checkExports(await import(NAME), `import '${NAME}' via exports map`)

// 2b. Each condition must resolve to the build intended for it. Node can
//     require() an ES module, so a "require" condition wrongly pointing at
//     index.mjs still works here while breaking consumers on older Node.
//     Asserting the resolved target catches that regardless of Node version.
assert.equal(
  require.resolve(NAME),
  path.join(dist, 'index.js'),
  'the "require" condition does not resolve to the CommonJS build'
)
assert.equal(
  import.meta.resolve(NAME),
  pathToFileURL(path.join(dist, 'index.mjs')).href,
  'the "import" condition does not resolve to the ESM build'
)
console.log('✓ exports conditions resolve to the right builds')

// 3. The two builds must agree, not merely each be self-consistent.
assert.deepEqual(
  require(NAME).fromITUCode(1),
  (await import(NAME)).fromITUCode(1),
  'CommonJS and ESM builds returned different results'
)
console.log('✓ CommonJS and ESM builds agree')

// 4. Declarations ship alongside both builds.
for (const file of ['index.d.ts', 'index.d.mts', 'types.d.ts', 'types.d.mts']) {
  assert.ok(fs.existsSync(path.join(dist, file)), `dist/${file} is missing`)
}
assert.match(
  fs.readFileSync(path.join(dist, 'index.d.ts'), 'utf-8'),
  /export declare function fromITUCode/,
  'dist/index.d.ts does not declare fromITUCode'
)
console.log('✓ declaration files present')

// 5. The ESM build post-processing must have extended every relative specifier;
//    an extensionless one resolves at type-check time but fails at runtime.
for (const file of ['index.mjs', 'index.d.mts']) {
  const contents = fs.readFileSync(path.join(dist, file), 'utf-8')
  for (const [, specifier] of contents.matchAll(/from\s*['"](\.[^'"]*)['"]/g)) {
    assert.ok(
      specifier.endsWith('.mjs'),
      `dist/${file} has an unextended relative specifier: '${specifier}'`
    )
  }
}
console.log('✓ ESM specifiers carry .mjs extensions')

console.log('\nDistributable smoke test passed.')
