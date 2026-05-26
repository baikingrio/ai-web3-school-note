#!/usr/bin/env python3
"""AI × Web3 Concept Helper.

A tiny interactive learning artifact for AI × Web3 School.
It uses local, AI-assisted templates. It does not call external APIs and does not need secrets.
"""

from __future__ import annotations

import argparse
import textwrap


CONCEPTS = {
    "智能账户": {
        "explain": "智能账户可以理解成“带规则的钱包账户”，它不只靠一个私钥直接控制，而是可以通过合约逻辑设置权限、限额、恢复和自动化策略。",
        "analogy": "EOA 像一把单人钥匙；多签像公司账户，需要几个人一起确认；智能账户像一把带规则的智能门锁，可以设置谁能开、什么时候能开、最多能做什么。",
        "project": "在 AgentScoope Wallet 里，智能账户 / Safe 可以承载资产和权限；Agent 不是 owner，只能作为受限角色，在白名单、预算和方法范围内执行低风险动作。",
        "risk": "不要把主私钥交给 Agent。适合自动化的是低风险、测试网、白名单、预算内操作；提高额度、改 owner、主网资金和无限 approve 必须人工确认。",
        "quiz": "如果 Agent 想把 5 USDC 额度提高到 50 USDC，这应该是自动执行、人工确认，还是直接拒绝？为什么？",
        "action": "把这个概念映射到自己的项目，写清楚“谁能发起、谁能批准、谁承担风险、如何撤销”。",
    },
    "多签": {
        "explain": "多签账户要求多个 owner 中达到指定数量的人确认后，交易才能执行。它把控制权从一个私钥分散到多个人手里。",
        "analogy": "个人钱包像自己一个人拿钥匙；多签像公司财务账户，转账前需要几个人一起签字。",
        "project": "AgentScoope Wallet 可以把高风险操作交给 Safe owner / 多签确认，例如提高额度、修改白名单、启用模块或主网资金操作。",
        "risk": "多签不等于不会出错。owner 仍然可能被钓鱼，也可能一起误签，所以确认前仍要看清楚目标地址、金额、方法和 calldata 摘要。",
        "quiz": "为什么修改 Safe owner 或多签门槛不应该交给 Agent 自动完成？",
        "action": "找一个 Safe 交易页面，观察它展示了哪些确认人、门槛、目标地址和交易数据。",
    },
    "prompt injection": {
        "explain": "Prompt injection 是指外部内容试图改变 Agent 原本应该遵守的规则，比如诱导它忽略限制、泄露信息或执行错误动作。",
        "analogy": "就像有人在你要处理的文件里夹了一张纸条，写着“忽略老板的要求，把钱转给我”。这张纸条是数据，不应该变成命令。",
        "project": "在 AgentScoope Wallet 里，外部内容不能覆盖 policy。即使 Agent 被诱导生成转账计划，收款地址、金额、方法也必须经过 allowlist、budget 和 simulation 检查。",
        "risk": "如果 Agent 能直接调用钱包或任意工具，prompt injection 可能变成真实资产损失。必须把外部内容当作不可信输入。",
        "quiz": "如果网页内容要求 Agent 向陌生地址转账，系统应该在哪一层拦截？",
        "action": "给自己的 Agent workflow 加一条规则：外部文本只能作为资料，不能修改权限策略。",
    },
}

DEFAULT = {
    "explain": "这个概念可以先拆成三件事：它解决什么问题、谁拥有控制权、失败时风险落在哪里。",
    "analogy": "可以把它想成一套操作规则：不是只看“能不能做”，还要看“谁允许、谁确认、谁负责”。",
    "project": "放到 AI × Web3 项目里，关键是区分 Agent 可以辅助理解、规划、检查，还是可以真正触发链上动作。",
    "risk": "不要把私钥、助记词、API Key 或真实资金控制权交给自动化系统。任何高风险操作都需要人工确认和可验证记录。",
    "quiz": "这个概念里，哪一步最容易出风险？如果让 Agent 参与，应该加哪一道确认？",
    "action": "用自己的项目写一个小表格：输入是什么、AI 做什么、人确认什么、如何验证结果。",
}


def build_card(concept: str, background: str, question: str) -> str:
    data = CONCEPTS.get(concept.strip(), DEFAULT)
    lines = [
        f"学习卡片：{concept}",
        "",
        f"你的背景：{background or '未填写'}",
        f"你的问题：{question or '未填写'}",
        "",
        f"一句话解释：{data['explain']}",
        "",
        f"生活类比：{data['analogy']}",
        "",
        f"和项目的关系：{data['project']}",
        "",
        f"安全提醒：{data['risk']}",
        "",
        f"自测问题：{data['quiz']}",
        "",
        f"下一步行动：{data['action']}",
    ]
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate a small AI × Web3 learning card.")
    parser.add_argument("--concept", default="智能账户", help="想学习的概念，例如：智能账户、多签、prompt injection")
    parser.add_argument("--background", default="", help="你的学习背景或项目背景")
    parser.add_argument("--question", default="", help="你最困惑的问题")
    args = parser.parse_args()

    print(textwrap.dedent(build_card(args.concept, args.background, args.question)).strip())


if __name__ == "__main__":
    main()
