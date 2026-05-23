import {
  concat,
  createPublicClient,
  createWalletClient,
  http,
  numberToHex,
  sliceHex,
  type Address,
  type Hash,
  type Hex,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'

const SAFE_ABI = [
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

export interface SafeExecParams {
  safeAddress: Address
  to: Address
  data: Hex
  value?: bigint
  operation?: 0 | 1
  ownerPrivateKey: Hex
  rpcUrl: string
}

/** 1-of-1 Safe: sign and broadcast execTransaction. */
export async function execViaSafe(params: SafeExecParams): Promise<Hash> {
  const account = privateKeyToAccount(params.ownerPrivateKey)
  const transport = http(params.rpcUrl)
  const publicClient = createPublicClient({ chain: sepolia, transport })
  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport,
  })

  const value = params.value ?? 0n
  const operation = params.operation ?? 0
  const safeTxGas = 0n
  const baseGas = 0n
  const gasPrice = 0n
  const gasToken = '0x0000000000000000000000000000000000000000' as Address
  const refundReceiver = '0x0000000000000000000000000000000000000000' as Address

  const nonce = await publicClient.readContract({
    address: params.safeAddress,
    abi: SAFE_ABI,
    functionName: 'nonce',
  })

  const safeTxHash = await publicClient.readContract({
    address: params.safeAddress,
    abi: SAFE_ABI,
    functionName: 'getTransactionHash',
    args: [
      params.to,
      value,
      params.data,
      operation,
      safeTxGas,
      baseGas,
      gasPrice,
      gasToken,
      refundReceiver,
      nonce,
    ],
  })

  let signature = await account.sign({ hash: safeTxHash })
  const v = Number(sliceHex(signature, 64))
  if (v < 27) {
    signature = concat([sliceHex(signature, 0, 64), numberToHex(v + 4, { size: 1 })])
  }

  const { request } = await publicClient.simulateContract({
    address: params.safeAddress,
    abi: SAFE_ABI,
    functionName: 'execTransaction',
    args: [
      params.to,
      value,
      params.data,
      operation,
      safeTxGas,
      baseGas,
      gasPrice,
      gasToken,
      refundReceiver,
      signature,
    ],
    account,
  })

  const txHash = await walletClient.writeContract(request)
  await publicClient.waitForTransactionReceipt({ hash: txHash })
  return txHash
}
