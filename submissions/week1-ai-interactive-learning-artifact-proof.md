# WCB 提交证明草稿：Week 1｜AI 向任务｜完成 AI 可交互学习产物

- Task ID: `cmp3jyqgx07san301erpv124n`
- Task Title: `Week 1｜AI 向任务｜完成 AI 可交互学习产物`
- Status checked: `NOT_STARTED`, `available=true`
- Points: `30`

## 建议提交证明

我做了一个最小可交互 AI 学习产物：**AI × Web3 Concept Helper**。

公开链接：

https://github.com/baikingrio/ai-web3-school-note/tree/main/experiments/ai-web3-concept-helper

它是一个本地可运行的小工具，用来帮助我或其他同学学习 AI / Web3 概念。用户输入一个概念、自己的学习背景和困惑点，工具会生成一张学习卡片，包括一句话解释、生活类比、和项目的关系、安全提醒、自测问题和下一步行动。

## 1. 它解决什么学习问题

我在学习 AI × Web3 的时候，经常遇到的问题是：单个概念看起来能懂，但不知道怎么把它和自己的项目、风险边界、下一步行动联系起来。

所以这个小工具的目标不是做一个复杂产品，而是帮我把一个概念快速整理成“能继续行动”的学习卡片。

## 2. 用户如何与它交互

我做了两种交互方式：

1. 网页 demo：打开 `index.html`，选择概念，填写背景和困惑点，点击生成学习卡片。
2. CLI 小工具：运行 `python3 concept_helper.py`，通过参数输入概念、背景和问题。

示例命令：

```bash
cd experiments/ai-web3-concept-helper
python3 concept_helper.py --concept "智能账户" --background "我在做 AgentScoope Wallet" --question "它和 EOA、多签有什么区别？"
```

## 3. 输入示例和输出示例

输入示例：

```text
概念：智能账户
背景：我在做 AgentScoope Wallet，一个受限 Agent 钱包项目
困惑：智能账户和普通 EOA、多签到底差在哪里？
```

输出会生成一张学习卡片，内容包括：

- 一句话解释：智能账户可以理解成“带规则的钱包账户”；
- 生活类比：EOA 像单人钥匙，多签像公司账户，智能账户像带规则的智能门锁；
- 和项目的关系：在 AgentScoope Wallet 里，Safe / 智能账户可以承载资产和权限，Agent 不是 owner，只能作为受限角色执行低风险动作；
- 安全提醒：不要把主私钥交给 Agent，提高额度、修改 owner、主网资金和无限 approve 必须人工确认；
- 自测问题：如果 Agent 想把 5 USDC 额度提高到 50 USDC，应该自动执行、人工确认，还是直接拒绝？
- 下一步行动：把这个概念映射到自己的项目，写清楚谁能发起、谁能批准、谁承担风险、如何撤销。

## 4. 哪部分由 AI 生成，哪部分由我人工修改 / 验证

AI 辅助的部分：

- 学习卡片结构；
- 概念解释模板；
- 生活类比；
- 自测问题和下一步行动的初稿；
- HTML / Python demo 的初始代码。

我人工修改和验证的部分：

- 把内容改成和自己的 AgentScoope Wallet 项目相关；
- 检查 EOA、智能账户、多签、Safe、policy、human confirmation 等表述是否准确；
- 删除可能造成误解的危险表达，比如“Agent 自动处理主网资金”；
- 确认工具不需要 API Key，不会读取 `.env`，不会连接钱包，也不会发起任何链上交易。

## 5. 限制和下一步改进

目前限制：

1. 它不是接入真实 LLM 的产品，而是一个最小可交互 demo，输出来自预设的 AI 辅助模板和规则。
2. 它适合学习和整理概念，不适合作为投资、签名或链上操作建议。
3. 概念库还比较小，目前只覆盖智能账户、多签、prompt injection 等少量概念。
4. 它不会读取链上实时数据，也不会发起交易。

下一步改进：

- 增加更多概念：session key、Zodiac Roles、Safe module、ERC-4337、audit log；
- 增加风险分级输出：L0 自动、L1 确认、L2 owner / 多签、L3 拒绝；
- 和 AgentScoope Wallet 的 README / audit log 结合，自动生成学习复盘卡片；
- 如果未来接入真实 LLM，API Key 只放在本地环境，不能写进 repo。

## 6. 隐私与安全说明

本证明和 demo 不包含 API Key、token、私钥、助记词、`.env` 文件或真实资产信息。工具只做本地文本生成，不连接钱包，也不发起任何链上交易。
