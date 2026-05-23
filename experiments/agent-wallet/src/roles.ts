import {
  createPublicClient,
  createWalletClient,
  encodeFunctionData,
  erc20Abi,
  http,
  type Address,
  type Hash,
  type PublicClient,
  type WalletClient,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'
import { encodeKey, rolesAbi } from 'zodiac-roles-sdk'
import type { AppConfig, EnvConfig, RejectLayer } from './types.js'
import { toTokenUnits } from './policy.js'

export function createClients(env: EnvConfig) {
  const account = privateKeyToAccount(env.agentPrivateKey)
  const transport = http(env.rpcUrl)
  const publicClient = createPublicClient({
    chain: sepolia,
    transport,
  }) as PublicClient
  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport,
  }) as WalletClient
  return { publicClient, walletClient, account }
}

export interface TransferParams {
  to: Address
  amountHuman: string
}

export interface TransferResult {
  txHash?: Hash
  simulationSummary: string
}

export async function executeRolesTransfer(
  app: AppConfig,
  env: EnvConfig,
  params: TransferParams,
  options: { broadcast: boolean },
): Promise<TransferResult> {
  const { publicClient, walletClient, account } = createClients(env)

  if (account.address.toLowerCase() !== app.agentAddress.toLowerCase()) {
    throw new Error(
      `AGENT_PRIVATE_KEY address ${account.address} does not match config agentAddress ${app.agentAddress}`,
    )
  }

  const amount = toTokenUnits(params.amountHuman, app.token.decimals)
  const data = encodeFunctionData({
    abi: erc20Abi,
    functionName: 'transfer',
    args: [params.to, amount],
  })

  const roleKey = encodeKey(app.roleKey)
  const rolesMod = app.rolesModAddress

  const simulationSummary = [
    `[Simulation] Transfer ${params.amountHuman} ${app.token.symbol}`,
    `via Zodiac Roles (${app.roleKey})`,
    `from Safe ${app.safeAddress}`,
    `to ${params.to}.`,
  ].join(' ')

  const { request } = await publicClient.simulateContract({
    address: rolesMod,
    abi: rolesAbi,
    functionName: 'execTransactionWithRole',
    args: [app.token.address, 0n, data, 0, roleKey, true],
    account,
  })

  if (!options.broadcast || env.dryRun) {
    return { simulationSummary }
  }

  const txHash = await walletClient.writeContract(request)
  await publicClient.waitForTransactionReceipt({ hash: txHash })

  return { txHash, simulationSummary }
}

/** Map viem/Roles revert to audit reason and layer. */
export function mapRolesError(err: unknown): { reason: string; layer: RejectLayer } {
  const msg = err instanceof Error ? err.message : String(err)
  const detailsMatch = msg.match(/Details:\s*([^\n]+)/i)
  const revertLine = detailsMatch?.[1] ?? msg
  const haystack = `${revertLine} ${msg}`.toLowerCase()

  const conditionStatus = msg.match(
    /ConditionViolation\([^)]*\)\s*\((\d+),/i,
  )?.[1]
  if (conditionStatus !== undefined) {
    const status = Number(conditionStatus)
    // PermissionChecker.Status (zodiac-modifier-roles)
    if (status === 2) {
      return { reason: 'target_not_allowed', layer: 'zodiac_roles' }
    }
    if (status === 3) {
      return { reason: 'function_not_allowed', layer: 'zodiac_roles' }
    }
    if (status === 7) {
      return { reason: 'transfer_to_unlisted_address', layer: 'zodiac_roles' }
    }
    if (status === 9) {
      return { reason: 'exceeds_allowance', layer: 'zodiac_roles' }
    }
    return { reason: 'condition_violation', layer: 'zodiac_roles' }
  }

  if (
    /transferto unlisted|transfer_to_unlisted|unlisted_address|not allowed.*recipient|conditionnotmet|condition not met/i.test(
      haystack,
    )
  ) {
    return { reason: 'transfer_to_unlisted_address', layer: 'zodiac_roles' }
  }

  if (
    /withinallowance|within allowance|exceed.*allowance|insufficient allowance|allowance exceeded|notenoughallowance/i.test(
      haystack,
    )
  ) {
    return { reason: 'exceeds_allowance', layer: 'zodiac_roles' }
  }

  if (
    /notauthorized|not authorized|nomembership|no membership|not a member|not member/i.test(
      haystack,
    )
  ) {
    return { reason: 'role_revoked', layer: 'zodiac_roles' }
  }

  if (/role revoked|member.*revoked/i.test(haystack)) {
    return { reason: 'role_revoked', layer: 'zodiac_roles' }
  }

  if (/module is not enabled|not enabled module/i.test(haystack)) {
    return { reason: 'module_not_enabled', layer: 'zodiac_roles' }
  }

  return { reason: 'chain_execution_failed', layer: 'unknown' }
}

export function extractRevertDetail(err: unknown): string | undefined {
  const msg = err instanceof Error ? err.message : String(err)
  const named = msg.match(/Error:\s*([A-Za-z0-9_]+)\([^)]*\)/)
  if (named) return named[0]
  const m =
    msg.match(/Details:\s*([^\n]+)/i) ??
    msg.match(/reverted with the following reason:\s*\n\s*([^\n]+)/i)
  return m?.[1]?.trim()
}
