import { appendFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import type { AuditEntry } from './types.js'

export function writeAudit(logPath: string, entry: AuditEntry): void {
  mkdirSync(dirname(logPath), { recursive: true })
  appendFileSync(logPath, `${JSON.stringify(entry)}\n`, 'utf-8')
}

export function baseAudit(
  scenario: string,
  partial: Partial<Omit<AuditEntry, 'ts' | 'scenario'>> & Pick<AuditEntry, 'decision'>,
): AuditEntry {
  return {
    ts: new Date().toISOString(),
    scenario,
    ...partial,
  }
}
