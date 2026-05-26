import type { Address, Hash } from 'viem'

export type Decision = 'executed' | 'rejected' | 'simulated'
export type PolicyEnforcement = 'app' | 'both'
export type ExecutionPath = 'zodiac_roles'
export type HumanCheckLevel = 'L0' | 'L1' | 'L2' | 'L3'

export interface HumanCheckConfig {
  confirmAboveAmount: string
  ownerSignatureAboveAmount: string
}

export type RejectLayer =
  | 'app_policy'
  | 'zodiac_roles'
  | 'module_guard'
  | 'allowance_module'
  | 'unknown'

export interface AppConfig {
  network: string
  chainId: number
  executionPath: ExecutionPath
  safeAddress: Address
  agentAddress: Address
  rolesModAddress: Address
  roleKey: string
  token: {
    symbol: string
    address: Address
    decimals: number
  }
  policy: {
    enforcement: PolicyEnforcement
    expiresAt: string
    maxPerTx: string
    maxDaily: string
    allowedRecipients: Address[]
    allowedMethods: string[]
    deny: string[]
    onViolation: 'reject'
  }
  simulation: {
    enabled: boolean
    requireHumanReadableSummary: boolean
  }
  logging: {
    path: string
    format: 'jsonl'
  }
  humanCheck: HumanCheckConfig
}

export interface TransferRequest {
  to: Address
  amount: string
  method: string
  scenario?: string
}

export interface PolicyResult {
  ok: boolean
  reason?: string
  layer?: RejectLayer
}

export interface AuditEntry {
  ts: string
  scenario: string
  decision: Decision
  reason?: string
  rejectLayer?: RejectLayer
  humanCheckLevel?: HumanCheckLevel
  to?: Address
  amount?: string
  simulationSummary?: string
  txHash?: Hash
  safeAddress?: Address
  agentAddress?: Address
}

export interface EnvConfig {
  rpcUrl: string
  agentPrivateKey: `0x${string}`
  dryRun: boolean
}
