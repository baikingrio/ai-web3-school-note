import { createPublicClient, http, erc20Abi } from 'viem'
import { sepolia } from 'viem/chains'
import { loadEnv } from './config.js'
import type { AppConfig } from './types.js'
import { fromTokenUnits } from './policy.js'

export async function getSafeTokenBalance(app: AppConfig): Promise<{
  symbol: string
  address: string
  balance: string
  balanceRaw: string
}> {
  const { rpcUrl } = loadEnv()
  const client = createPublicClient({ chain: sepolia, transport: http(rpcUrl) })
  const raw = await client.readContract({
    address: app.token.address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [app.safeAddress],
  })
  return {
    symbol: app.token.symbol,
    address: app.token.address,
    balance: fromTokenUnits(raw, app.token.decimals),
    balanceRaw: raw.toString(),
  }
}
