import $ from 'jquery'
import { openModal, lockModal } from '../../lib/modals'
import { makeContractCall, setupChart, isSupportedNetwork } from './utils'

export function openClaimWithdrawalModal (event, store) {
  if (!isSupportedNetwork(store)) return

  const address = $(event.target).closest('[data-address]').data('address')

  store.getState().channel
    .push('render_claim_withdrawal', { address })
    .receive('ok', msg => {
      const $modal = $(msg.html)
      setupChart($modal.find('.js-stakes-progress'), msg.self_staked_amount, msg.total_staked_amount)
      $modal.find('form').submit(() => {
        claimWithdraw($modal, address, store)
        return false
      })
      openModal($modal)
    })
}

function claimWithdraw ($modal, address, store) {
  lockModal($modal)

  const stakingContract = store.getState().stakingContract

  makeContractCall(stakingContract.methods.claimOrderedWithdraw(address), store)
}
