/**
 * Remove all members from agent_payer (planApplyRole with members: []).
 * Then run: npm run demo:after-revoke  (expect role_revoked / NotAuthorized)
 * Restore: npm run roles:apply
 */
import '../../roles/agent_payer/eth-sdk-prime.js'
import { encodeKey, planApplyRole } from 'zodiac-roles-sdk'
import { loadAppConfig, loadOwnerEnv } from '../config.js'
import { buildTargets } from '../../roles/agent_payer/permissions.js'
import { execViaSafe } from '../lib/safe-exec.js'

async function main() {
  const app = loadAppConfig()
  const { rpcUrl, ownerPrivateKey } = loadOwnerEnv()
  const policyInputs = {
    tokenAddress: app.token.address,
    allowedRecipients: app.policy.allowedRecipients,
    maxPerTx: app.policy.maxPerTx,
    maxDaily: app.policy.maxDaily,
    tokenDecimals: app.token.decimals,
  }

  const calls = await planApplyRole(
    { key: encodeKey(app.roleKey), targets: buildTargets(policyInputs), members: [] },
    { chainId: app.chainId, address: app.rolesModAddress },
  )

  if (!calls?.length) {
    console.log('No revoke calls — role may already have zero members.')
    return
  }

  console.log(`Revoking members on role "${app.roleKey}" (${calls.length} Safe tx)…`)
  for (let i = 0; i < calls.length; i++) {
    const hash = await execViaSafe({
      safeAddress: app.safeAddress,
      to: calls[i].to as `0x${string}`,
      data: calls[i].data as `0x${string}`,
      ownerPrivateKey,
      rpcUrl,
    })
    console.log(`Call ${i + 1}: https://sepolia.etherscan.io/tx/${hash}`)
  }
  console.log('\nNow: npm run demo:after-revoke  (simulate, expect reject)')
  console.log('Restore agent: npm run roles:apply')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
