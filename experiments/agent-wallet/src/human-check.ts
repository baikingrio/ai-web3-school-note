import type { AppConfig, HumanCheckLevel, TransferRequest } from './types.js'

function parseAmount(value: string): number {
  const n = Number(value)
  if (!Number.isFinite(n) || n < 0) {
    throw new Error(`Invalid amount: ${value}`)
  }
  return n
}

export function resolveHumanCheckLevel(
  app: AppConfig,
  req: TransferRequest,
): HumanCheckLevel {
  const amount = parseAmount(req.amount)
  const ownerAt = parseAmount(app.humanCheck.ownerSignatureAboveAmount)
  const confirmAt = parseAmount(app.humanCheck.confirmAboveAmount)

  if (amount >= ownerAt) return 'L2'
  if (amount >= confirmAt) return 'L1'
  return 'L0'
}

export interface HumanCheckOptions {
  broadcast: boolean
  humanConfirm?: boolean
}

export type HumanCheckResult =
  | { ok: true; level: HumanCheckLevel }
  | {
      ok: false
      level: HumanCheckLevel
      reason: 'requires_owner_signature' | 'human_confirm_required'
    }

export function checkHumanCheck(
  app: AppConfig,
  req: TransferRequest,
  options: HumanCheckOptions,
): HumanCheckResult {
  const level = resolveHumanCheckLevel(app, req)

  if (!options.broadcast) {
    return { ok: true, level }
  }

  if (level === 'L2') {
    return { ok: false, level, reason: 'requires_owner_signature' }
  }

  if (level === 'L1') {
    const confirmed =
      options.humanConfirm === true || process.env.HUMAN_CONFIRM === '1'
    if (!confirmed) {
      return { ok: false, level, reason: 'human_confirm_required' }
    }
  }

  return { ok: true, level }
}
