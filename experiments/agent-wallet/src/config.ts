import { readFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { config as loadDotenv } from 'dotenv'
import { z } from 'zod'
import type { Address } from 'viem'
import type { AppConfig } from './types.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
export const PACKAGE_ROOT = resolve(__dirname, '..')

const address = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/)
  .transform((v) => v as Address)

const ConfigSchema = z.object({
  network: z.string(),
  chainId: z.number(),
  safeAddress: address,
  agentAddress: address,
  moduleAddress: address,
  token: z.object({
    symbol: z.string(),
    address: address,
    decimals: z.number().int().positive(),
  }),
  policy: z.object({
    expiresAt: z.string(),
    maxPerTx: z.string(),
    maxDaily: z.string(),
    allowedRecipients: z.array(address).min(1),
    allowedMethods: z.array(z.string()).min(1),
    deny: z.array(z.string()),
    onViolation: z.literal('reject'),
  }),
  simulation: z.object({
    enabled: z.boolean(),
    requireHumanReadableSummary: z.boolean(),
  }),
  logging: z.object({
    path: z.string(),
    format: z.literal('jsonl'),
  }),
})

import type { EnvConfig } from './types.js'

export function loadEnv(): EnvConfig {
  loadDotenv({ path: join(PACKAGE_ROOT, '.env') })
  loadDotenv({ path: join(PACKAGE_ROOT, '../../.env') })

  const rpcUrl = process.env.SEPOLIA_RPC_URL
  const agentPrivateKey = process.env.AGENT_PRIVATE_KEY as `0x${string}` | undefined

  if (!rpcUrl) {
    throw new Error('Missing SEPOLIA_RPC_URL in .env')
  }
  if (!agentPrivateKey || agentPrivateKey === '0x') {
    throw new Error('Missing AGENT_PRIVATE_KEY in .env (testnet only)')
  }

  return {
    rpcUrl,
    agentPrivateKey,
    dryRun: process.env.DRY_RUN === 'true',
  }
}

export function loadAppConfig(): AppConfig {
  const configPath = join(PACKAGE_ROOT, 'config.json')
  const examplePath = join(PACKAGE_ROOT, 'config.example.json')
  const path = existsSync(configPath) ? configPath : examplePath

  if (!existsSync(configPath)) {
    console.warn(
      '[config] config.json not found — using config.example.json. Copy to config.json and fill addresses before live demos.',
    )
  }

  const raw = JSON.parse(readFileSync(path, 'utf-8'))
  return ConfigSchema.parse(raw) as AppConfig
}

export function resolveLogPath(app: AppConfig): string {
  return resolve(PACKAGE_ROOT, app.logging.path)
}
