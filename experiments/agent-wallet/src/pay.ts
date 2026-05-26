import type { Address } from 'viem'
import { loadAppConfig, loadEnv, resolveLogPath } from './config.js'
import { baseAudit, writeAudit } from './audit.js'
import {
  executeRolesTransfer,
  extractRevertDetail,
  mapRolesError,
} from './roles.js'
import { checkPolicy, type PolicyOptions } from './policy.js'
import { checkHumanCheck } from './human-check.js'
import type { AppConfig, AuditEntry, PolicyEnforcement, TransferRequest } from './types.js'

export interface PayOptions {
  broadcast: boolean
  scenario: string
  enforceLimits?: boolean
  enforcement?: PolicyEnforcement
  skipAppWhitelist?: boolean
  humanConfirm?: boolean
}

export interface PayOutcome {
  decision: AuditEntry['decision']
  reason?: string
  rejectLayer?: AuditEntry['rejectLayer']
  humanCheckLevel?: AuditEntry['humanCheckLevel']
  simulationSummary?: string
  txHash?: AuditEntry['txHash']
}

function rejectPay(
  logPath: string,
  scenario: string,
  partial: {
    reason: string
    rejectLayer: AuditEntry['rejectLayer']
    humanCheckLevel?: AuditEntry['humanCheckLevel']
    to?: Address
    amount?: string
    safeAddress?: Address
    agentAddress?: Address
  },
): PayOutcome {
  const entry = baseAudit(scenario, {
    decision: 'rejected',
    ...partial,
  })
  writeAudit(logPath, entry)
  console.log(
    `[reject] ${partial.reason} (layer: ${partial.rejectLayer})` +
      (partial.humanCheckLevel ? ` [${partial.humanCheckLevel}]` : ''),
  )
  return {
    decision: 'rejected',
    reason: partial.reason,
    rejectLayer: partial.rejectLayer,
    humanCheckLevel: partial.humanCheckLevel,
  }
}

export async function runPay(
  req: TransferRequest,
  options: PayOptions,
): Promise<PayOutcome> {
  const app = loadAppConfig()
  const logPath = resolveLogPath(app)

  const human = checkHumanCheck(app, req, {
    broadcast: options.broadcast,
    humanConfirm: options.humanConfirm,
  })
  if (!human.ok) {
    return rejectPay(logPath, options.scenario, {
      reason: human.reason,
      rejectLayer: 'app_policy',
      humanCheckLevel: human.level,
      to: req.to,
      amount: req.amount,
      safeAddress: app.safeAddress,
      agentAddress: app.agentAddress,
    })
  }

  const policy = checkPolicy(app, req, {
    enforceLimits: options.enforceLimits,
    enforcement: options.enforcement,
    skipAppWhitelist: options.skipAppWhitelist,
  })
  if (!policy.ok) {
    return rejectPay(logPath, options.scenario, {
      reason: policy.reason!,
      rejectLayer: policy.layer ?? 'app_policy',
      humanCheckLevel: human.level,
      to: req.to,
      amount: req.amount,
      safeAddress: app.safeAddress,
      agentAddress: app.agentAddress,
    })
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
      humanCheckLevel: human.level,
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
      humanCheckLevel: human.level,
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
      humanCheckLevel: human.level,
      simulationSummary: revertDetail,
      to: req.to,
      amount: req.amount,
      safeAddress: app.safeAddress,
      agentAddress: app.agentAddress,
    })
    writeAudit(logPath, entry)
    console.error(`[reject] ${reason} (layer: ${layer})${revertDetail ? `: ${revertDetail}` : ''}`)
    return {
      decision: 'rejected',
      reason,
      rejectLayer: layer,
      humanCheckLevel: human.level,
    }
  }
}

export function firstWhitelistedRecipient(app: AppConfig): Address {
  return app.policy.allowedRecipients[0]
}
