import 'dotenv/config';

import {
  AuditApi,
  BalanceApi,
  Configuration,
  HealthApi,
  PactsApi,
  TransactionsApi,
  WalletsApi,
} from '@cobo/agentic-wallet';

const command = process.argv[2] ?? 'dry-run';
const execute = process.argv.includes('--execute');

const env = {
  basePath: process.env.AGENT_WALLET_API_URL,
  apiKey: process.env.AGENT_WALLET_API_KEY,
  walletId: process.env.AGENT_WALLET_WALLET_ID,
  chainId: process.env.CAW_CHAIN_ID ?? 'SETH',
  tokenId: process.env.CAW_TOKEN_ID ?? 'SETH_USDC',
  allowedAmount: process.env.CAW_ALLOWED_AMOUNT ?? '0.001',
  deniedAmount: process.env.CAW_DENIED_AMOUNT ?? '0.005',
  denyThreshold: process.env.CAW_DENY_THRESHOLD ?? '0.002',
  destination:
    process.env.CAW_DESTINATION ?? '0x1111111111111111111111111111111111111111',
};

type ApiErrorPayload = {
  error?: { code?: string; reason?: string; details?: Record<string, unknown> };
  suggestion?: string;
};

function requireEnv(keys: Array<keyof typeof env>): void {
  const missing = keys.filter(key => !env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required env: ${missing.join(', ')}. Copy .env.example to .env and fill local CAW credentials.`,
    );
  }
}

function config(apiKey = env.apiKey): Configuration {
  requireEnv(['basePath']);
  return new Configuration({
    basePath: env.basePath,
    apiKey,
    baseOptions: {
      timeout: 30_000,
      headers: { 'User-Agent': 'PactTrader-CAW-Minimal/0.1' },
    },
  });
}

function parseApiError(err: unknown): { http: number | string; payload: ApiErrorPayload } {
  const response = (err as { response?: { status?: number; data?: unknown } }).response;
  const payload =
    response?.data && typeof response.data === 'object'
      ? (response.data as ApiErrorPayload)
      : {};
  return { http: response?.status ?? '-', payload };
}

function pactRequest() {
  return {
    wallet_id: env.walletId ?? '<AGENT_WALLET_WALLET_ID>',
    intent:
      'PactTrader demo: allow a small testnet token transfer while blocking amounts above the configured threshold.',
    spec: {
      policies: [
        {
          name: 'pacttrader-small-transfer-limit',
          type: 'transfer',
          rules: {
            effect: 'allow',
            when: {
              chain_in: [env.chainId],
              token_in: [{ chain_id: env.chainId, token_id: env.tokenId }],
            },
            deny_if: { amount_gt: env.denyThreshold },
          },
        },
      ],
      completion_conditions: [
        { type: 'time_elapsed', threshold: '86400' },
        { type: 'tx_count', threshold: '3' },
      ],
    },
  };
}

function transferRequest(amount = env.allowedAmount) {
  return {
    chain_id: env.chainId,
    dst_addr: env.destination,
    token_id: env.tokenId,
    amount,
    request_id: `pacttrader-demo-${amount}-${Date.now()}`,
  };
}

async function dryRun(): Promise<void> {
  console.log('CAW SDK minimal dry-run: no network call, no transaction broadcast.');
  console.log('\n[SDK] package: @cobo/agentic-wallet@0.1.7');
  console.log('[APIs used] HealthApi, WalletsApi, BalanceApi, PactsApi, TransactionsApi, AuditApi');
  console.log('\n[Pact submit payload preview]');
  console.log(JSON.stringify(pactRequest(), null, 2));
  console.log('\n[Allowed transfer payload preview]');
  console.log(JSON.stringify(transferRequest(env.allowedAmount), null, 2));
  console.log('\n[Denied transfer payload preview]');
  console.log(JSON.stringify(transferRequest(env.deniedAmount), null, 2));
  console.log('\nNext: fill .env, then run `npm run inspect`. Use `npm run submit-pact -- --execute` only after confirming scope.');
}

async function inspect(): Promise<void> {
  requireEnv(['basePath', 'apiKey']);
  const cfg = config();
  const health = new HealthApi(cfg);
  const wallets = new WalletsApi(cfg);
  const balances = new BalanceApi(cfg);
  const pacts = new PactsApi(cfg);

  console.log('[1/4] Health check');
  const healthResp = await health.healthCheck();
  console.log(JSON.stringify(healthResp.data, null, 2));

  console.log('\n[2/4] Wallets (first 10)');
  const walletResp = await wallets.listWallets(undefined, undefined, undefined, 10);
  console.log(JSON.stringify(walletResp.data.result, null, 2));

  if (env.walletId) {
    console.log('\n[3/4] Balances for configured wallet');
    const balanceResp = await balances.listBalances(env.walletId, env.chainId, undefined, undefined, false, 20);
    console.log(JSON.stringify(balanceResp.data.result, null, 2));

    console.log('\n[4/4] Pacts for configured wallet (first 10)');
    const pactResp = await pacts.listPacts(undefined, env.walletId, undefined, undefined, undefined, 10);
    console.log(JSON.stringify(pactResp.data.result, null, 2));
  } else {
    console.log('\n[3/4] Skip balances: AGENT_WALLET_WALLET_ID not set.');
    console.log('[4/4] Skip wallet pacts: AGENT_WALLET_WALLET_ID not set.');
  }
}

async function submitPact(): Promise<void> {
  requireEnv(['basePath', 'apiKey', 'walletId']);
  if (!execute) {
    console.log('Refusing to submit pact without --execute. Payload preview:');
    console.log(JSON.stringify(pactRequest(), null, 2));
    return;
  }

  const pacts = new PactsApi(config());
  const response = await pacts.submitPact(pactRequest() as any);
  const result = response.data.result as any;
  console.log('Pact submitted. Owner may need to approve it in Cobo Agentic Wallet app.');
  console.log(JSON.stringify(result, null, 2));
  console.log('\nIf result.status becomes active, use result.api_key as pact-scoped API key for execution.');
}

async function transfer(): Promise<void> {
  requireEnv(['basePath', 'apiKey', 'walletId']);
  if (!execute) {
    console.log('Refusing to transfer without --execute. Payload preview:');
    console.log(JSON.stringify(transferRequest(env.allowedAmount), null, 2));
    return;
  }

  const tx = new TransactionsApi(config());
  const audit = new AuditApi(config());

  try {
    console.log(`[1/2] Submitting allowed transfer ${env.allowedAmount} ${env.tokenId}`);
    const response = await tx.transferTokens(env.walletId!, transferRequest(env.allowedAmount) as any);
    console.log(JSON.stringify(response.data.result, null, 2));
  } catch (err) {
    const { http, payload } = parseApiError(err);
    console.log(`Transfer failed or was denied. http=${http}`);
    console.log(JSON.stringify(payload, null, 2));
  }

  console.log('\n[2/2] Recent audit logs for wallet');
  const logs = await audit.listAuditLogs(env.walletId, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 10);
  console.log(JSON.stringify(logs.data.result, null, 2));
}

async function main(): Promise<void> {
  switch (command) {
    case 'dry-run':
      await dryRun();
      break;
    case 'inspect':
      await inspect();
      break;
    case 'submit-pact':
      await submitPact();
      break;
    case 'transfer':
      await transfer();
      break;
    default:
      throw new Error(`Unknown command: ${command}. Use dry-run | inspect | submit-pact | transfer`);
  }
}

main().catch(err => {
  const { http, payload } = parseApiError(err);
  if (payload.error || payload.suggestion) {
    console.error(`CAW API error http=${http}`);
    console.error(JSON.stringify(payload, null, 2));
  } else {
    console.error(err);
  }
  process.exit(1);
});
