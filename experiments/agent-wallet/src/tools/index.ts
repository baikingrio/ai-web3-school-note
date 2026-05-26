import { getAddress } from 'viem'
import { loadAppConfig } from '../config.js'
import { getSpendingStatus } from '../daily-budget.js'
import { getSafeTokenBalance } from '../query.js'
import { runPay } from '../pay.js'
import type { AppConfig } from '../types.js'

export function getWalletPolicy(app: AppConfig) {
  return {
    ok: true,
    network: app.network,
    chainId: app.chainId,
    executionPath: app.executionPath,
    safeAddress: app.safeAddress,
    agentAddress: app.agentAddress,
    rolesModAddress: app.rolesModAddress,
    roleKey: app.roleKey,
    token: app.token,
    policy: app.policy,
    humanCheck: app.humanCheck,
    simulation: app.simulation,
  }
}

export async function toolGetPolicy() {
  return getWalletPolicy(loadAppConfig())
}

export async function toolGetSpendingStatus() {
  const app = loadAppConfig()
  return { ok: true, ...getSpendingStatus(app) }
}

export async function toolGetBalance() {
  const app = loadAppConfig()
  const balance = await getSafeTokenBalance(app)
  return { ok: true, safeAddress: app.safeAddress, ...balance }
}

export async function toolSimulateWalletPay(to: string, amount: string) {
  const outcome = await runPay(
    {
      to: getAddress(to),
      amount,
      method: 'transfer',
      scenario: 'tool_simulate',
    },
    { broadcast: false, scenario: 'tool_simulate' },
  )
  return { ok: outcome.decision !== 'rejected', ...outcome }
}

export async function toolAgentWalletPay(
  to: string,
  amount: string,
  options: { dry?: boolean; confirm?: boolean } = {},
) {
  const broadcast = !options.dry
  const outcome = await runPay(
    {
      to: getAddress(to),
      amount,
      method: 'transfer',
      scenario: 'tool_pay',
    },
    {
      broadcast,
      scenario: 'tool_pay',
      humanConfirm: options.confirm,
    },
  )
  return { ok: outcome.decision !== 'rejected', ...outcome }
}
