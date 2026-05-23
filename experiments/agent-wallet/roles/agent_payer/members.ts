import type { Address } from 'viem'

/** Role members — agent EOA only. */
export function buildMembers(agentAddress: Address): Address[] {
  return [agentAddress]
}
