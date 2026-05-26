import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { resolveHumanCheckLevel, checkHumanCheck } from './human-check.js'
import type { AppConfig, TransferRequest } from './types.js'

const app = {
  humanCheck: { confirmAboveAmount: '0.8', ownerSignatureAboveAmount: '5.0' },
} as AppConfig

const req = (amount: string): TransferRequest => ({
  to: '0x6Ab1a68c4a6Ba2384050Ed1411d9B91C30EC902E',
  amount,
  method: 'transfer',
})

describe('human-check', () => {
  it('resolves L0 / L1 / L2 by amount', () => {
    assert.equal(resolveHumanCheckLevel(app, req('0.5')), 'L0')
    assert.equal(resolveHumanCheckLevel(app, req('0.9')), 'L1')
    assert.equal(resolveHumanCheckLevel(app, req('6')), 'L2')
  })

  it('L1 requires confirm on broadcast', () => {
    const noConfirm = checkHumanCheck(app, req('0.9'), { broadcast: true })
    assert.equal(noConfirm.ok, false)
    if (!noConfirm.ok) assert.equal(noConfirm.reason, 'human_confirm_required')

    const confirmed = checkHumanCheck(app, req('0.9'), {
      broadcast: true,
      humanConfirm: true,
    })
    assert.equal(confirmed.ok, true)
  })

  it('L2 blocks broadcast', () => {
    const r = checkHumanCheck(app, req('6'), { broadcast: true })
    assert.equal(r.ok, false)
    if (!r.ok) assert.equal(r.reason, 'requires_owner_signature')
  })

  it('simulate skips L1 gate', () => {
    const r = checkHumanCheck(app, req('0.9'), { broadcast: false })
    assert.equal(r.ok, true)
  })
})
