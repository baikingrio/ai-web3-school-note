import './eth-sdk-prime.js'
import { allow } from 'zodiac-roles-sdk/kit'
import {
  c,
  encodeKey,
  processPermissions,
  type Permission,
} from 'zodiac-roles-sdk'
import type { Address } from 'viem'
import { toTokenUnits } from '../../src/policy.js'

export const PER_TX_ALLOWANCE_KEY = encodeKey('agent_max_per_tx')
export const DAILY_ALLOWANCE_KEY = encodeKey('agent_max_daily_24h')

export interface PolicyInputs {
  tokenAddress: Address
  allowedRecipients: Address[]
  maxPerTx: string
  maxDaily: string
  tokenDecimals: number
}

function assertAllowKit() {
  if (!allow.sepolia?.usdc) {
    throw new Error(
      'allow.sepolia.usdc is missing. Run: npm run roles:setup (generates eth-sdk into node_modules/.gnosisguild/eth-sdk-client)',
    )
  }
}

/** Build Roles permissions aligned with config.policy. */
export function buildPermissions(policy: PolicyInputs): Permission[] {
  assertAllowKit()
  const maxPerTxWei = toTokenUnits(policy.maxPerTx, policy.tokenDecimals)
  const permissions: Permission[] = []

  for (const recipient of policy.allowedRecipients) {
    permissions.push(
      allow.sepolia.usdc.transfer(recipient, c.lte(maxPerTxWei)),
    )
  }

  return permissions
}

export function buildTargets(policy: PolicyInputs) {
  const permissions = buildPermissions(policy)
  return processPermissions(permissions).targets
}

export function buildAllowances(policy: PolicyInputs) {
  const maxPerTxWei = toTokenUnits(policy.maxPerTx, policy.tokenDecimals)
  const maxDailyWei = toTokenUnits(policy.maxDaily, policy.tokenDecimals)
  const daySeconds = 86_400n

  return [
    {
      key: PER_TX_ALLOWANCE_KEY,
      refill: maxPerTxWei,
      maxRefill: maxPerTxWei,
      period: 0n,
      balance: maxPerTxWei,
      timestamp: 0n,
    },
    {
      key: DAILY_ALLOWANCE_KEY,
      refill: maxDailyWei,
      maxRefill: maxDailyWei,
      period: daySeconds,
      balance: maxDailyWei,
      timestamp: 0n,
    },
  ]
}
