import { getAddress, isAddress } from 'viem'
import type { AppConfig, PolicyResult, TransferRequest } from './types.js'

function parseUsdAmount(value: string): number {
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) {
    throw new Error(`Invalid amount: ${value}`)
  }
  return n
}

export function toTokenUnits(amount: string, decimals: number): bigint {
  const [whole, frac = ''] = amount.split('.')
  const padded = (frac + '0'.repeat(decimals)).slice(0, decimals)
  return BigInt(whole) * 10n ** BigInt(decimals) + BigInt(padded || '0')
}

export function fromTokenUnits(amount: bigint, decimals: number): string {
  const base = 10n ** BigInt(decimals)
  const whole = amount / base
  const frac = amount % base
  if (frac === 0n) return whole.toString()
  const fracStr = frac.toString().padStart(decimals, '0').replace(/0+$/, '')
  return `${whole}.${fracStr}`
}

export interface PolicyOptions {
  /** When false, only whitelist / expiry / method — for demo_over_limit chain revert */
  enforceLimits?: boolean
}

export function checkPolicy(
  app: AppConfig,
  req: TransferRequest,
  opts: PolicyOptions = {},
): PolicyResult {
  const enforceLimits = opts.enforceLimits !== false
  if (!isAddress(req.to)) {
    return { ok: false, reason: 'invalid_recipient_address' }
  }

  const expiresAt = new Date(app.policy.expiresAt)
  if (Number.isNaN(expiresAt.getTime())) {
    return { ok: false, reason: 'invalid_policy_expires_at' }
  }
  if (new Date() > expiresAt) {
    return { ok: false, reason: 'policy_expired' }
  }

  if (!app.policy.allowedMethods.includes(req.method)) {
    return { ok: false, reason: 'method_not_allowed' }
  }

  const allowed = app.policy.allowedRecipients.map((a) => getAddress(a))
  const to = getAddress(req.to)
  if (!allowed.includes(to)) {
    return { ok: false, reason: 'transfer_to_unlisted_address' }
  }

  let amountNum: number
  try {
    amountNum = parseUsdAmount(req.amount)
  } catch {
    return { ok: false, reason: 'invalid_amount' }
  }

  if (enforceLimits) {
    const maxPerTx = parseUsdAmount(app.policy.maxPerTx)
    const maxDaily = parseUsdAmount(app.policy.maxDaily)

    if (amountNum > maxPerTx) {
      return { ok: false, reason: 'exceeds_max_per_tx' }
    }
    if (amountNum > maxDaily) {
      return { ok: false, reason: 'exceeds_max_daily' }
    }
  }

  return { ok: true }
}

/** Demo 2: exceeds typical on-chain allowance (e.g. 1 USDC) — app limits skipped */
export const DEMO_OVER_LIMIT_AMOUNT = '2.0'

/** Demo 3: non-whitelisted recipient */
export const DEMO_NOT_WHITELISTED_TO =
  '0x000000000000000000000000000000000000dEaD' as const
