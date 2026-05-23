/**
 * eth-sdk writes to node_modules/.gnosisguild/eth-sdk-client but
 * zodiac-roles-sdk/kit imports @gnosis-guild/eth-sdk-client.
 * Fix ESM/CJS re-exports after every `npm run roles:setup`.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const stub = join(root, 'node_modules/@gnosis-guild/eth-sdk-client')

writeFileSync(
  join(stub, 'index.mjs'),
  "export * from '../../.gnosisguild/eth-sdk-client/esm/index.js'\n",
)
writeFileSync(
  join(stub, 'index.js'),
  "module.exports = require('../../.gnosisguild/eth-sdk-client/index.cjs')\n",
)

const pkgPath = join(stub, 'package.json')
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
pkg.exports = {
  '.': {
    import: './index.mjs',
    require: './index.js',
  },
}
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)

console.log('[roles:setup] synced @gnosis-guild/eth-sdk-client → .gnosisguild/eth-sdk-client')
