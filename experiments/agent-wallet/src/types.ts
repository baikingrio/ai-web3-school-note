import type { Address, Hash } from 'viem'

export type Decision = 'executed' | 'rejected' | 'simulated'

export interface AppConfig {
  network: string
  chainId: number
  safeAddress: Address
  agentAddress: Address
  moduleAddress: Address
  token: {
    symbol: string
    address: Address
    decimals: number
  }
  policy: {
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
}

export interface AuditEntry {
  ts: string
  scenario: string
  decision: Decision
  reason?: string
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

export interface AllowanceState {
  amount: bigint
  spent: bigint
  resetTimeMin: bigint
  lastResetMin: bigint
  nonce: number
}
