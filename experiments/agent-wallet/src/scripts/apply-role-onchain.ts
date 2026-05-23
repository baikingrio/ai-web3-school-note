/**
 * Broadcast roles:plan calldata on Sepolia.
 * Requires OWNER_PRIVATE_KEY (Safe 1-of-1 owner) and Roles mod owner = Safe.
 *
 * Usage:
 *   npm run roles:apply              # all planned calls
 *   npm run roles:apply -- --from 2  # Call 2 & 3 only (skip assignRoles)
 *   npm run roles:apply -- --dry     # simulate Safe exec only
 */
import '../../roles/agent_payer/eth-sdk-prime.js'
import { encodeKey, planApplyRole, rolesAbi } from 'zodiac-roles-sdk'
import {
  createPublicClient,
  createWalletClient,
  http,
  type Address,
  type Hex,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'
import { loadAppConfig, loadOwnerEnv } from '../config.js'
import { buildMembers } from '../../roles/agent_payer/members.js'
import { buildTargets } from '../../roles/agent_payer/permissions.js'
import { execViaSafe } from '../lib/safe-exec.js'

function parseArgs(argv: string[]) {
  const dry = argv.includes('--dry')
  const fromIdx = argv.findIndex((a) => a === '--from')
  const from = fromIdx >= 0 ? Number(argv[fromIdx + 1]) : 1
  return { dry, from: Number.isFinite(from) && from >= 1 ? from : 1 }
}

async function planCalls(app: ReturnType<typeof loadAppConfig>) {
  const roleKey = encodeKey(app.roleKey)
  const policyInputs = {
    tokenAddress: app.token.address,
    allowedRecipients: app.policy.allowedRecipients,
    maxPerTx: app.policy.maxPerTx,
    maxDaily: app.policy.maxDaily,
    tokenDecimals: app.token.decimals,
  }
  const calls = await planApplyRole(
    { key: roleKey, targets: buildTargets(policyInputs), members: buildMembers(app.agentAddress) },
    { chainId: app.chainId, address: app.rolesModAddress },
  )
  return calls ?? []
}

async function main() {
  const { dry, from } = parseArgs(process.argv.slice(2))

  const { rpcUrl, ownerPrivateKey: ownerKey } = loadOwnerEnv()

  const app = loadAppConfig()
  const account = privateKeyToAccount(ownerKey)
  const publicClient = createPublicClient({ chain: sepolia, transport: http(rpcUrl) })
  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(rpcUrl),
  })

  const rolesOwner = (await publicClient.readContract({
    address: app.rolesModAddress,
    abi: rolesAbi,
    functionName: 'owner',
  })) as Address

  const calls = await planCalls(app)
  if (calls.length === 0) {
    console.log('No changes needed — role already matches desired state.')
    return
  }

  const selected = calls.slice(from - 1)
  if (selected.length === 0) {
    throw new Error(`--from ${from} is past end (${calls.length} calls planned)`)
  }

  console.log(`Roles mod owner: ${rolesOwner}`)
  console.log(`Safe:            ${app.safeAddress}`)
  console.log(`Signer:          ${account.address}`)
  console.log(`Executing calls ${from}–${from + selected.length - 1} of ${calls.length}${dry ? ' (dry-run)' : ''}\n`)

  if (rolesOwner.toLowerCase() !== app.safeAddress.toLowerCase()) {
    if (rolesOwner.toLowerCase() === account.address.toLowerCase()) {
      console.log('[mode] Roles owner is signer EOA — sending directly to Roles mod')
      for (let i = 0; i < selected.length; i++) {
        const call = selected[i]
        const label = from + i
        console.log(`--- Call ${label} → ${call.to} ---`)
        if (dry) {
          await publicClient.call({
            account,
            to: call.to,
            data: call.data,
          })
          console.log('[simulated] ok\n')
          continue
        }
        const hash = await walletClient.sendTransaction({
          to: call.to,
          data: call.data,
          value: 0n,
        })
        await publicClient.waitForTransactionReceipt({ hash })
        console.log(`https://sepolia.etherscan.io/tx/${hash}\n`)
      }
      return
    }
    throw new Error(
      `Roles mod owner is ${rolesOwner}, not Safe ${app.safeAddress} or signer ${account.address}. Use Safe UI.`,
    )
  }

  for (let i = 0; i < selected.length; i++) {
    const call = selected[i]
    const label = from + i
    console.log(`--- Call ${label} (Safe → ${call.to}) ---`)
    if (dry) {
      console.log(`data: ${call.data}`)
      console.log('[dry] skipped broadcast\n')
      continue
    }
    const hash = await execViaSafe({
      safeAddress: app.safeAddress,
      to: call.to as Address,
      data: call.data as Hex,
      ownerPrivateKey: ownerKey,
      rpcUrl,
    })
    console.log(`https://sepolia.etherscan.io/tx/${hash}\n`)
  }

  console.log('Done. Verify at https://roles.gnosisguild.org then: npm run demo:success')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
