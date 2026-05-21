import type { Address } from 'viem'
import { loadAppConfig, loadEnv, resolveLogPath } from './config.js'
import { baseAudit, writeAudit } from './audit.js'
import {
  executeAllowanceTransfer,
  extractRevertDetail,
  mapChainError,
} from './allowance.js'
import { checkPolicy } from './policy.js'
import type { AppConfig, AuditEntry, TransferRequest } from './types.js'

export interface PayOptions {
  broadcast: boolean
  scenario: string
  /** Skip app maxPerTx / maxDaily — demo_over_limit hits chain allowance */
  enforceLimits?: boolean
}

export interface PayOutcome {
  decision: AuditEntry['decision']
  reason?: string
  simulationSummary?: string
  txHash?: AuditEntry['txHash']
}

export async function runPay(
  req: TransferRequest,
  options: PayOptions,
): Promise<PayOutcome> {
  const app = loadAppConfig()
  const logPath = resolveLogPath(app)

  const policy = checkPolicy(app, req, {
    enforceLimits: options.enforceLimits,
  })
  if (!policy.ok) {
    const entry = baseAudit(options.scenario, {
      decision: 'rejected',
      reason: policy.reason,
      to: req.to,
      amount: req.amount,
      safeAddress: app.safeAddress,
      agentAddress: app.agentAddress,
    })
    writeAudit(logPath, entry)
    console.log(`[reject] ${policy.reason}`)
    return { decision: 'rejected', reason: policy.reason }
  }

  if (!app.simulation.enabled) {
    throw new Error('Simulation must be enabled for v0.1')
  }

  const env = loadEnv()

  try {
    const result = await executeAllowanceTransfer(
      app,
      env,
      { to: req.to, amountHuman: req.amount },
      { broadcast: options.broadcast },
    )

    const decision = options.broadcast && !env.dryRun ? 'executed' : 'simulated'
    const entry = baseAudit(options.scenario, {
      decision,
      to: req.to,
      amount: req.amount,
      simulationSummary: result.simulationSummary,
      txHash: result.txHash,
      safeAddress: app.safeAddress,
      agentAddress: app.agentAddress,
    })
    writeAudit(logPath, entry)
    console.log(result.simulationSummary)
    if (result.txHash) {
      console.log(`[executed] https://sepolia.etherscan.io/tx/${result.txHash}`)
    }
    return {
      decision,
      simulationSummary: result.simulationSummary,
      txHash: result.txHash,
    }
  } catch (err) {
    const reason = mapChainError(err)
    const revertDetail = extractRevertDetail(err)
    const entry = baseAudit(options.scenario, {
      decision: 'rejected',
      reason,
      simulationSummary: revertDetail,
      to: req.to,
      amount: req.amount,
      safeAddress: app.safeAddress,
      agentAddress: app.agentAddress,
    })
    writeAudit(logPath, entry)
    console.error(`[reject] ${reason}${revertDetail ? `: ${revertDetail}` : ''}`)
    return { decision: 'rejected', reason }
  }
}

export function firstWhitelistedRecipient(app: AppConfig): Address {
  return app.policy.allowedRecipients[0]
}
