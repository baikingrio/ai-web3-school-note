import { getAllowanceModuleDeployment } from '@safe-global/safe-modules-deployments'
import {
  createPublicClient,
  createWalletClient,
  http,
  zeroAddress,
  type Address,
  type Hash,
  type PublicClient,
  type WalletClient,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'
import type { AllowanceState, EnvConfig, RejectLayer } from './types.js'
import type { AppConfig } from './types.js'
import { fromTokenUnits, toTokenUnits } from './policy.js'

export function getModuleDeployment(chainId: number) {
  const deployment = getAllowanceModuleDeployment({ network: String(chainId) })
  if (!deployment) {
    throw new Error(`Allowance module not deployed on chain ${chainId}`)
  }
  const address = deployment.networkAddresses[String(chainId)] as Address | undefined
  if (!address) {
    throw new Error(`Allowance module address missing for chain ${chainId}`)
  }
  return { address, abi: deployment.abi }
}

export function createClients(env: EnvConfig, chainId: number) {
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

export async function readAllowanceState(
  publicClient: PublicClient,
  app: AppConfig,
): Promise<AllowanceState> {
  const { address, abi } = getModuleDeployment(app.chainId)
  const raw = (await publicClient.readContract({
    address,
    abi,
    functionName: 'getTokenAllowance',
    args: [app.safeAddress, app.agentAddress, app.token.address],
  })) as readonly [bigint, bigint, bigint, bigint, bigint]

  return {
    amount: raw[0],
    spent: raw[1],
    resetTimeMin: raw[2],
    lastResetMin: raw[3],
    nonce: Number(raw[4]),
  }
}

export interface TransferParams {
  to: Address
  amountHuman: string
}

export interface TransferResult {
  txHash?: Hash
  simulationSummary: string
  allowance: AllowanceState
}

export async function executeAllowanceTransfer(
  app: AppConfig,
  env: EnvConfig,
  params: TransferParams,
  options: { broadcast: boolean },
): Promise<TransferResult> {
  const { publicClient, walletClient, account } = createClients(env, app.chainId)
  const { address: moduleAddress, abi } = getModuleDeployment(app.chainId)

  if (account.address.toLowerCase() !== app.agentAddress.toLowerCase()) {
    throw new Error(
      `AGENT_PRIVATE_KEY address ${account.address} does not match config agentAddress ${app.agentAddress}`,
    )
  }

  const amount = toTokenUnits(params.amountHuman, app.token.decimals)
  const allowance = await readAllowanceState(publicClient, app)

  const hash = (await publicClient.readContract({
    address: moduleAddress,
    abi,
    functionName: 'generateTransferHash',
    args: [
      app.safeAddress,
      app.token.address,
      params.to,
      amount,
      zeroAddress,
      0n,
      allowance.nonce,
    ],
  })) as Hash

  const signature = await account.sign({ hash })

  const { request } = await publicClient.simulateContract({
    address: moduleAddress,
    abi,
    functionName: 'executeAllowanceTransfer',
    args: [
      app.safeAddress,
      app.token.address,
      params.to,
      amount,
      zeroAddress,
      0n,
      app.agentAddress,
      signature,
    ],
    account,
  })

  const remaining = allowance.amount > allowance.spent ? allowance.amount - allowance.spent : 0n
  const simulationSummary = [
    `[Simulation] Transfer ${params.amountHuman} ${app.token.symbol}`,
    `from Safe ${app.safeAddress}`,
    `to ${params.to}`,
    `(whitelist OK).`,
    `On-chain allowance remaining ~${fromTokenUnits(remaining, app.token.decimals)} ${app.token.symbol},`,
    `nonce ${allowance.nonce}.`,
  ].join(' ')

  if (!options.broadcast || env.dryRun) {
    return { simulationSummary, allowance }
  }

  const txHash = await walletClient.writeContract(request)
  await publicClient.waitForTransactionReceipt({ hash: txHash })

  return { txHash, simulationSummary, allowance }
}

// cast sig "ErrorName()" — AgentScoopeModuleGuard custom errors
const GUARD_ERROR_SELECTORS: Record<string, string> = {
  d45f5e06: 'transfer_to_unlisted_address',
  '9c5bebca': 'policy_expired',
  '83f171d6': 'method_not_allowed',
}

/** Map viem/simulate revert to audit reason and layer. */
export function mapChainError(err: unknown): { reason: string; layer: RejectLayer } {
  const msg = err instanceof Error ? err.message : String(err)
  const detailsMatch = msg.match(/Details:\s*([^\n]+)/i)
  const revertLine = detailsMatch?.[1] ?? msg
  const haystack = `${revertLine} ${msg}`.toLowerCase()

  // Module Guard custom errors (human-readable revert data or error name)
  if (
    /transferto unlisted|transfer_to_unlisted|unlisted_address/i.test(haystack) ||
    haystack.includes('transfer to unlisted')
  ) {
    return { reason: 'transfer_to_unlisted_address', layer: 'module_guard' }
  }
  if (/policyexpired|policy_expired/i.test(haystack)) {
    return { reason: 'policy_expired', layer: 'module_guard' }
  }
  if (/methodnotallowed|method_not_allowed/i.test(haystack)) {
    return { reason: 'method_not_allowed', layer: 'module_guard' }
  }
  if (/tokennotallowed|token_not_allowed/i.test(haystack)) {
    return { reason: 'token_not_allowed', layer: 'module_guard' }
  }
  if (/onlyallowancemodule|only_allowance_module/i.test(haystack)) {
    return { reason: 'only_allowance_module', layer: 'module_guard' }
  }

  for (const [sel, reason] of Object.entries(GUARD_ERROR_SELECTORS)) {
    if (msg.includes(sel.slice(2))) {
      return { reason, layer: 'module_guard' }
    }
  }

  if (/newspent|new spent|exceed.*allowance|insufficient allowance/i.test(haystack)) {
    return { reason: 'exceeds_allowance', layer: 'allowance_module' }
  }
  if (
    /not a delegate|invalid delegate|delegate has been|delegate not|no delegate|delegates\[|is not an enabled delegate/i.test(
      haystack,
    )
  ) {
    return { reason: 'delegate_revoked', layer: 'allowance_module' }
  }
  if (/allowance|insufficient/i.test(haystack)) {
    return { reason: 'exceeds_allowance', layer: 'allowance_module' }
  }
  return { reason: 'chain_execution_failed', layer: 'unknown' }
}

export function extractRevertDetail(err: unknown): string | undefined {
  const msg = err instanceof Error ? err.message : String(err)
  const m = msg.match(/Details:\s*([^\n]+)/i) ?? msg.match(/reverted with the following reason:\s*\n\s*([^\n]+)/i)
  return m?.[1]?.trim()
}
