import '../../roles/agent_payer/eth-sdk-prime.js'
import { encodeKey, planApplyRole } from 'zodiac-roles-sdk'
import { loadAppConfig } from '../config.js'
import { buildMembers } from '../../roles/agent_payer/members.js'
import { buildTargets } from '../../roles/agent_payer/permissions.js'

async function main() {
  const app = loadAppConfig()
  const roleKey = encodeKey(app.roleKey)

  if (
    !app.rolesModAddress ||
    app.rolesModAddress === '0x0000000000000000000000000000000000000000'
  ) {
    throw new Error(
      'Set rolesModAddress in config.json to your per-Safe Roles Modifier instance (not the global factory address).',
    )
  }

  const policyInputs = {
    tokenAddress: app.token.address,
    allowedRecipients: app.policy.allowedRecipients,
    maxPerTx: app.policy.maxPerTx,
    maxDaily: app.policy.maxDaily,
    tokenDecimals: app.token.decimals,
  }
  const targets = buildTargets(policyInputs)
  const members = buildMembers(app.agentAddress)

  console.log(`Planning apply for role "${app.roleKey}" on Roles mod ${app.rolesModAddress}…`)

  // Allowances (withinAllowance) require Zodiac OS license — per-tx limit uses c.lte in permissions.
  const calls = await planApplyRole(
    { key: roleKey, targets, members },
    { chainId: app.chainId, address: app.rolesModAddress },
  )

  if (!calls || calls.length === 0) {
    console.log('No changes needed — role already matches desired state.')
    return
  }

  console.log(`\n${calls.length} transaction(s) for Safe owner to execute:\n`)
  calls.forEach((call, i) => {
    console.log(`--- Call ${i + 1} ---`)
    console.log(`to:   ${call.to}`)
    console.log(`data: ${call.data}`)
    console.log('')
  })

  console.log(
    'Execute each call from Safe Transaction Builder (to = rolesModAddress for role ops, or as printed).',
  )
  console.log('Verify at https://roles.gnosisguild.org after confirmation.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
