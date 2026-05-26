import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { sumDailySpent, checkDailyBudget, wouldExceedDailyBudget } from './daily-budget.js'
import type { AppConfig } from './types.js'

const baseApp = {
  token: { symbol: 'USDC', address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', decimals: 6 },
  policy: { maxDaily: '5.0', maxPerTx: '1.0' },
} as Pick<AppConfig, 'token' | 'policy'>

describe('daily-budget', () => {
  it('sums executed amounts in 24h window', () => {
    const dir = mkdtempSync(join(tmpdir(), 'audit-'))
    const log = join(dir, 'audit.jsonl')
    const now = Date.now()
    const recent = new Date(now - 60_000).toISOString()
    const old = new Date(now - 25 * 60 * 60 * 1000).toISOString()
    writeFileSync(
      log,
      [
        JSON.stringify({ ts: recent, decision: 'executed', amount: '1.5' }),
        JSON.stringify({ ts: recent, decision: 'rejected', amount: '9' }),
        JSON.stringify({ ts: old, decision: 'executed', amount: '4' }),
        JSON.stringify({ ts: recent, decision: 'simulated', amount: '2' }),
      ].join('\n') + '\n',
    )
    const spent = sumDailySpent(log, 6, now)
    assert.equal(spent, 1_500_000n)
  })

  it('detects exceeds_daily_budget', () => {
    const dir = mkdtempSync(join(tmpdir(), 'audit-'))
    const log = join(dir, 'audit.jsonl')
    const recent = new Date().toISOString()
    writeFileSync(
      log,
      JSON.stringify({ ts: recent, decision: 'executed', amount: '3.0' }) + '\n',
    )
    const app = {
      ...baseApp,
      policy: { ...baseApp.policy, maxDaily: '5.0' },
    } as AppConfig
    assert.equal(wouldExceedDailyBudget(app, '3.0', log), true)
    const check = checkDailyBudget(app, '3.0', log)
    assert.equal(check.ok, false)
    if (!check.ok) assert.equal(check.reason, 'exceeds_daily_budget')
  })
})
