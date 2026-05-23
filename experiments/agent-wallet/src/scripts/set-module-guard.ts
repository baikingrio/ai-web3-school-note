/**
 * Owner script: call Safe.setModuleGuard(moduleGuardAddress).
 * Requires: SEPOLIA_RPC_URL, OWNER_PRIVATE_KEY, config.json with safeAddress + moduleGuardAddress
 */
import { createWalletClient, http, encodeFunctionData } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'
import { loadAppConfig } from '../config.js'

const SAFE_ABI = [
  {
    name: 'setModuleGuard',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: '_moduleGuard', type: 'address' }],
    outputs: [],
  },
  {
    name: 'nonce',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'getTransactionHash',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'data', type: 'bytes' },
      { name: 'operation', type: 'uint8' },
      { name: 'safeTxGas', type: 'uint256' },
      { name: 'baseGas', type: 'uint256' },
      { name: 'gasPrice', type: 'uint256' },
      { name: 'gasToken', type: 'address' },
      { name: 'refundReceiver', type: 'address' },
      { name: '_nonce', type: 'uint256' },
    ],
    outputs: [{ type: 'bytes32' }],
  },
  {
    name: 'execTransaction',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'data', type: 'bytes' },
      { name: 'operation', type: 'uint8' },
      { name: 'safeTxGas', type: 'uint256' },
      { name: 'baseGas', type: 'uint256' },
      { name: 'gasPrice', type: 'uint256' },
      { name: 'gasToken', type: 'address' },
      { name: 'refundReceiver', type: 'address' },
      { name: 'signatures', type: 'bytes' },
    ],
    outputs: [{ type: 'bool' }],
  },
] as const

async function main() {
  console.error(
    '[deprecated] Module Guard path replaced by Zodiac Roles (v0.3). See SETUP.md appendix B.',
  )
  process.exit(1)

  const ownerKey = process.env.OWNER_PRIVATE_KEY as `0x${string}` | undefined
  if (!ownerKey || ownerKey === '0x') {
    throw new Error('Set OWNER_PRIVATE_KEY in .env (Safe owner, testnet only)')
  }

  const app = loadAppConfig()
  if (!app.moduleGuardAddress) {
    throw new Error('config.json missing moduleGuardAddress — deploy guard first')
  }

  const data = encodeFunctionData({
    abi: SAFE_ABI,
    functionName: 'setModuleGuard',
    args: [app.moduleGuardAddress],
  })

  console.log(`Setting module guard on Safe ${app.safeAddress}`)
  console.log(`Guard: ${app.moduleGuardAddress}`)
  console.log(
    'For 1-of-1 Safe, use Safe UI Settings → Module guard, or complete execTransaction signing in your wallet.',
  )
  console.log('Calldata for setModuleGuard:', data)
  console.log('See SETUP.md § Module Guard for deploy + UI steps.')
}

main().catch(console.error)
