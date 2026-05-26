/**
 * Non-LLM end-to-end: tools JSON + policy/human-check demos (simulate only).
 */
import { loadAppConfig, PACKAGE_ROOT } from '../config.js'
import { firstWhitelistedRecipient, runPay } from '../pay.js'
import {
  toolGetPolicy,
  toolGetSpendingStatus,
  toolSimulateWalletPay,
} from '../tools/index.js'
import {
  DEMO_HUMAN_CONFIRM_AMOUNT,
  DEMO_NOT_WHITELISTED_TO,
  DEMO_OWNER_REQUIRED_AMOUNT,
} from '../policy.js'

const DEMO_SUCCESS_AMOUNT = '0.5'

async function row(
  label: string,
  outcome: { decision?: string; reason?: string },
) {
  const d = outcome.decision ?? '—'
  const r = outcome.reason ? ` (${outcome.reason})` : ''
  console.log(`| ${label.padEnd(22)} | ${d.padEnd(10)} |${r}`)
}

async function main() {
  console.log('AgentScoope Wallet v0.4 — demo:e2e (simulate)\n')
  const app = loadAppConfig()
  const to = firstWhitelistedRecipient(app)

  console.log('--- Tools (JSON) ---')
  const policy = await toolGetPolicy()
  console.log('get-policy:', policy.ok, policy.roleKey)
  const spending = await toolGetSpendingStatus()
  console.log('get-spending-status:', spending.used24h, '/', spending.maxDaily)

  console.log('\n--- Pay matrix ---')
  console.log('| Scenario             | Decision   |')
  console.log('|----------------------|------------|')

  await row(
    'success',
    await runPay(
      { to, amount: DEMO_SUCCESS_AMOUNT, method: 'transfer', scenario: 'e2e_success' },
      { broadcast: false, scenario: 'e2e_success' },
    ),
  )
  await row(
    'not-whitelisted',
    await runPay(
      {
        to: DEMO_NOT_WHITELISTED_TO,
        amount: DEMO_SUCCESS_AMOUNT,
        method: 'transfer',
        scenario: 'e2e_not_whitelisted',
      },
      { broadcast: false, scenario: 'e2e_not_whitelisted' },
    ),
  )
  await row(
    'human-confirm (no flag)',
    await runPay(
      {
        to,
        amount: DEMO_HUMAN_CONFIRM_AMOUNT,
        method: 'transfer',
        scenario: 'e2e_human_confirm',
      },
      { broadcast: true, scenario: 'e2e_human_confirm', humanConfirm: false },
    ),
  )
  await row(
    'owner-required',
    await runPay(
      {
        to,
        amount: DEMO_OWNER_REQUIRED_AMOUNT,
        method: 'transfer',
        scenario: 'e2e_owner_required',
      },
      { broadcast: true, scenario: 'e2e_owner_required' },
    ),
  )

  const sim = await toolSimulateWalletPay(to, DEMO_SUCCESS_AMOUNT)
  console.log('\ntool simulate:', sim.ok, sim.decision)

  console.log(`\nPackage: ${PACKAGE_ROOT}`)
  console.log('Done. For live broadcast use npm run pay with --confirm when L1.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
