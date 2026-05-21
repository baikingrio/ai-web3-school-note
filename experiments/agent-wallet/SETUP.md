# Sepolia 链上准备（Phase 0）

完成本清单后，复制 `config.example.json` 为 `config.json` 并填入真实地址。

## 1. 环境变量

```bash
cd experiments/agent-wallet
cp .env.example .env
# 编辑 .env：SEPOLIA_RPC_URL、AGENT_PRIVATE_KEY
```

## 2. 身份

| 角色 | 说明 |
|------|------|
| **Owner** | 你的主钱包，作为 Safe owner（不在 `.env` 提交 Agent 以外的 owner 钥亦可，仅用 Safe UI 操作） |
| **Agent** | 新建 Sepolia 专用 EOA，私钥写入 `AGENT_PRIVATE_KEY` |

查看模块与代币地址：

```bash
npm run setup:info
```

## 3. 创建 Safe

1. 打开 [app.safe.global](https://app.safe.global/)，切换 **Sepolia**
2. 创建 1-of-1 Safe，记录 `safeAddress`
3. 向 Safe 转入 Sepolia ETH（gas）

## 4. 测试 USDC

- 合约：`0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`（Circle Sepolia USDC）
- 从 [Circle faucet](https://faucet.circle.com/) 或 Sepolia 水龙头领取后 **转入 Safe**

## 5. 启用 Allowance Module（Spending Limits）

在 Safe UI：

1. **Apps** → **Spending limits**（Allowance Module）
2. 添加 **delegate** = Agent EOA 地址
3. 设置额度（建议与 `config.json` 一致）：
   - 单笔 / 周期：**1 USDC** per transfer cap（UI 表述可能为 daily allowance）
   - 日限额：**5 USDC**（reset 1440 分钟）

模块合约地址（Sepolia v0.1.0）：

`0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134`

> 勿使用仅部署在小链的 v0.1.1 地址；以 `@safe-global/safe-modules-deployments` 在 chainId `11155111` 解析结果为准。

## 6. 白名单收款方

准备一个受控 EOA 作为 `policy.allowedRecipients[0]`（可与 Owner 不同）。

## 7. config.json

```bash
cp config.example.json config.json
```

填写：

- `safeAddress`
- `agentAddress`（与 `AGENT_PRIVATE_KEY` 对应）
- `policy.allowedRecipients[0]`

## 8. 验证

```bash
npm run demo:success
```

## 撤销演示（Demo 4）

在 Safe UI → Spending limits → **Remove delegate**（或移除该 token allowance），然后：

```bash
npm run demo:after-revoke
```
