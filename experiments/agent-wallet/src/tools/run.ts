#!/usr/bin/env node
import { emitToolError, emitToolResult } from './emit.js'
import {
  toolAgentWalletPay,
  toolGetBalance,
  toolGetPolicy,
  toolGetSpendingStatus,
  toolSimulateWalletPay,
} from './index.js'

function parseArgs(argv: string[]) {
  const positional = argv.filter((a) => !a.startsWith('--'))
  const getFlag = (name: string) => {
    const i = argv.indexOf(name)
    return i >= 0 ? argv[i + 1] : undefined
  }
  return {
    cmd: positional[0],
    dry: argv.includes('--dry'),
    confirm: argv.includes('--confirm'),
    to: getFlag('--to'),
    amount: getFlag('--amount'),
  }
}

async function main() {
  const { cmd, dry, confirm, to, amount } = parseArgs(process.argv.slice(2))

  try {
    switch (cmd) {
      case 'get-policy':
        emitToolResult(await toolGetPolicy())
      case 'get-spending-status':
        emitToolResult(await toolGetSpendingStatus())
      case 'get-balance':
        emitToolResult(await toolGetBalance())
      case 'simulate':
        if (!to || !amount) emitToolError('Missing --to or --amount')
        emitToolResult(await toolSimulateWalletPay(to, amount))
      case 'pay':
        if (!to || !amount) emitToolError('Missing --to or --amount')
        emitToolResult(
          await toolAgentWalletPay(to, amount, { dry, confirm }),
        )
      default:
        emitToolError(
          'Unknown tool. Use: get-policy | get-spending-status | get-balance | simulate | pay',
        )
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    emitToolError(message)
  }
}

main()
