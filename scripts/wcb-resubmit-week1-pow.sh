#!/usr/bin/env bash
# 可选：向 WCB 补交/更新 Week 1 PoW Pack（写入前请确认 proof 正文）
set -euo pipefail
cd "$(dirname "$0")/.."
set -a && source .env && set +a

TASK_ID="cmp3jyrjn07skn301qopx9rwe"
COMMIT=$(git rev-parse --short HEAD)

PROOF=$(cat <<EOF
Week 1 Proof-of-Work Pack 总入口：
https://github.com/baikingrio/ai-web3-school-note/blob/main/submissions/week1-pow-pack.md

当前仓库 commit：${COMMIT}

Hackathon 项目 AgentScoope Wallet v0.3：
https://github.com/baikingrio/ai-web3-school-note/tree/main/experiments/agent-wallet

链上成功执行（Sepolia）：
https://sepolia.etherscan.io/tx/0x70583881b975348b89609459dba6e2ab7c5c21a59c647291a541cc36646914b5

审计 JSONL（五条 demo，含 after-revoke）：
https://github.com/baikingrio/ai-web3-school-note/blob/main/experiments/agent-wallet/logs/pow-audit-v0.3.jsonl

Week 1 学习总结：
https://github.com/baikingrio/ai-web3-school-note/blob/main/tasks/week1-learning-summary.md

隐私说明：不含私钥、助记词、API Key 或 .env。
EOF
)

echo "=== 将提交到 task ${TASK_ID} ==="
echo "$PROOF"
echo
read -r -p "确认提交？(y/N) " ans
[[ "$ans" == "y" || "$ans" == "Y" ]] || exit 0

curl -sS -X POST "https://web3career.build/api/agent/call" \
  -H "Authorization: Bearer $WCB_AGENT_SECRET_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(python3 -c "import json,sys; print(json.dumps({'procedure':'tasks.submitEvidence','input':{'taskId':'$TASK_ID','proof':sys.stdin.read()}}, ensure_ascii=False))" <<< "$PROOF")" \
  | python3 -m json.tool
