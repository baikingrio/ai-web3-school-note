const CHAIN_ID = 11155111
const SEPOLIA_USDC = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'

console.log(`
AgentScoope Wallet — Sepolia setup reference (Zodiac Roles)
============================================================
Chain ID:     ${CHAIN_ID}
Network:      sepolia
Execution:    zodiac_roles (execTransactionWithRole)

Circle test USDC:
  ${SEPOLIA_USDC}

Roles Modifier:
  Deploy: Safe UI → Apps → Zodiac → Roles Modifier (NOT on roles.gnosisguild.org)
  View/manage: https://roles.gnosisguild.org (View instance → sep:0xYourInstance)
  ⚠️  Do NOT use global factory 0x9646… as rolesModAddress.

Next steps:
  1. SETUP.md — deploy Roles, enableModule, disable Allowance (optional)
  2. cp config.example.json config.json — fill safeAddress, agentAddress, rolesModAddress
  3. npm run roles:setup && npm run roles:plan — Owner executes printed calldata
  4. npm run demo:success
`)
