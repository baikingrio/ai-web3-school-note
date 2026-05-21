import { getAllowanceModuleDeployment } from '@safe-global/safe-modules-deployments'

const CHAIN_ID = 11155111
const SEPOLIA_USDC = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'

const deployment = getAllowanceModuleDeployment({ network: String(CHAIN_ID) })
const moduleAddress = deployment?.networkAddresses[String(CHAIN_ID)]

console.log(`
AgentScoope Wallet — Sepolia setup reference
============================================
Chain ID:     ${CHAIN_ID}
Network:      sepolia

Allowance Module (v0.1.0):
  ${moduleAddress ?? '(not found)'}

Circle test USDC:
  ${SEPOLIA_USDC}

Next: follow SETUP.md, then cp config.example.json config.json
`)
