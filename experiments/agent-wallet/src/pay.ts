import type { Address } from 'viem'
import { loadAppConfig, loadEnv, resolveLogPath } from './config.js'
import { baseAudit, writeAudit } from './audit.js'
import {
  executeRolesTransfer,
  extractRevertDetail,
  mapRolesError,
} from './roles.js'
import { checkPolicy, type PolicyOptions } from './policy.js'
import type { AppConfig, AuditEntry, PolicyEnforcement, TransferRequest } from './types.js'

export interface PayOptions {
  broadcast: boolean
  scenario: string
  enforceLimits?: boolean
  enforcement?: PolicyEnforcement
  skipAppWhitelist?: boolean
}

export interface PayOutcome {
  decision: AuditEntry['decision']
  reason?: string
  rejectLayer?: AuditEntry['rejectLayer']
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
    enforcement: options.enforcement,
    skipAppWhitelist: options.skipAppWhitelist,
  })
  if (!policy.ok) {
    const entry = baseAudit(options.scenario, {
      decision: 'rejected',
      reason: policy.reason,
      rejectLayer: policy.layer ?? 'app_policy',
      to: req.to,
      amount: req.amount,
      safeAddress: app.safeAddress,
      agentAddress: app.agentAddress,
    })
    writeAudit(logPath, entry)
    console.log(`[reject] ${policy.reason} (layer: ${policy.layer ?? 'app_policy'})`)
    return {
      decision: 'rejected',
      reason: policy.reason,
      rejectLayer: policy.layer,
    }
  }

  if (!app.simulation.enabled) {
    throw new Error('Simulation must be enabled')
  }

  const env = loadEnv()

  try {
    const result = await executeRolesTransfer(
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
    const { reason, layer } = mapRolesError(err)
    const revertDetail = extractRevertDetail(err)
    const entry = baseAudit(options.scenario, {
      decision: 'rejected',
      reason,
      rejectLayer: layer,
      simulationSummary: revertDetail,
      to: req.to,
      amount: req.amount,
      safeAddress: app.safeAddress,
      agentAddress: app.agentAddress,
    })
    writeAudit(logPath, entry)
    console.error(`[reject] ${reason} (layer: ${layer})${revertDetail ? `: ${revertDetail}` : ''}`)
    return { decision: 'rejected', reason, rejectLayer: layer }
  }
}

export function firstWhitelistedRecipient(app: AppConfig): Address {
  return app.policy.allowedRecipients[0]
}
