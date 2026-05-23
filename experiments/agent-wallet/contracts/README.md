# AgentScoope Module Guard

Safe **Module Guard** for Allowance Module USDC transfers.

## Commands

```bash
forge test
forge script script/DeployGuard.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast
```

Requires `DEPLOYER_PRIVATE_KEY` and optional `GUARD_RECIPIENTS` in env.

After deploy, call `setModuleGuard(guard)` on your Safe (see `../SETUP.md`).
