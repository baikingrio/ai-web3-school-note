#!/usr/bin/env node
import { getAddress } from 'viem'
import { loadAppConfig } from './config.js'
import { getSpendingStatus, wouldExceedDailyBudget } from './daily-budget.js'
import {
  DEMO_DAILY_BUDGET_AMOUNT,
  DEMO_HUMAN_CONFIRM_AMOUNT,
  DEMO_NOT_WHITELISTED_TO,
  DEMO_OVER_LIMIT_AMOUNT,
  DEMO_OWNER_REQUIRED_AMOUNT,
} from './policy.js'
import { firstWhitelistedRecipient, runPay } from './pay.js'

const DEMO_SUCCESS_AMOUNT = '0.5'

function usage(): never {
  console.log(`
AgentScoope Wallet CLI

  npm run pay -- --to <address> --amount <human> [--dry] [--confirm]
  npm run tool -- get-policy
  npm run demo -- <success|...|daily-budget|human-confirm|owner-required> [--dry] [--confirm]

Examples:
  npm run demo:success
  npm run tool -- get-policy
  npm run pay -- --to 0x... --amount 0.5 --confirm
`)
  process.exit(1)
}

function parseArgs(argv: string[]) {
  const dry = argv.includes('--dry')
  const confirm = argv.includes('--confirm')
  const positional = argv.filter((a) => !a.startsWith('--'))
  const getFlag = (name: string) => {
    const i = argv.indexOf(name)
    return i >= 0 ? argv[i + 1] : undefined
  }
  return { dry, confirm, positional, to: getFlag('--to'), amount: getFlag('--amount') }
}

async function main() {
  const [, , cmd, sub, ...rest] = process.argv
  const { dry, confirm, positional, to, amount } = parseArgs(rest)
  const broadcast = !dry

  if (cmd === 'pay') {
    if (!to || !amount) usage()
    await runPay(
      { to: getAddress(to), amount, method: 'transfer', scenario: 'pay' },
      { broadcast, scenario: 'pay', humanConfirm: confirm },
    )
    return
  }

  if (cmd === 'demo') {
    const name = sub ?? positional[0]
    const app = loadAppConfig()
    const whitelist = firstWhitelistedRecipient(app)

    switch (name) {
      case 'success':
        await runPay(
          {
            to: whitelist,
            amount: DEMO_SUCCESS_AMOUNT,
            method: 'transfer',
            scenario: 'demo_success',
          },
          { broadcast, scenario: 'demo_success' },
        )
        break
      case 'over-limit':
        await runPay(
          {
            to: whitelist,
            amount: DEMO_OVER_LIMIT_AMOUNT,
            method: 'transfer',
            scenario: 'demo_over_limit',
          },
          {
            broadcast: false,
            scenario: 'demo_over_limit',
            enforceLimits: false,
          },
        )
        break
      case 'not-whitelisted':
        await runPay(
          {
            to: DEMO_NOT_WHITELISTED_TO,
            amount: DEMO_SUCCESS_AMOUNT,
            method: 'transfer',
            scenario: 'demo_not_whitelisted',
          },
          { broadcast: false, scenario: 'demo_not_whitelisted' },
        )
        break
      case 'roles-only':
        console.log(
          '[info] skipAppWhitelist=true — expect zodiac_roles reject on simulate',
        )
        await runPay(
          {
            to: DEMO_NOT_WHITELISTED_TO,
            amount: DEMO_SUCCESS_AMOUNT,
            method: 'transfer',
            scenario: 'demo_roles_only',
          },
          {
            broadcast: false,
            scenario: 'demo_roles_only',
            skipAppWhitelist: true,
          },
        )
        break
      case 'after-revoke':
        console.log(
          '[info] Remove agent from role (npm run roles:revoke) before this demo.',
        )
        await runPay(
          {
            to: whitelist,
            amount: DEMO_SUCCESS_AMOUNT,
            method: 'transfer',
            scenario: 'demo_after_revoke',
          },
          { broadcast, scenario: 'demo_after_revoke' },
        )
        break
      case 'daily-budget': {
        const status = getSpendingStatus(app)
        console.log(
          `[info] 24h used ${status.used24h} / ${status.maxDaily} ${app.token.symbol}`,
        )
        if (!wouldExceedDailyBudget(app, DEMO_DAILY_BUDGET_AMOUNT)) {
          console.log(
            '[info] Tip: after executed spends totaling >2 USDC in audit, 3 USDC should hit exceeds_daily_budget',
          )
        }
        await runPay(
          {
            to: whitelist,
            amount: DEMO_DAILY_BUDGET_AMOUNT,
            method: 'transfer',
            scenario: 'demo_daily_budget',
          },
          { broadcast: false, scenario: 'demo_daily_budget' },
        )
        break
      }
      case 'human-confirm':
        console.log('[info] L1: amount >= confirmAboveAmount without --confirm')
        await runPay(
          {
            to: whitelist,
            amount: DEMO_HUMAN_CONFIRM_AMOUNT,
            method: 'transfer',
            scenario: 'demo_human_confirm',
          },
          { broadcast, scenario: 'demo_human_confirm', humanConfirm: false },
        )
        break
      case 'owner-required':
        console.log('[info] L2: amount >= ownerSignatureAboveAmount')
        await runPay(
          {
            to: whitelist,
            amount: DEMO_OWNER_REQUIRED_AMOUNT,
            method: 'transfer',
            scenario: 'demo_owner_required',
          },
          { broadcast, scenario: 'demo_owner_required' },
        )
        break
      default:
        usage()
    }
    return
  }

  usage()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
