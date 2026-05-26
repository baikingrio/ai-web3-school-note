import { readFileSync, existsSync } from 'node:fs'
import type { AppConfig, AuditEntry } from './types.js'
import { toTokenUnits, fromTokenUnits } from './policy.js'
import { resolveLogPath } from './config.js'

const WINDOW_MS = 24 * 60 * 60 * 1000

export function readAuditEntries(logPath: string): AuditEntry[] {
  if (!existsSync(logPath)) return []
  const lines = readFileSync(logPath, 'utf-8').trim().split('\n').filter(Boolean)
  const entries: AuditEntry[] = []
  for (const line of lines) {
    try {
      entries.push(JSON.parse(line) as AuditEntry)
    } catch {
      // skip malformed lines
    }
  }
  return entries
}

/** Sum human amounts for executed transfers in the rolling 24h window. */
export function sumDailySpent(
  logPath: string,
  decimals: number,
  now = Date.now(),
): bigint {
  const cutoff = now - WINDOW_MS
  let total = 0n
  for (const entry of readAuditEntries(logPath)) {
    if (entry.decision !== 'executed' || !entry.amount) continue
    const ts = new Date(entry.ts).getTime()
    if (Number.isNaN(ts) || ts < cutoff) continue
    total += toTokenUnits(entry.amount, decimals)
  }
  return total
}

export interface SpendingStatus {
  windowHours: number
  maxDaily: string
  used24h: string
  remaining24h: string
  used24hWei: string
}

export function getSpendingStatus(app: AppConfig, logPath?: string): SpendingStatus {
  const path = logPath ?? resolveLogPath(app)
  const decimals = app.token.decimals
  const usedWei = sumDailySpent(path, decimals)
  const maxWei = toTokenUnits(app.policy.maxDaily, decimals)
  const remainingWei = usedWei >= maxWei ? 0n : maxWei - usedWei
  return {
    windowHours: 24,
    maxDaily: app.policy.maxDaily,
    used24h: fromTokenUnits(usedWei, decimals),
    remaining24h: fromTokenUnits(remainingWei, decimals),
    used24hWei: usedWei.toString(),
  }
}

export function wouldExceedDailyBudget(
  app: AppConfig,
  amountHuman: string,
  logPath?: string,
): boolean {
  const path = logPath ?? resolveLogPath(app)
  const decimals = app.token.decimals
  const used = sumDailySpent(path, decimals)
  const req = toTokenUnits(amountHuman, decimals)
  const max = toTokenUnits(app.policy.maxDaily, decimals)
  return used + req > max
}

export function checkDailyBudget(
  app: AppConfig,
  amountHuman: string,
  logPath?: string,
): { ok: true } | { ok: false; reason: 'exceeds_daily_budget' } {
  if (wouldExceedDailyBudget(app, amountHuman, logPath)) {
    return { ok: false, reason: 'exceeds_daily_budget' }
  }
  return { ok: true }
}
