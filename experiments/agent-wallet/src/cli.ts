#!/usr/bin/env node
import { getAddress } from 'viem'
import { loadAppConfig } from './config.js'
import {
  DEMO_NOT_WHITELISTED_TO,
  DEMO_OVER_LIMIT_AMOUNT,
} from './policy.js'
import { firstWhitelistedRecipient, runPay } from './pay.js'

const DEMO_SUCCESS_AMOUNT = '0.5'

function usage(): never {
  console.log(`
AgentScoope Wallet CLI

  npm run pay -- --to <address> --amount <human> [--dry]
  npm run demo -- <success|over-limit|not-whitelisted|after-revoke> [--dry]

Examples:
  npm run demo:success
  npm run pay -- --to 0x... --amount 0.5
`)
  process.exit(1)
}

function parseArgs(argv: string[]) {
  const dry = argv.includes('--dry')
  const positional = argv.filter((a) => !a.startsWith('--'))
  const getFlag = (name: string) => {
    const i = argv.indexOf(name)
    return i >= 0 ? argv[i + 1] : undefined
  }
  return { dry, positional, to: getFlag('--to'), amount: getFlag('--amount') }
}

async function main() {
  const [, , cmd, sub, ...rest] = process.argv
  const { dry, positional, to, amount } = parseArgs(rest)
  const broadcast = !dry

  if (cmd === 'pay') {
    if (!to || !amount) usage()
    await runPay(
      { to: getAddress(to), amount, method: 'transfer', scenario: 'pay' },
      { broadcast, scenario: 'pay' },
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
      case 'after-revoke':
        console.log(
          '[info] Ensure delegate was removed in Safe UI before this demo.',
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
