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
  executionPath: z.literal('zodiac_roles').default('zodiac_roles'),
  safeAddress: address,
  agentAddress: address,
  rolesModAddress: address,
  roleKey: z.string().min(1),
  token: z.object({
    symbol: z.string(),
    address: address,
    decimals: z.number().int().positive(),
  }),
  policy: z.object({
    enforcement: z.enum(['app', 'both']).default('both'),
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

function loadDotenvFiles(): void {
  loadDotenv({ path: join(PACKAGE_ROOT, '.env') })
  loadDotenv({ path: join(PACKAGE_ROOT, '../../.env') })
}

export function loadOwnerEnv(): { rpcUrl: string; ownerPrivateKey: `0x${string}` } {
  loadDotenvFiles()
  const rpcUrl = process.env.SEPOLIA_RPC_URL
  const ownerPrivateKey = process.env.OWNER_PRIVATE_KEY as `0x${string}` | undefined
  if (!rpcUrl) {
    throw new Error('Missing SEPOLIA_RPC_URL in .env')
  }
  if (!ownerPrivateKey || ownerPrivateKey === '0x') {
    throw new Error('Missing OWNER_PRIVATE_KEY in .env (Safe owner, testnet only)')
  }
  return { rpcUrl, ownerPrivateKey }
}

export function loadEnv(): EnvConfig {
  loadDotenvFiles()

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
  const parsed = ConfigSchema.parse(raw) as AppConfig

  if (parsed.rolesModAddress === '0x0000000000000000000000000000000000000000') {
    throw new Error(
      'rolesModAddress must be your per-Safe Roles Modifier instance. Deploy via https://roles.gnosisguild.org (not the global factory 0x9646…).',
    )
  }

  if (parsed.executionPath !== 'zodiac_roles') {
    throw new Error('executionPath must be "zodiac_roles"')
  }

  return parsed
}

export function resolveLogPath(app: AppConfig): string {
  return resolve(PACKAGE_ROOT, app.logging.path)
}
